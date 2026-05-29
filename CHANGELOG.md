# Changelog

All notable changes to Clickraft Skills are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.1] -- 2026-05-29

### Added
- `clickraft-workflow-authoring` skill — teaches agents to author multi-node
  Clickraft workflow graphs from a natural-language request: discover node types
  (`nodes list` / `nodes describe`), create a workflow, assemble `add_node` /
  `add_edge` ops in the canonical write shape, and apply with `--auto-rev`.
  - Carries the mutation op schema and the edge **write** shape (`from/to`),
    which are not discoverable from `workflow apply --help`.
  - `references/op-schema.md` — the six-op schema verbatim from source
    (md5-pinned), plus the edge write-vs-read mapping.
  - `references/node-catalog.md` — node-type landscape, wire-`type`-string vs
    directory-name gotchas, and the agent-writable-field model.
  - Worked example: reference image → 5 Instagram ads (`batchCount: 5`, `4:5`).

### Changed
- All manifests and VERSION bumped to `0.4.1`.
- `compatibility.json` `skills_version` set to `0.4.1`.

## [0.4.0] -- 2026-05-25

### Added
- `## Brand model context` section in `generate-image/SKILL.md` -- documents
  `--brand-model <uuid>:<pose>` flag (repeatable, max 3), pose options,
  discovery via `clickraft brand-model list --json`, and when-to-ask guidance.
- `## Product context` section -- documents `--product <uuid>:<imageId>` flag
  (repeatable, server-enforced cap), catalog search via
  `clickraft product list --json --search`, and when-to-ask guidance.
- `## Reference image context` section -- documents `--reference-image`
  semantics including local-path auto-upload, max 8, and distinction from
  `--brand-model` and `--product`.
- `## Combined: brand model with product` section -- workflow for brand model
  wearing/holding a product, pose selection guidance, prompt engineering hints.

### Fixed
- Removed ghost flag `--reference-image-url` from the optional flags table.
  The CLI only has `--reference-image`; the `-url` variant never existed.

### Changed
- Minimum CLI version bumped from `0.1.2` to `0.6.0` in Prerequisites and
  Compatibility sections.
- `argument-hint` updated to reflect the verified flag surface (`--brand-model`,
  `--product`, `--reference-image`).
- All manifests and VERSION bumped to `0.4.0`.
- `compatibility.json` `min_cli_version` set to `0.6.0`.

## [0.3.1] — 2026-05-24

### Fixed
- `nano-banana-pro` was being picked proactively for broad intents like
  "hero image" or "product photo", causing 3-5× cost overspend. Now Pro is
  reactive escalation only — used after a failed `nano-banana-2` attempt
  or on explicit user request. Matches higgsfield's `model-catalog.md:19`
  pattern: "Pick when 2 isn't getting there."
- Removed explicit "Resolution defaults to 2k" rule from `## Intent to
  aspect ratio`. The CLI handles 2k defaulting silently; the rule was
  noise. If the user explicitly asks for 4k, the agent passes it through.

## [0.3.0] — 2026-05-24

### Added
- `## Model selection` section in `generate-image/SKILL.md` — static catalog
  of three models with intent-based selection: `nano-banana-2` (default),
  `nano-banana-pro` (hard briefs), `gpt-image-2` (typography / text-in-image).
- `## Intent to aspect ratio` section — resolves aspect ratio from intent
  keywords (story=9:16, hero=16:9, square=1:1, etc.) without asking the user.
- Language detection rule in UX Rules — respond in user's language, prompts
  to CLI stay English.

### Notes
- Cost-handling integration with `clickraft generate cost` deferred to v0.3.1
  pending the endpoint and CLI subcommand.
- Other slugs in `ai_models` (`nano-banana`, `gpt-image-1.5`, `gpt-image-1.5-hd`)
  intentionally not surfaced in the skill. The agent uses only the three
  curated defaults; users can name any slug explicitly to override.

## [0.2.0] — 2026-05-23

### Added

- `INSTALL.md` with the four install paths (npx, Claude Code marketplace, Cursor, Codex) plus verify, update, and uninstall commands.
- `CONTRIBUTING.md` with commit hygiene, branch convention, PR checklist mirroring the CI gates, and a SKILL.md skeleton for new-skill submissions.
- `.github/workflows/validate-skills.yml` — CI gate enforcing frontmatter validity, version sync across all manifests, marketplace listing completeness via autodiscovery, reference-link integrity, and self-containment (no `../` references).
- Pull-request template (`.github/pull_request_template.md`) and three issue templates (`bug_report`, `feature_request`, `new_skill_request`) with `blank_issues_enabled: false`.
- `assets/` directory at repo root with `logo.png` (512×512), `logo.svg`, `logo-square.svg`, `icon.svg`, and a per-asset README. Mirrored under `plugins/clickraft/assets/` so the plugin is self-contained on standalone install.
- Codex manifest interface wiring: `composerIcon`, `logo`, `brandColor` (`#d6ff62` — Clickraft lime), and four `defaultPrompt` examples.
- Cursor manifest `$schema` reference and `publisher` field.
- README shields.io badges (license, version, skill count) and a Quick Reference table that forward-links planned skills.
- `docs/ENVELOPE.md` carrying the JSON envelope shape, exit codes, error codes, and telemetry notes.

### Changed

- `plugins/clickraft/skills/generate-image/SKILL.md` frontmatter rewritten to the spec-conformant shape: `version: 0.2.0`, `argument-hint`, `allowed-tools: Bash(clickraft:*)`, and a block-scalar `description` with embedded `Use when:` / `NOT for:` / `Chain with:` prose. Body now leads with `## Quick start`, `## UX rules`, `## When to ask`, and includes a new `## Cost handling` section (with a TODO note flagging the pending `clickraft generate cost` CLI subcommand).
- `INSTALL_FOR_AGENTS.md` restructured into a 5-step agent runbook. Envelope/error reference content moved to `docs/ENVELOPE.md`.
- `README.md` install section trimmed to a one-paragraph pointer at `INSTALL.md`. Skills table widened to 3 columns.
- `.claude-plugin/marketplace.json` and `.cursor-plugin/marketplace.json` plugin entries now carry an explicit `version` field. `.agents/plugins/marketplace.json` plugin entry pins `source.ref` to `v0.2.0`.
- `compatibility.json` `skills_version` bumped to `0.2.0`.

## [0.1.0] — 2026-05-22

### Added

- Initial release.
- Plugin manifests for Claude Code, Cursor, and Codex (plugin + marketplace).
- Starter skill: `plugins/clickraft/skills/generate-image/SKILL.md`.
- `compatibility.json` declaring `min_cli_version: 0.1.0` against `@clickraft/cli`.
- `INSTALL_FOR_AGENTS.md` with envelope shape, exit-code table, and common error reference.
