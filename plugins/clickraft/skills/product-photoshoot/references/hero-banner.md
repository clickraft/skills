# Mode: hero-banner

Wide images for site headers, landing pages, email campaigns and section dividers:
cinematic, one strong focal point, brand mood read in a glance.

## What a banner must do

- One clear focal anchor and a clear hierarchy.
- Survive cropping across screen sizes.
- Deliver the brand mood in under a second.
- Feel cinematic and editorial, never stock.

## Presets

| Preset | Best for | Look |
|---|---|---|
| `cinematic-product-hero` | Launches, DTC home pages | Wide, atmospheric, product as anchor |
| `lifestyle-environmental` | Brand heroes, lookbook covers | Wide lifestyle scene with a strong story cue |
| `editorial-portrait` | Founder or personal brand, fashion | A person in a cinematic editorial setting |
| `abstract-brand-mood` | Color-led banners, no product | Texture, gradient and light only |
| `studio-product-wide` | Category or sale headers | Product centered or grouped on a premium sweep |
| `seasonal-campaign` | Holiday and seasonal launches | Themed environment with a strong narrative cue |
| `panoramic-landscape` | Travel, outdoor, lifestyle | Wide landscape with one focal element, deep atmosphere |
| `split-composition` | Comparisons, dual messages | Left and right halves clearly different |

## Style descriptor keys

| Preset | Keys |
|---|---|
| cinematic-product-hero | `monolithic-color-sculpture`, `high-concept-premium`, `sculpted-dramatic-light` |
| lifestyle-environmental | `natural-confident`, `atmospheric-documentary`, `narrative-portrait` |
| editorial-portrait | `monochrome-editorial-portrait`, `narrative-portrait`, `dramatic-editorial` |
| abstract-brand-mood | `abstract-editorial`, `surreal-levitation`, `graphic-color-block` |
| studio-product-wide | `clean-ecommerce`, `graphic-color-block`, `classical-still-life` |
| seasonal-campaign | `whimsical-fantasy`, `glossy-high-fashion`, `dramatic-editorial` |
| panoramic-landscape | `epic-monochrome`, `environmental-landscape`, `natural-confident` |
| split-composition | `abstract-editorial`, `cinematic-staged-narrative`, `whimsical-fantasy` |

## Lighting by brand tier

- Premium / luxury — hard rim against deep shadow, one dominant source.
- Approachable DTC — soft window light, warm ambience, low contrast.
- Bold / energetic — strong direction, saturated color, hard shadows.
- Calm / wellness — overcast diffusion, even tones, light haze.
- Editorial / fashion — golden hour, anamorphic flare, deep space.

## Prompt template

```
[FORMAT]
Wide {{ratio}} cinematic banner.

[FOCAL SUBJECT]
{{product / scene / person}} on the {{left third / right third / off-center}}, taking up
about {{N}}% of the width.

[COMPOSITION]
Strong horizontal flow and leading lines toward the subject. Distinct foreground,
midground and background for depth.

[ATMOSPHERE]
{{refined / energetic / calm / indulgent / fresh / dramatic}}, {{haze, depth cues}}.

[LIGHTING]
{{per brand tier above}}, {{Kelvin}}, {{shadow behaviour}}.

[LENS & CAMERA]
{{24mm / 35mm / 50mm}}, {{aperture}}, {{deep focus for place / shallow for isolation}},
anamorphic character.

[COLOR PALETTE]
{{2–3 brand tones}}, {{warm or cool lead}}, wide tonal range.

[STYLE REFERENCE]
{{merged descriptors from the keys above}}. Cinematic editorial photography.

[QUALITY MARKERS]
Magazine-cover finish, very sharp, deep cinematic space, photorealistic.

[AVOID]
{{universal + stock feel + labels if visible}}
no centered symmetry when an off-center layout was asked for, no flat light.

Render at 2K resolution.
```

## Typography

Exact words → Case 1 of `typography.md`. User adds text later → Case 2. Otherwise compose
freely for richness.

## Aspect ratio

| Use | Ratio |
|---|---|
| Full-width web hero (default) | `16:9` |
| Ultra-wide cinematic hero | `21:9` |
| Email header (3:1 or 2:1 asked) | `21:9` — closest supported; say so |
| LinkedIn or X header (4:1, 3:1) | `21:9` — closest supported; say so; the user crops |
| YouTube channel art | `16:9` |
| Section divider | `21:9` |

The model's widest ratio is 21:9. Never promise 3:1 or 4:1 output.

## Composition rules

- Anchor on one of the two vertical thirds, not dead center.
- Light and lines pull the eye across.
- A soft foreground element adds depth (out-of-focus leaf, fabric edge, surface grain).
- Keep the essential subject inside the central safe area for mobile crops.
- Wide tonal range; never flat.

## Quality gates

- [ ] Wide ratio suits the use
- [ ] One strong focal anchor with clear hierarchy
- [ ] Light has direction and signals the brand tier
- [ ] Palette matches the brand
- [ ] Composition leads the eye
- [ ] Subject survives a mobile crop
- [ ] Cinematic, not stock
- [ ] Text, if any, follows the three-case rule
- [ ] Prompt ends with the 2K line

## Invocation

Follow SKILL.md. `16:9` unless the brief clearly wants ultra-wide, then `21:9`.
