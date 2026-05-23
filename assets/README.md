# Assets

Brand artwork used by plugin manifests and the README. Not loaded by any skill at runtime.

## Files

| File | Used by | Notes |
|---|---|---|
| `logo.png` | `plugins/clickraft/.codex-plugin/plugin.json` `interface.logo` | Square 512×512 marketplace card mark — lime icon + white wordmark on `#1d1d1d`. |
| `logo.svg` | (source) | Original wide wordmark from `clickraft-design-system/assets/logo.svg`. Use as the canonical scalable wordmark. |
| `logo-square.svg` | (source) | Square 512×512 SVG used to render `logo.png`. Re-render the PNG from this file when brand tweaks land. |
| `icon.svg` | `plugins/clickraft/.codex-plugin/plugin.json` `interface.composerIcon` | The triangle "A" from the wordmark. Used as the small in-composer icon. |

A mirror of these files lives at `plugins/clickraft/assets/` so the plugin remains self-contained when installed standalone via the marketplace. Keep both copies in sync.

## Conventions

- **PNGs** are square (recommended 512×512). RGBA. The brand `#1d1d1d` background is baked in so the mark stays visible on both light and dark marketplace UIs.
- **SVGs** keep `#ffffff` text + `#d6ff62` (lime) accent. The square SVG bakes in the dark background; the wide SVG is transparent and expects to be placed on a dark surface.
- **Demo GIFs** (none today) — keep under 2 MB, 8–15 seconds, looped.

## Re-rendering the PNG

If you tweak the SVG and need to refresh `logo.png`:

```bash
# macOS (no extra deps)
qlmanage -t -s 512 -o /tmp/out assets/logo-square.svg
cp /tmp/out/logo-square.svg.png assets/logo.png
cp /tmp/out/logo-square.svg.png plugins/clickraft/assets/logo.png

# Linux / cross-platform
rsvg-convert -w 512 -h 512 assets/logo-square.svg -o assets/logo.png
cp assets/logo.png plugins/clickraft/assets/logo.png
```

## Brand source

Canonical brand assets live at `spaces/clickraft-design-system/assets/` in the main Spaces monorepo (`logo.svg`, `logo-icon.svg`, `apple-touch-icon.png`). Brand identity reference: `docs-internal/brand/brand-identity.md` (lime `#d6ff62`, dark `#1d1d1d`, white `#ffffff`).

## Known gaps

- No `banner.png` for the GitHub social-preview yet.
- No demo GIFs in the README.
