# Contributing to Clickraft Skills

Thanks for considering a contribution. This repo ships markdown SKILL.md files plus manifests — no build, no runtime code, no tests. The bar is "the agent reading SKILL.md does the right thing on the first try".

## Commit hygiene

This is a public repository. Commits MUST look like a human wrote them.

- **Conventional Commits required.** Format: `type(scope): description`. Types we use: `feat`, `fix`, `docs`, `refactor`, `chore`, `ci`.
- No AI authorship trailers (`Co-Authored-By: Claude …`, generator footers, etc.). If your tooling adds one by default, strip it before pushing.
- No mentions of AI, Claude, Anthropic, or any coding-agent product in commit messages.

## Branch convention

Prefix branches by change type so the history is scannable:

| Prefix | Use for |
|---|---|
| `feat/<slug>` | New skill or new behavior in an existing skill |
| `fix/<slug>` | Bug in an existing skill or manifest |
| `docs/<slug>` | README, INSTALL, CHANGELOG, contributing docs |
| `refactor/<slug>` | Re-shuffle without behavior change |
| `chore/<slug>` | Version bumps, dependency updates, housekeeping |
| `ci/<slug>` | Changes to `.github/workflows/` |

## PR checklist

Before requesting review, confirm every item below. CI enforces items 1–5 automatically via `.github/workflows/validate-skills.yml`; items 6–8 are reviewer-judgment.

1. **Frontmatter is valid.** YAML parses. `name` matches the directory exactly. `version` is set. `description` is under 1024 chars and includes the literal strings `Use when:` and `NOT for:`.
2. **Versions are in sync.** `VERSION`, every `plugins/*/skills/*/SKILL.md` frontmatter `version:`, every `plugins/*/.*-plugin/plugin.json` `version`, every `marketplace.json` plugin entry (`version` field or `source.ref` for the Codex local schema), and `compatibility.json.skills_version` all match.
3. **Marketplace listing is reachable.** Every skill folder is reachable from at least one of the three marketplace.json files via the plugin's `source` path → `plugin.json` → `skills/` autodiscovery.
4. **All references resolve.** Every `references/X.md` mentioned in any SKILL.md exists in that skill's bundle. Every file inside a `references/` directory is linked from its parent SKILL.md.
5. **Skill is self-contained.** No `../` parent-dir references in any SKILL.md or any file under `references/`. Each skill must be installable standalone.
6. **UX rules haven't been loosened.** If you weakened a rule like "no raw IDs in chat", "polling is silent", or "detect language and respond in it", say why in the PR description.
7. **CLI commands are real.** Every `clickraft …` example in your SKILL.md or any reference must be a current command that runs successfully against `@clickraft/cli` at the version in `compatibility.json`. Run it locally.
8. **Behavior change → docs change.** If you changed defaults, chain semantics, or the set of flags an agent should pass, the affected SKILL.md reflects it. An agent reading only SKILL.md should be able to execute correctly without external context.

## Adding a new skill

1. Pick a kebab-case slug (e.g. `product-shoot`, `video-clip`). The directory name and the `name:` frontmatter field MUST match.
2. Create `plugins/clickraft/skills/<skill-name>/SKILL.md`. Use the skeleton below.
3. Bump `VERSION` (patch for additions, minor for breaking changes). Sync every location listed in PR-checklist item 2.
4. Add a `## [<version>] — YYYY-MM-DD` entry to `CHANGELOG.md`.
5. Tag the release after merge: `git tag -a v<version> -m "..."` and `git push origin v<version>`. Then `gh release create v<version>`.

### SKILL.md skeleton

```yaml
---
version: 0.2.0                 # match VERSION
name: <skill-name>             # match the directory
description: |
  <One-paragraph elevator pitch.>

  Use when: "...", "...", "..."  # 6-12 trigger phrases the agent matches against
  NOT for: ... (use ... instead).
  Chain with: ... (or "none in Wave 1").
argument-hint: "[arg1] [--flag <value>]"
allowed-tools: Bash(clickraft:*)
---

# <Skill title>

## Quick start

<3-line minimal example.>

## UX rules

<Numbered list — concise behavioral rules.>

## When to ask

<When to default vs when to ask one question.>

## ...

<Skill-specific sections: prerequisites, invocation, response shape, errors.>

## Cost handling

<If the skill consumes credits.>
```

## Reference docs

- [INSTALL.md](./INSTALL.md) — install paths for all four agents
- [INSTALL_FOR_AGENTS.md](./INSTALL_FOR_AGENTS.md) — runbook agents follow autonomously
- [docs/ENVELOPE.md](./docs/ENVELOPE.md) — JSON envelope shape, exit codes, error codes
- [@clickraft/cli](https://github.com/clickraft/cli) — the CLI these skills invoke

## License

MIT — see [LICENSE](./LICENSE).
