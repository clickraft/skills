# Mode: pinterest-pin

Vertical stills built for a moodboard feed: warm, tactile, layered, worth saving.

## What makes a pin work

- The tall 2:3 frame dominates the feed.
- The top third has to catch the eye — that is what survives the mobile crop.
- Warm, organic, handmade feeling beats glossy studio polish.
- People save what looks aspirational and useful.
- Palettes run muted and earthy — dusty pastels, not saturated feed colors.

## Presets

| Preset | Best for | Look |
|---|---|---|
| `lifestyle-aspirational` | Home, travel, fashion, wellness | Soft daylight, curated room, handmade warmth |
| `product-feature-vertical` | Affiliate or DTC spotlight | Product on a textured surface with warm context |
| `recipe-cover` | Food | Overhead or 45° dish, ingredients around, warm light |
| `editorial-flat-lay` | Style or gift guides | Several objects laid flat with even spacing |
| `before-after-stacked` | DIY, makeovers | Two stacked panels with a clear divide |
| `mood-board-grid` | Inspiration | One image that reads like a 3–4 photo collage |
| `quote-on-photo` | Inspirational content | Atmospheric photo built around mood (text via the three-case rule) |
| `tutorial-step-pin` | How-tos | One frame that implies the steps |

## Style descriptor keys

| Content | Keys |
|---|---|
| Lifestyle / wellness | `handcrafted-moody-warm`, `editorial-interiors`, `nordic-soft-daylight` |
| Food / recipe | `warm-editorial-table`, `bright-modern-food`, `sunlit-airy-lifestyle` |
| Fashion / outfit | `natural-confident`, `street-candid`, `atmospheric-documentary` |
| Home / interior | `editorial-interiors`, `nordic-soft-daylight`, `handcrafted-moody-warm` |
| Mood / dreamy | `whimsical-fantasy`, `pastel-nostalgic`, `atmospheric-documentary` |
| Flat-lay / curated | `playful-pop-still-life`, `graphic-color-block`, `color-sorted-flatlay` |

## Palettes

- Earthy neutral — cream, oat, soft sage, warm terracotta
- Coastal — dusty blue, sand, white, weathered wood
- Cottage — sage, rose, cream, dried flax
- Quiet luxury — warm grey, camel, muted navy, parchment
- Nordic — cool white, pale grey, raw wood, black accent
- Autumn — ochre, rust, deep green, butter
- Dark scholarly — deep brown, oxblood, parchment, ivy
- Fresh minimal — vanilla, blush, taupe, soft gold

## Prompt template

```
[FORMAT]
Tall vertical 2:3 pin composition, moodboard style.

[SUBJECT]
{{the product / scene / flat-lay arrangement}}.

[COMPOSITION]
{{vertical framing}}, focal point on {{a third}}, a clear read from top to bottom with
the strongest element high in the frame, handmade rather than stock.

[AESTHETIC]
Warm, tactile and lived-in. {{cottage / fresh minimal / Nordic / dark scholarly /
coastal / quiet luxury}}.

[LIGHTING]
{{soft window light / golden hour / soft overcast / candle warmth}}, {{3200–4500K}},
gentle highlight roll-off.

[SURFACE & TEXTURE]
{{linen / raw wood / marble / ceramic / woven fiber}}, tactile, never sterile.

[COLOR PALETTE]
Muted: {{2–3 tones from the palettes above, aligned with the brand}}.

[STYLE REFERENCE]
{{merged descriptors from the keys above}}. Editorial moodboard photography.

[QUALITY MARKERS]
Save-worthy, magazine quality, rich texture, photorealistic.

[AVOID]
{{universal + stock feel + labels if visible}}
no oversaturation, no neon, no square-feed framing, no horizontal-leaning layout,
no dated stock look, no sterile studio feel.

Render at 2K resolution.
```

## Typography

Exact words given → Case 1 of `typography.md`. User will add text → Case 2. Otherwise
fill the frame with texture and detail.

## Aspect ratio

- `2:3` — standard pin, the default for every request.
- Long pin (about 1:2) is not supported by the model; use `9:16` and say so.
- `1:1` only on explicit request (square pins perform worse).

## Composition rules

- Anchor on a third, hierarchy clear from top to bottom.
- Strong entry point at the top.
- Several objects: spaced on purpose, not overlapping.
- Background texture carries warmth — linen, grain, paper, plaster.
- Handmade feel over studio polish.

## Quality gates

- [ ] Vertical 2:3 (or the stated mapped ratio)
- [ ] Muted, pin-appropriate palette
- [ ] Handmade, not stock
- [ ] Subject anchors a clear vertical hierarchy
- [ ] Brand colors present
- [ ] Not oversaturated or sterile
- [ ] Tactile surface visible
- [ ] Text, if any, follows the three-case rule
- [ ] Prompt ends with the 2K line

## Invocation

Follow SKILL.md. Every pin uses `2:3` unless the user asked otherwise.
