# CLAUDE.md — Clickraft Skills Repository

Instructions for Claude Code sessions working in this repository.

## Commit hygiene

This is a **public repository**. Commits MUST appear as if written by a human contributor.

- NEVER include `Co-Authored-By: Claude <noreply@anthropic.com>` trailer
- NEVER include `🤖 Generated with Claude Code` footer
- NEVER mention Claude, AI, Anthropic, or any automated tool in commit messages or commit body
- Conventional Commits required: `type(scope): description`

If a commit accidentally includes an AI trailer, amend it before push:

```bash
git commit --amend --no-edit --trailer "Co-Authored-By="
```

## Architecture

This repo is the canonical distribution surface for Clickraft skills. It ships markdown SKILL.md files that teach AI coding agents (Claude Code, Cursor, Codex) how to use the `clickraft` CLI.

**Layout:**

- `plugins/clickraft/` — the canonical Clickraft plugin
  - `plugins/clickraft/.claude-plugin/plugin.json` — Claude Code plugin manifest
  - `plugins/clickraft/.cursor-plugin/plugin.json` — Cursor plugin manifest
  - `plugins/clickraft/.codex-plugin/plugin.json` — Codex plugin manifest
  - `plugins/clickraft/skills/<skill-name>/SKILL.md` — individual skills (one subdir each)
- `.claude-plugin/marketplace.json` — Claude Code marketplace manifest (repo root)
- `.cursor-plugin/marketplace.json` — Cursor marketplace manifest (repo root)
- `.agents/plugins/marketplace.json` — Codex local marketplace manifest (repo root, per Codex spec)
- `.agents/skills/` — locally installed reference skills (gitignored, managed by `npx skills add`)
- `VERSION` — single source of truth for the skills package version
- `compatibility.json` — declares min/max CLI version this skills release supports
- `skills-lock.json` — pins the reference skills installed via `npx skills add`

**No code in this repo.** Pure markdown + JSON. No build step. CI (when added) only validates manifest JSON schemas.

This repo is versioned independently from `@clickraft/cli`. The CLI is on npm; this repo is consumed by agents directly via git tags or by `clickraft skills update`.

## Update model

Wave 1: notifier-only. The CLI checks once per 24h for new git tags and prints a notice to stderr. Users run `clickraft skills update` to apply.

Wave 1.5+: signed pinned-SHA auto-sync via `api.clickraft.ai/skills/v1/manifest`.

## Adding a new skill

1. Read `.agents/skills/skill-creator/SKILL.md` for the canonical SKILL.md format (run `npx skills add` if the directory is missing).
2. Create `plugins/clickraft/skills/<skill-name>/SKILL.md` following that format. Use kebab-case for the skill name and a third-person description with trigger phrases.
3. Auto-discovery picks the skill up — no edits needed to `plugin.json` unless you set custom paths.
4. Bump VERSION (patch for additions, minor for breaking changes) and update each plugin manifest's `version` to match.
5. Update CHANGELOG.md.
6. Tag the release: `git tag -a v<version> -m "..."` and `git push origin v<version>`; `gh release create` from the tag.

## Schema conventions

All manifest JSON files MUST validate against their marketplace's published schema. Do not invent fields. If a future skill requires a feature unsupported by an existing schema, document the gap in a follow-up — do NOT add custom fields.
