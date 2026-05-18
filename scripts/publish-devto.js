#!/usr/bin/env node
/**
 * publish-devto.js
 * Reads the next unpublished blog post from seo/, generates a cover image
 * via Replicate (flux-2-pro), and publishes it to DEV.to.
 * Updates data/devto-topics.json with the published URL.
 *
 * Secrets required:
 *   DEVTO_API_KEY       — DEV.to API key
 *   REPLICATE_API_TOKEN — Replicate API token (optional — skipped if missing)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TOPICS_PATH = path.join(ROOT, 'data/devto-topics.json');
const SEO_DIR = path.join(ROOT, 'seo');

// ── helpers ──────────────────────────────────────────────────────────────────

function httpsRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      ...options,
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
    };
    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── find next unpublished blog post ──────────────────────────────────────────

function findNextPost(topics) {
  if (!fs.existsSync(SEO_DIR)) return null;

  const mdFiles = fs
    .readdirSync(SEO_DIR)
    .filter((f) => f.endsWith('.md') && f !== '.gitkeep')
    .sort();

  for (const filename of mdFiles) {
    const filepath = path.join(SEO_DIR, filename);
    const content = fs.readFileSync(filepath, 'utf8');

    // Extract title from frontmatter
    const titleMatch = content.match(/^title:\s*"?(.+?)"?\s*$/m);
    if (!titleMatch) continue;
    const title = titleMatch[1];

    // Find matching topic in topics list that isn't published yet
    const topic = topics.find(
      (t) => !t.devtoUrl && t.title.toLowerCase().trim() === title.toLowerCase().trim()
    );

    if (topic) {
      return { topic, filename, filepath, content };
    }
  }

  // Fallback: find any .md file whose topic hasn't been published yet
  // (matches by file order if title doesn't match exactly)
  const unpublishedTopics = topics.filter((t) => !t.devtoUrl);
  if (unpublishedTopics.length === 0) return null;

  for (const filename of mdFiles) {
    const filepath = path.join(SEO_DIR, filename);
    const content = fs.readFileSync(filepath, 'utf8');
    // Pick the first unpublished topic and pair with the first unmatched file
    const topic = unpublishedTopics[0];
    return { topic, filename, filepath, content };
  }

  return null;
}

// ── image generation via Replicate ───────────────────────────────────────────

async function generateImage(prompt) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    console.warn('REPLICATE_API_TOKEN not set, skipping image generation');
    return null;
  }

  const payload = JSON.stringify({
    input: {
      prompt,
      aspect_ratio: '16:9',
      resolution: '1 MP',
      output_format: 'jpg',
      output_quality: 85,
      safety_tolerance: 2,
    },
  });

  console.log('Creating Replicate prediction…');
  const create = await httpsRequest(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-2-pro/predictions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    },
    payload
  );

  if (create.status !== 201) {
    console.error('Replicate create failed:', create.body);
    return null;
  }

  const predictionId = create.body.id;
  const pollUrl = `https://api.replicate.com/v1/predictions/${predictionId}`;

  // Poll until done (max 3 min)
  for (let i = 0; i < 36; i++) {
    await sleep(5000);
    const poll = await httpsRequest(pollUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const { status, output } = poll.body;
    console.log(`Prediction status: ${status}`);
    if (status === 'succeeded' && output) return output;
    if (status === 'failed' || status === 'canceled') {
      console.error('Image generation failed:', poll.body.error);
      return null;
    }
  }

  console.error('Image generation timed out');
  return null;
}

// ── inject cover image into markdown ─────────────────────────────────────────

function injectCoverImage(markdown, imageUrl) {
  if (!imageUrl) return markdown;

  // Insert after the closing --- of the frontmatter
  const frontmatterEnd = markdown.indexOf('---', 3);
  if (frontmatterEnd === -1) return markdown;

  const before = markdown.slice(0, frontmatterEnd + 3);
  const after = markdown.slice(frontmatterEnd + 3);

  // Extract title for alt text
  const titleMatch = markdown.match(/^title:\s*"?(.+?)"?\s*$/m);
  const altText = titleMatch ? titleMatch[1] : 'Cover image';

  return `${before}\n\n![${altText}](${imageUrl})\n${after}`;
}

// ── DEV.to publisher ──────────────────────────────────────────────────────────

async function publishToDevTo(topic, markdownBody, imageUrl) {
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) throw new Error('DEVTO_API_KEY not set');

  // Extract tags from frontmatter
  const tagsMatch = markdownBody.match(/^tags:\s*(.+)$/m);
  const rawTags = tagsMatch
    ? tagsMatch[1].split(',').map((t) => t.trim().toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean)
    : topic.tags.map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);

  const payload = JSON.stringify({
    article: {
      title: topic.title,
      published: true,
      body_markdown: markdownBody,
      tags: rawTags.slice(0, 4),
      main_image: imageUrl || undefined,
      series: 'Animated SVG Icons with CSS',
      description: topic.seoDescription || undefined,
    },
  });

  const res = await httpsRequest(
    'https://dev.to/api/articles',
    {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'cssvg-icon-publisher/1.0',
      },
    },
    payload
  );

  console.log(`DEV.to response status: ${res.status}`);
  if (res.status === 401) throw new Error('DEV.to 401: Invalid API key.');
  if (res.status === 403) throw new Error('DEV.to 403: Forbidden. Verify email or check key permissions.');
  if (res.status !== 201) throw new Error(`DEV.to error ${res.status}: ${JSON.stringify(res.body)}`);

  console.log(`DEV.to published: https://dev.to/${res.body.slug}`);
  return res.body;
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  const topics = JSON.parse(fs.readFileSync(TOPICS_PATH, 'utf8'));

  const next = findNextPost(topics);
  if (!next) {
    console.log('No unpublished blog posts found in seo/ — run write-blog.js first.');
    return;
  }

  const { topic, filename, filepath, content } = next;
  console.log(`\nPublishing "${topic.title}" from seo/${filename}`);

  const imageUrl = await generateImage(topic.imagePrompt);
  if (imageUrl) console.log(`Cover image: ${imageUrl}`);

  const markdownWithCover = injectCoverImage(content, imageUrl);

  const devtoArticle = await publishToDevTo(topic, markdownWithCover, imageUrl);

  // Update topics JSON with published state
  topic.published = true;
  topic.publishedAt = new Date().toISOString();
  topic.coverImageUrl = imageUrl || null;
  topic.devtoUrl = `https://dev.to/${devtoArticle.slug}`;
  fs.writeFileSync(TOPICS_PATH, JSON.stringify(topics, null, 2));
  console.log(`Updated data/devto-topics.json`);

  if (process.env.GITHUB_ACTIONS) {
    execSync('git config user.name "github-actions[bot]"');
    execSync('git config user.email "github-actions[bot]@users.noreply.github.com"');
    execSync('git add data/devto-topics.json');
    execSync('git diff --cached --quiet || git commit -m "chore: mark topic as published on dev.to"');
    execSync('git pull --rebase origin main');
    execSync('git push');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
