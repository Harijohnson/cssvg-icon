# Commit Changes

Stage and commit changes with the correct message format for this project.

## Usage

```
/commit
```

---

## Commit Message Format

```
<type>(<scope>): <short description>
```

All lowercase. Present tense. No period at the end. Max 72 chars.

---

## Types

| Type | When to use | Example |
|---|---|---|
| `feat` | New icon, new page, new feature | `feat(icon): add bell icon` |
| `fix` | Bug fix | `fix(modal): color picker not closing` |
| `chore` | Config, CI, dependencies, tooling | `chore(ci): add icon validation workflow` |
| `docs` | README, CONTRIBUTING, markdown content | `docs(contributing): add PR guide` |
| `refactor` | Code cleanup, no behaviour change | `refactor(footer): simplify grid columns` |
| `style` | Visual/UI tweaks, no logic change | `style(modal): move animation controls to right` |
| `meta` | Metadata, sitemap, SEO changes | `meta(sitemap): add changeFrequency and priority` |

---

## Scopes

Use the part of the project the change touches:

| Scope | Covers |
|---|---|
| `icon` | Anything inside `icons/` |
| `docs` | `content/docs/` markdown files |
| `modal` | `components/IconDetailModal.tsx` |
| `explorer` | `components/IconExplorer.tsx` |
| `footer` | `components/Footer.tsx` |
| `header` | `components/Header.tsx` |
| `layout` | `app/layout.tsx` |
| `sitemap` | `app/sitemap.ts` |
| `ci` | `.github/workflows/` |
| `deps` | `package.json` dependency changes |
| `claude` | `CLAUDE.md` or `.claude/` files |

---

## Examples

```
feat(icon): add bell icon
fix(modal): color picker not closing on outside click
chore(ci): add pr title check workflow
docs(readme): add contributing and export guidelines links
style(modal): move animation controls to right panel
meta(sitemap): add priority and changeFrequency per page type
refactor(explorer): extract animation state to custom hook
feat(footer): add documentation column with all doc links
chore(deps): bump next to 16.1.7
docs(claude): add add-icon and update-docs slash commands
```

---

## Steps Claude Will Follow

1. Run `git status` to see what changed
2. Run `git diff` to review the actual changes
3. Determine the correct `type(scope):` prefix from the tables above
4. Write a short, clear description (what changed, not why)
5. Stage only the relevant files — never `git add .` blindly
6. Commit using a heredoc to preserve formatting:

```bash
git commit -m "$(cat <<'EOF'
type(scope): short description

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

7. Show the commit hash and summary when done

---

## Multi-file Commits

If a PR touches multiple scopes, use the most important scope and mention others in the body:

```
feat(icon): add settings and arrow-right icons

- icons/settings/ — animated gear with rotation
- icons/arrow-right/ — slide-right animation
```

---

## What NOT to do

- Never use `git add -A` or `git add .` — stage files by name
- Never amend a published commit
- Never skip hooks with `--no-verify`
- Never commit `.env` files or secrets
- Never commit `node_modules/`
