# Clickraft Skills

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/version-0.2.0-green.svg)](./VERSION)
[![Skills](https://img.shields.io/badge/skills-1-blueviolet.svg)](#skills)

Skills for AI coding agents — Claude Code, Cursor, Codex — teaching them how to generate images and manage visual assets with the [Clickraft CLI](https://github.com/clickraft/cli) without having to re-explain the protocol every time.

## Install

See [INSTALL.md](./INSTALL.md) for the four install paths (npx, Claude Code marketplace, Cursor, Codex), plus verify, update, and uninstall commands.

## Skills

| Skill | Invoke | Description |
|---|---|---|
| [`generate-image`](./plugins/clickraft/skills/generate-image/SKILL.md) | "Generate an image of …" | Call `clickraft generate create` with a model slug and prompt. Handles sync vs async, references, and error envelopes. |

More skills land as we learn what agents need most.

## Quick reference

| What you want | Skill | Note |
|---|---|---|
| Generate a single image | `generate-image` | default model |
| Generate with brand context | `generate-image` | pass `--model-slug <slug>` from `clickraft brand-model list` |
| Reference an existing image | `generate-image` | pass `--reference-image-url <url>` |
| Multi-image product shoot | (coming v0.2.x — `clickraft-product-shoot`) | planned |
| Generate video | (coming v0.3.x) | planned |

## Requirements

- [Clickraft CLI](https://github.com/clickraft/cli) `>= 0.1.2`
- `clickraft login` completed

See [INSTALL.md](./INSTALL.md) for the CLI install command and [docs/ENVELOPE.md](./docs/ENVELOPE.md) for the JSON envelope and error-code reference.

## Updates

The Clickraft CLI checks once per 24 hours for new tags on this repo. When updates are available it prints a notice to stderr. Run `clickraft skills update` to install.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the PR checklist and the SKILL.md skeleton.

## License

MIT — see [LICENSE](./LICENSE).
