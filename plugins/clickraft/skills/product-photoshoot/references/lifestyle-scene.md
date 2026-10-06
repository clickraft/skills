# Mode: lifestyle-scene

The product inside a believable real place, with atmosphere and signs of people — more
than "product on a table".

## Scene presets

| Preset | Setting | Typical products |
|---|---|---|
| `morning-kitchen` | Sunlit kitchen at breakfast | Drinks, food, cookware, supplements |
| `bathroom-vanity` | Marble or wood vanity, soft window | Skincare, beauty, fragrance, candles |
| `bedroom-nightstand` | Nightstand, lamp glow, book, linen | Sleep aids, candles, journals, devices |
| `desk-workspace` | Desk in daylight, laptop, notebook | Tech, stationery, productivity |
| `cafe-table` | Cafe table, coffee-shop blur behind | Drinks, snacks, books, accessories |
| `outdoor-natural` | Forest, beach or mountain at golden hour | Outdoor gear, drinks, sunscreen, fashion |
| `living-room-cozy` | Sofa, throw, side table, warm lamp | Candles, throws, books, drinks |
| `gym-active` | Gym floor, weights, bottle | Sportswear, supplements, recovery |
| `dinner-table-social` | Laid table, guests implied | Drinks, sauces, glassware |
| `pour-shot` | Frozen mid-air pour or splash | Drinks, oils, sauces |
| `flat-lay-curated` | Top-down with curated objects | Beauty, food, tools, accessories |
| `hand-held-closeup` | Hands holding, applying or using | Skincare, food, gadgets |
| `gift-unboxing` | Wrapped or half-opened gift | Premium gifts, beauty, jewelry |

## Style descriptor keys

| Preset | Keys |
|---|---|
| morning-kitchen, cafe-table, dinner-table-social | `warm-editorial-table`, `bright-modern-food`, `sunlit-airy-lifestyle` |
| bathroom-vanity, bedroom-nightstand | `handcrafted-moody-warm`, `sunlit-airy-lifestyle`, `editorial-interiors` |
| desk-workspace, living-room-cozy | `editorial-interiors`, `nordic-soft-daylight`, `sunlit-airy-lifestyle` |
| outdoor-natural | `natural-confident`, `atmospheric-documentary`, `youthful-free-outdoor` |
| gym-active | `sharp-modern-portrait`, `natural-confident`, `narrative-portrait` |
| pour-shot, flat-lay-curated | `surreal-levitation`, `graphic-color-block`, `playful-pop-still-life` |
| hand-held-closeup | `skin-sculpting-light`, `sunlit-airy-lifestyle`, `natural-confident` |
| gift-unboxing | `handcrafted-moody-warm`, `editorial-interiors`, `warm-editorial-table` |

## Prompt template

```
[SCENE]
{{the place and the time of day, one or two sentences}}.

[PRODUCT PLACEMENT]
{{exact product}} sits {{where}}, {{relation to nearby objects}}, clearly the most
prominent object. {{for a set: exact piece count and arrangement, e.g. "exactly four
identical cups beside it"}}.

[HUMAN ELEMENT]
{{hands / a person partly in frame / a group implied / no people, only traces of use}}.

[ENVIRONMENT DETAILS]
{{3–5 grounding objects}}, {{their textures}}, {{one story cue}}.

[LIGHTING]
{{direction, quality, Kelvin}}, from {{window / practical lamp / sun}}, {{highlight and
shadow behaviour}}.

[LENS & CAMERA]
{{35mm / 50mm / 85mm}}, {{aperture with shallow focus for separation}}, focus on the product.

[ATMOSPHERE]
{{serene / energetic / intimate / indulgent / fresh / nostalgic / refined}}, {{air: haze,
steam, dust in light}}.

[COLOR PALETTE]
{{2–3 tones}}, {{contrast}}.

[STYLE REFERENCE]
{{merged descriptors from the keys above}}. Editorial commercial photography.

[QUALITY MARKERS]
Real depth, hyper-real textures, natural hands and skin where people appear.

[AVOID]
{{universal + people-in-frame if any + stock feel + labels if visible}}

Render at 2K resolution.
```

## Aspect ratio

| Destination | Ratio |
|---|---|
| Instagram feed (default) | `4:5` |
| Story / TikTok | `9:16` |
| Pinterest | `2:3` |
| Web hero | `16:9` |
| Print editorial | `3:4` or `4:5` |

## Composition rules

- The product is the anchor even when small — draw the eye with light, color or focus.
- Surrounding objects tell one story; no random clutter.
- Empty space feels lived-in, never blank.
- Keep natural asymmetry.
- With hands, state the finger positions and real skin texture.

## Quality gates

- [ ] Product is the visual anchor
- [ ] Light comes from a believable source
- [ ] Hands and people look natural, anatomy correct
- [ ] Props support one coherent story
- [ ] Palette matches product or brand
- [ ] No uncanny artifacts or warping
- [ ] Atmosphere feels intended
- [ ] Prompt ends with the 2K line

## Invocation

Follow SKILL.md. Each scene gets its own prompt and index; all share the same product handle.
