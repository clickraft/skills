# Mode: ad-creative-pack

A coordinated set of static ads from one brief — different hooks and placements, one
brand identity — built for paid-channel testing.

## What paid creative needs

- Stop the scroll in half a second.
- Several variants, because testing needs variation.
- The right ratio per placement.
- A bit more saturation and contrast than organic posts, without looking cheap.

## Hook angles

| Angle | How to show it |
|---|---|
| `problem-solution` | The pain point or "before" state, product as the answer |
| `transformation` | The desirable end state |
| `social-proof` | Trust cues, many users implied |
| `curiosity-gap` | A visual that begs a question |
| `lifestyle-aspiration` | The life the product enables |
| `feature-zoom` | Close-up on one differentiating feature |
| `comparison` | Side by side or before/after |
| `urgency-scarcity` | A limited-time or limited-stock cue |
| `founder-story` | Personal, maker-led visual |
| `bold-statement` | One strong dramatic image |
| `unboxing-reveal` | Anticipation and reveal |
| `behind-scenes` | Making-of, raw authenticity |

## Placements

| Placement | Ratio |
|---|---|
| Instagram feed | `4:5` (most important) |
| Instagram story / reel cover | `9:16` |
| Facebook feed | `1:1` |
| TikTok feed | `9:16` |
| Pinterest promoted pin | `2:3` |
| Display square | `1:1` |
| Display landscape | `16:9` |
| LinkedIn sponsored | `1:1` |

## Style descriptor keys — one set for the pack

| Category | Keys |
|---|---|
| DTC / lifestyle | `warm-editorial-table`, `sunlit-airy-lifestyle`, `playful-pop-still-life` |
| Premium product | `graphic-color-block`, `surreal-levitation`, `skin-sculpting-light` |
| Beauty | `skin-sculpting-light`, `glossy-beauty`, `modern-minimal-beauty` |
| Food / drink | `warm-editorial-table`, `bright-modern-food`, `surreal-levitation` |
| Tech / SaaS | `tech-modern-editorial`, `surreal-levitation`, `sharp-modern-portrait` |
| Fashion | `glossy-high-fashion`, `dramatic-editorial`, `whimsical-fantasy` |
| Bold direct response | `soft-surreal-color`, `surreal-conceptual`, `playful-pop-still-life` |

## Default pack (when the user gives no spec)

| Index | Hook | Placement |
|---|---|---|
| 0 | `lifestyle-aspiration` | Instagram feed `4:5` |
| 1 | `feature-zoom` | Instagram feed `4:5` |
| 2 | `transformation` | Instagram story `9:16` |
| 3 | `social-proof` | Facebook feed `1:1` |
| 4 | `curiosity-gap` | Instagram story `9:16` |

Five images is above the three-image threshold: estimate and state the total with the
outline.

## Step 1 — outline first

One line per variant — `hook — what is shown — ratio` — shown to the user before any
generation (skip the confirmation in full-auto). Adjust on their reply, then generate.

## Step 2 — lock the visual system

```
[VISUAL SYSTEM — shared by every variant]
Palette: {{2–3 brand tones plus ONE high-saturation accent}}
Surface / backdrop: {{one texture or color}}
Lighting baseline: {{key direction and quality; may shift slightly per hook}}
Composition: rule of thirds, strong focal hierarchy
Style: {{merged descriptors from the chosen key set}}
Brand colors: {{known brand colors}}
```

## Step 3 — per-variant prompt

```
[VISUAL SYSTEM]
{{the locked block, word for word}}

[VARIANT {{N}} — {{hook}} — {{ratio}}]

[HOOK VISUAL]
{{the specific image that delivers this hook}}.

[COMPOSITION]
{{framing for this variant}}, anchor on {{a third}}, the eye lands on the product first.

[LIGHTING]
{{tuned to the hook — dramatic for problem-solution, warm for aspiration, crisp and
clinical for feature-zoom}}.

[CONTRAST & SATURATION]
Punchier than organic content: vivid color, deep shadows, bright highlights, a clean
read in half a second — but no neon cast and no halos.

[STYLE REFERENCE]
{{same descriptors as the visual system}}.

[QUALITY MARKERS]
Scroll-stopping, magazine quality, hyper-detailed, ready for paid placement.

[AVOID]
{{universal + stock feel + labels if visible + people if any}}
no palette drift between variants, no flat light, no synthetic stock look.

Render at 2K resolution.
```

## Typography

Exact headline or copy → Case 1 of `typography.md`, part of the composition. The user
will add headline and CTA in their ad manager → Case 2. Otherwise compose freely.

## Invocation

Follow SKILL.md. Each outlined variant is one index with its own ratio. A catalog
product or supplied image is attached to every first pass; with a text-only product,
index 0 goes first and its result anchors the rest.

## Quality gates

- [ ] Every variant shares the visual system
- [ ] Each variant clearly delivers its hook
- [ ] Saturation and contrast suit paid placement, not cheap
- [ ] Brand colors consistent
- [ ] Ratios match the placements
- [ ] No artifacts or warped text
- [ ] The pack looks coordinated
- [ ] Text, if any, follows the three-case rule
- [ ] Every prompt ends with the 2K line
