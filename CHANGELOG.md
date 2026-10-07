# Changelog

All notable changes to Clickraft Skills are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.1] — 2026-10-07

### Fixed
- **`production-recipe` writes directed Recipes.** The field guide told agents to leave out the
  recipe's `direction`, and both worked examples were legacy Recipes that replay one pose. It now
  explains direction (the concept, 1–4 pose families per on-model photo, energy, set pieces,
  smiles), step 3 asks for a directed Recipe unless the user wants exact poses copied, and both
  examples are directed Recipes that pass the server's validation. An optional smile is now an
  option that is off by default, not part of a description.
- **MCP flavour no longer points at a CLI-only skill.** `character-sheet`, `product-image-presets`
  and `product-photoshoot` named `production-recipe`, which the MCP does not serve; they now name
  the recipe_* tools. The CLI flavour keeps its pointer.

### Changed
- All manifests and VERSION bumped to `0.8.1`.

## [0.8.0] — 2026-10-06

### Added
- **One source, two flavours.** Every skill is now written once in `src/skills/` and rendered by
  `scripts/build-skills.mjs` (no dependencies) into the CLI flavour in `plugins/clickraft/skills/`
  (unchanged location and content) and a new MCP flavour in `mcp/skills/` + `mcp/bundle.json`.
  Text for one flavour only is wrapped in `<cli>…</cli>` or `<mcp>…</mcp>`, so modes, prompt
  templates and quality gates are shared and cannot drift.
- MCP flavour of `generate-image`, `product-photoshoot`, `product-image-presets`,
  `product-video-presets`, `thumbnail-generation`, `character-sheet`, `ad-multiplier` and
  `ugc-video`, written for chat agents that only have the Clickraft MCP tools (`generate_create`,
  `generate_batch`, `generate_wait`, `upload_widget`, previews and the generation widget). The
  Clickraft MCP server vendors `mcp/bundle.json` from this tag and serves it through
  `skill_list` / `skill_get` / `skill_file`.
- CI check 0: the generated flavours must match `src/skills`.

### Changed
- The CLI flavour of every skill is byte-identical to 0.7.1 apart from the version line.
- All manifests and VERSION bumped to `0.8.0`.

## [0.7.1] — 2026-10-06

Fixes from live runs of every image skill and one product video on staging.

### Changed
- `generate-image` — the default model is `nano-banana-2` again (more photoreal in a
  side-by-side test); `gpt-image-2.5-sunburst` is for precise edits and faithful
  references. A plain request defaults to 1:1 without asking. An estimate runs only for 4K,
  `nano-banana-pro` or quality above `high`. Fixed the `--resolution` and `--quality` flag notes.
- All skills — submit with `--no-wait` and then `generate wait`. `E_TIMEOUT` (exit 6) means the
  job is still running: wait again on the same job and never re-create it. Jobs can queue
  for minutes and run one after another.
- All skills — brand models default to the bare uuid. A pose works only if that model has an
  image of that angle; check it first with the free `generate estimate`. Added
  `face-closeup` and `hands` to the pose names.
- Reference order is documented as the server applies it: brand models, then
  `--reference-image`, then `--product`. Fixes the `@ImageN` numbering note in `ad-multiplier`.
- Duplicate catalog titles are told apart by image, not by title.

### Fixed
- `product-photoshoot` — `clean-studio` and similar presets now map to a new
  `clean-ecommerce` look. Light is described by its effect, so studio gear no longer
  appears in frame. Added set piece-count slots and gates, a structural-detail gate and a
  stray-object refinement row.
- `product-image-presets` — on-image facts fall back to visible-attribute noun phrases, with no
  function claims. Separate pieces are kept as in the photo. `hero-shot` no longer inherits a
  top-down reference angle.
- `thumbnail-generation` — native 4K size (5504×3072), a consistent block name, a placement
  sentence for baked text, tweaks that keep baked text and re-check it, a `<style cue>` slot,
  and a worst-case cost that includes re-renders.
- `character-sheet` — makeup wording is conditional, sides are named from the character's own
  point of view, brand colours are allowed while logos are kept out, and a broken error table
  is repaired.
- `product-video-presets` — the start frame is centred and fills 60–70% of the frame, with a
  check before the video. Loose lids rotate with the product as one set. Confirmed live: 6 s,
  a stage-1 image as `--start-frame`, and a silent clip.

## [0.7.0] — 2026-10-06

### Added
- `product-photoshoot` — finished product stills in ten modes (product shot, lifestyle
  scene, close-up with a person, Pinterest pin, hero banner, social carousel, ad creative
  pack, virtual model try-on, conceptual product, restyle). Silent defaults on "just do
  it", at most three bundled questions, a composed `[AVOID]` block, one product identity
  across a set, and a refinement budget of three generations per image. Locked to
  `nano-banana-pro` at 2K.
- `product-image-presets` — 45 named one-shot product looks run as locked recipes on
  `gpt-image-2.5-sunburst`; on-image facts come only from the user, the catalog or the pack.
- `product-video-presets` — 18 named product motions. A prepared start frame (backdrop
  sampled from the product) feeds `seedance-2-standard-i2v`; the price is quoted and the
  user says go before the video runs.
- `thumbnail-generation` — thumbnails and video covers: 16 concept frameworks, a character
  gate, identity lock, emotion × take variants, split frames, surgical edits, 3D logo.
- `character-sheet` — consistent multi-view character sheets in five styles.
- `ad-multiplier` — independently edited versions of one 4–15 s source video with
  `seedance-2.5-r2v --task editing`.
- `ugc-video` — one creator-style clip up to 15 s with native audio in six formats, built
  from a cleaned board image.

### Changed
- `generate-image` — default model is now `gpt-image-2.5-sunburst`; `nano-banana-2` for
  brand-model identity, `nano-banana-pro` for finished commercial images, `gpt-image-2` for
  exact text. Documents that shared brand models reject a pose suffix, and points to the new
  skills in its boundaries.
- All manifests and VERSION bumped to `0.7.0`; `compatibility.json` `skills_version` set to
  `0.7.0`. The new skills need CLI 0.21.0 and say so.

## [0.6.0] — 2026-10-06

### Added
- `production-recipe` — makes the Recipe's sample images with `clickraft recipe draft
  images` (CLI 0.19.0 or later), always on the user's word to a quoted price. Photo 1
  comes first, and the rest of the set follows once the user accepts it, made by
  Clickraft without a browser tab. The agent can also redo one photo (not photo 1) from
  the user's feedback. On an older CLI the skill hands over as before.

### Changed
- All manifests and VERSION bumped to `0.6.0`.
- `compatibility.json` `skills_version` set to `0.6.0`. `min_cli_version` is unchanged.
  The images steps need CLI 0.19.0, and the skill says how to tell when the CLI is older.

## [0.5.1] — 2026-10-05

### Added
- `production-recipe` skill — builds a production Recipe (a reusable catalog-shoot
  style) with the `clickraft recipe` commands: reads `recipe schema` for the JSON
  Schema, rules and the organization's facets, products and models; writes the Recipe;
  creates the draft; plans the photos (Utility Units, not credits); and ends with the
  draft's link, where the user approves the images and saves the Recipe. Covers
  bindings, editing at the current revision, conflicts, idempotency keys for safe
  retries, and the error codes. `references/recipe-format.md` holds the field guide and
  two complete request files, both checked against the server's own validation.

### Fixed
- `generate-image` skill — the discovery steps named fields the CLI does not return.
  `clickraft brand-model list --json` returns the list itself in `data` (read
  `data[].id`, `data[].name`), and `clickraft product list --json` returns
  `data.products[]` with a `title` (not `data.items[].name`).

### Changed
- All manifests and VERSION bumped to `0.5.1`.
- `compatibility.json` `skills_version` set to `0.5.1`. `min_cli_version` is unchanged:
  `generate-image` and `clickraft-workflow-authoring` still run on `0.15.0`. The new
  skill needs the CLI release that ships `recipe` and says how to tell when the CLI is
  older.

## [0.5.0] — 2026-09-25

### Fixed
- `generate-image` skill — `--model-slug` is the AI model (e.g. `nano-banana-2`), not a
  brand model. The Prerequisites step sent agents to `clickraft brand-model list` for the
  slug; it now uses `clickraft models list --json` (`data.models[].slug`). Same fix for
  the `E_MODEL_NOT_FOUND` recovery row and the skill description.

### Added
- `generate-image` skill — `--output ./clickraft-output/` on create / wait / get saves
  the finished image locally (`data.savedPath`), and the agent opens it with Read before
  replying, so it can judge the result instead of only relaying a URL. Includes the
  fallback for a CLI that predates `--output`.
- `generate-image` skill — cost questions and high-cost requests now use
  `clickraft generate estimate` (same flags as create, charges nothing) instead
  of the "coming soon" placeholder.

### Changed
- All manifests and VERSION bumped to `0.5.0`.
- `compatibility.json` `skills_version` set to `0.5.0`; `min_cli_version` raised from
  `0.6.0` to `0.15.0`, the `@clickraft/cli` release that ships `generate --output` and
  `generate estimate`. Minor bump because an older CLI no longer meets the minimum.

## [0.4.3] — 2026-06-02

### Fixed
- `clickraft-workflow-authoring` skill — corrected the documented failure mode for
  pasting a read-shape edge (`source`/`sourceHandle`/`target`/`targetHandle`, no
  `from`/`to`) into an `add_edge` op. It is **hard-rejected** by the agents API with
  HTTP 400 `INPUT_INVALID_FORMAT` (CLI envelope `E_INPUT_INVALID_FORMAT`, exit 2)
  because `edge.from`/`edge.to` are required objects — not silently accepted with empty
  endpoints, as previously framed. Updated `SKILL.md` and `references/op-schema.md`;
  the `from/to` write-shape guidance is unchanged.

### Changed
- All manifests and VERSION bumped to `0.4.3`.
- `compatibility.json` `skills_version` set to `0.4.3`.

## [0.4.2] — 2026-05-30

### Added
- `clickraft-workflow-authoring` skill — node containment via `parentId` / `expandParent`
  on `add_node`. Documents the absolute-position contract, server-side relative conversion,
  no-nesting rule, and `INVALID_PARENT_REF` / `NESTED_GROUP_FORBIDDEN` diagnostics.
  Updates `references/op-schema.md` and `references/node-catalog.md`.

### Changed
- All manifests and VERSION bumped to `0.4.2`.
- `compatibility.json` `skills_version` set to `0.4.2`.

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
