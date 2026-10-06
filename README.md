# Clickraft Skills

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/version-0.2.0-green.svg)](./VERSION)
[![Skills](https://img.shields.io/badge/skills-10-blueviolet.svg)](#skills)

Skills for AI coding agents — Claude Code, Cursor, Codex — teaching them how to generate images and manage visual assets with the [Clickraft CLI](https://github.com/clickraft/cli) without having to re-explain the protocol every time.

## Install

See [INSTALL.md](./INSTALL.md) for the four install paths (npx, Claude Code marketplace, Cursor, Codex), plus verify, update, and uninstall commands.

## Skills

| Skill | Invoke | Description |
|---|---|---|
| [`generate-image`](./plugins/clickraft/skills/generate-image/SKILL.md) | "Generate an image of …" | Call `clickraft generate create` with a model slug and prompt. Handles sync vs async, references, and error envelopes. |
| [`production-recipe`](./plugins/clickraft/skills/production-recipe/SKILL.md) | "Build me a Recipe in this style …" | Write a reusable catalog-shoot style with `clickraft recipe`, create a draft, have Clickraft plan the photos, and hand over the link where the images are approved and the Recipe saved. |

| [`product-photoshoot`](./plugins/clickraft/skills/product-photoshoot/SKILL.md) | "Shoot my product for Shopify …" | Finished product stills in ten modes (packshot, lifestyle, banner, carousel, ad pack, try-on, conceptual, restyle…), one product identity across the set, focused refinements. |
| [`product-image-presets`](./plugins/clickraft/skills/product-image-presets/SKILL.md) | "Make a hero shot of my bottle" | 45 named one-shot product looks (hero shot, flatlay, water splash, specs card…) run as locked recipes. |
| [`product-video-presets`](./plugins/clickraft/skills/product-video-presets/SKILL.md) | "Make a product spin video" | 18 named product motions (spin, push-in, light sweep…): a prepared start frame, then image-to-video, priced before it runs. |
| [`thumbnail-generation`](./plugins/clickraft/skills/thumbnail-generation/SKILL.md) | "Make a YouTube thumbnail …" | Click-worthy thumbnails and video covers: concept frameworks, identity lock, emotion variants, surgical tweaks. |
| [`character-sheet`](./plugins/clickraft/skills/character-sheet/SKILL.md) | "Make a character sheet of …" | Consistent multi-view character references in five styles, as a prompt or rendered. |
| [`ad-multiplier`](./plugins/clickraft/skills/ad-multiplier/SKILL.md) | "Make 5 versions of this ad with …" | Independently edited versions of one 4–15 s source video that keep its motion, cuts and timing. |
| [`ugc-video`](./plugins/clickraft/skills/ugc-video/SKILL.md) | "Make a UGC review video of …" | One creator-style clip up to 15 s with native audio: review, product voiceover, unboxing, try-on, tutorial, website tour. |

More skills land as we learn what agents need most.

## Quick reference

| What you want | Skill | Note |
|---|---|---|
| Generate a single image | `generate-image` | default model |
| Generate with brand context | `generate-image` | pass `--model-slug <slug>` from `clickraft brand-model list` |
| Reference an existing image | `generate-image` | pass `--reference-image-url <url>` |
| Reusable catalog shoot style (Recipe) | `production-recipe` | ends with a Clickraft link; approving and saving happen there |
| Multi-image product shoot | `product-photoshoot` | ten modes, locked to the top product model |
| A named product look | `product-image-presets` | `/hero-shot`, `/flatlay`, … |
| Product motion video | `product-video-presets` | quotes the price and waits for your go |
| UGC or ad variations | `ugc-video`, `ad-multiplier` | one clip up to 15 s |

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
