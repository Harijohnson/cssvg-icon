#!/usr/bin/env node
/**
 * write-blog.js
 * Uses OpenRouter API to write a detailed technical blog post about cssvg-icons,
 * grounded in the actual icon components and codebase.
 * Saves to seo/NNNN-slug.md
 *
 * Secrets required:
 *   OPENROUTER_API_KEY — OpenRouter API key (set in .env or GitHub Actions secret)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OpenRouter } from '@openrouter/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TOPICS_PATH = path.join(ROOT, 'data/devto-topics.json');
const SEO_DIR = path.join(ROOT, 'seo');
const CLAUDE_MD_PATH = path.join(ROOT, 'CLAUDE.md');
const ICONS_DIR = path.join(ROOT, 'icons');

// ── helpers ───────────────────────────────────────────────────────────────────

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function nextPostNumber() {
  if (!fs.existsSync(SEO_DIR)) {
    fs.mkdirSync(SEO_DIR, { recursive: true });
    return '0001';
  }
  const files = fs.readdirSync(SEO_DIR).filter((f) => f.endsWith('.md'));
  if (!files.length) return '0001';
  const nums = files.map((f) => parseInt(f.slice(0, 4), 10)).filter((n) => !isNaN(n));
  const max = Math.max(...nums);
  return String(max + 1).padStart(4, '0');
}

// ── read codebase context ─────────────────────────────────────────────────────

function getSampleIcons(count = 4) {
  if (!fs.existsSync(ICONS_DIR)) return [];
  const slugs = fs.readdirSync(ICONS_DIR).filter((s) => {
    const tsxPath = path.join(ICONS_DIR, s, `${s}.tsx`);
    return fs.existsSync(tsxPath);
  });

  // Pick a spread: take every Nth slug so we get variety
  const step = Math.max(1, Math.floor(slugs.length / count));
  const picked = [];
  for (let i = 0; i < slugs.length && picked.length < count; i += step) {
    picked.push(slugs[i]);
  }
  return picked;
}

function buildCodebaseContext() {
  let context = '';

  // CLAUDE.md — project overview
  const claudeMd = readFile(CLAUDE_MD_PATH);
  if (claudeMd) {
    const truncated = claudeMd.length > 4000 ? claudeMd.slice(0, 4000) + '\n... (truncated)' : claudeMd;
    context += `\n\n### CLAUDE.md (project overview)\n\`\`\`\n${truncated}\n\`\`\``;
  }

  // lib/icons-registry.ts
  const registry = readFile(path.join(ROOT, 'lib/icons-registry.ts'));
  if (registry) {
    const truncated = registry.length > 3000 ? registry.slice(0, 3000) + '\n... (truncated)' : registry;
    context += `\n\n### lib/icons-registry.ts\n\`\`\`ts\n${truncated}\n\`\`\``;
  }

  // components/IconRenderer.tsx
  const renderer = readFile(path.join(ROOT, 'components/IconRenderer.tsx'));
  if (renderer) {
    const truncated = renderer.length > 2000 ? renderer.slice(0, 2000) + '\n... (truncated)' : renderer;
    context += `\n\n### components/IconRenderer.tsx\n\`\`\`tsx\n${truncated}\n\`\`\``;
  }

  // Sample icon TSX + JSON files
  const samples = getSampleIcons(4);
  for (const slug of samples) {
    const tsx = readFile(path.join(ICONS_DIR, slug, `${slug}.tsx`));
    const json = readFile(path.join(ICONS_DIR, slug, `${slug}.json`));
    if (tsx) {
      const truncated = tsx.length > 2000 ? tsx.slice(0, 2000) + '\n... (truncated)' : tsx;
      context += `\n\n### icons/${slug}/${slug}.tsx\n\`\`\`tsx\n${truncated}\n\`\`\``;
    }
    if (json) {
      context += `\n\n### icons/${slug}/${slug}.json\n\`\`\`json\n${json}\n\`\`\``;
    }
  }

  return context;
}

// ── pick topic ────────────────────────────────────────────────────────────────

function pickTopic() {
  const topics = JSON.parse(fs.readFileSync(TOPICS_PATH, 'utf8'));
  return topics.find((t) => !t.devtoUrl) || null;
}

// ── call OpenRouter API ───────────────────────────────────────────────────────

async function generateBlogPost(topic, codebaseContext) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set');

  const topicInstruction = topic
    ? `Write about this topic: "${topic.title}"\nTags to use: ${topic.tags.join(', ')}\nSEO description to align with: ${topic.seoDescription}`
    : `All existing topics are published. Invent a fresh, deeply technical topic grounded in the cssvg-icons codebase. Good options:
- How SMIL additive transform stacking works in practice inside the icon components
- Building a per-icon detail page with Next.js generateStaticParams and JSON-LD
- Why vectorEffect="non-scaling-stroke" is essential for stroke-based icon libraries
- Animating SVG icons without JavaScript: a comparison of SMIL, CSS, and Web Animations API
- How to create a dark-mode-ready icon component using currentColor`;

  const systemPrompt = `You are a senior frontend engineer writing a technical blog post for the cssvg-icons project — a library of animated SVG icons for React and Next.js built on SMIL animations.

The live site is https://icon.cssvg.com and the npm package is cssvg-icons.

You have been given the actual source code and icon components of the project. Your post must be grounded in this real code, not generic advice.

Requirements:
- Length: 1500–2500 words
- No cover image, no image markdown anywhere
- At least 4 distinct code blocks showing real patterns from the codebase or copy-pasteable examples
- Explain the WHY behind design decisions, not just what the code does
- Short paragraphs (2–4 sentences), H2 headings, bullet lists where helpful
- Practical: readers should be able to apply these ideas in their own projects
- End with a short paragraph mentioning cssvg-icons at https://icon.cssvg.com

Output ONLY the markdown content including frontmatter. No preamble, no explanation.

Frontmatter format:
---
title: "..."
published: false
tags: tag1, tag2, tag3, tag4
series: "Animated SVG Icons with CSS"
---`;

  const openrouter = new OpenRouter({ apiKey });

  console.log('Calling OpenRouter API to generate blog post…');

  const stream = await openrouter.chat.send({
    chatRequest: {
      model: 'arcee-ai/trinity-large-thinking:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${topicInstruction}\n\nHere is the cssvg-icons codebase for reference:\n${codebaseContext}` },
      ],
      stream: true,
    },
  });

  let response = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      response += content;
      process.stdout.write(content);
    }
    if (chunk.usage) {
      console.log('\nReasoning tokens:', chunk.usage.reasoningTokens);
    }
  }

  if (!response) throw new Error('OpenRouter returned an empty response');

  // Strip wrapping ```markdown ... ``` fences some models add
  const stripped = response.trim();
  const fenceMatch = stripped.match(/^```(?:markdown)?\s*\n([\s\S]*?)(?:\n```\s*)?$/i);
  return fenceMatch ? fenceMatch[1].trim() : stripped;
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  const topic = pickTopic();
  if (topic) {
    console.log(`Next unpublished topic: "${topic.title}"`);
  } else {
    console.log('All topics published — inventing a fresh topic.');
  }

  const codebaseContext = buildCodebaseContext();
  const markdown = await generateBlogPost(topic, codebaseContext);

  // Extract title from frontmatter for filename
  const titleMatch = markdown.match(/^title:\s*"?(.+?)"?\s*$/m);
  const title = titleMatch ? titleMatch[1] : (topic?.title || 'untitled');
  const num = nextPostNumber();
  const filename = `${num}-${slugify(title)}.md`;
  const filepath = path.join(SEO_DIR, filename);

  if (!fs.existsSync(SEO_DIR)) {
    fs.mkdirSync(SEO_DIR, { recursive: true });
  }

  fs.writeFileSync(filepath, markdown);
  console.log(`\nBlog post written: seo/${filename}`);
  console.log('\nFirst 8 lines:');
  console.log(markdown.split('\n').slice(0, 8).join('\n'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
