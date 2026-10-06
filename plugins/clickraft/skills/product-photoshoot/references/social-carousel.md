# Mode: social-carousel

3–10 slides for Instagram, LinkedIn or Facebook that read as ONE connected story, not a
handful of unrelated images.

## What makes a carousel

- One visual system on every slide: palette, surface, light, camera, composition rule.
- A narrative arc: hook → body → payoff or call to action.
- Continuity, so each swipe feels intentional.

## Presets

| Preset | Best for | Slide arc |
|---|---|---|
| `product-launch` | New product reveal | Hook → reveal → benefit 1 → benefit 2 → proof → CTA |
| `educational-tips` | "5 mistakes", "7 tips" | Hook → tip 1 … tip N → summary / CTA |
| `before-during-after` | Transformations, results | Before → step 1 → step 2 → step 3 → after → CTA |
| `list-roundup` | Gift guides, curated picks | Cover → item 1 … item N → CTA |
| `storytelling-narrative` | Brand or founder story | Hook → setup → insight → resolution → CTA |
| `comparison` | This vs that | Hook → option A → option B → side by side → pick |
| `feature-deep-dive` | One product, many features | Hero → feature 1 → feature 2 → in use → CTA |
| `process-walkthrough` | How it is made / works | Hook → step 1 → step 2 → step 3 → step 4 → result |

## Style descriptor keys — ONE set for the whole carousel

| Category | Keys |
|---|---|
| Lifestyle / DTC | `warm-editorial-table`, `sunlit-airy-lifestyle`, `handcrafted-moody-warm` |
| Product / clean | `graphic-color-block`, `surreal-levitation`, `playful-pop-still-life` |
| Editorial / fashion | `natural-confident`, `whimsical-fantasy`, `glossy-high-fashion` |
| Beauty | `skin-sculpting-light`, `glossy-beauty`, `sunlit-airy-lifestyle` |
| Food / drink | `warm-editorial-table`, `bright-modern-food`, `surreal-levitation` |
| Tech / modern | `tech-modern-editorial`, `surreal-levitation`, `sharp-modern-portrait` |

## Step 1 — outline first

Write a one-line outline per slide and show it to the user before generating (skip the
confirmation in full-auto). Example, 5-slide launch:

```
1  Hook — product hero with a hint of intrigue
2  Reveal — clean full view of the product
3  Benefit 1 — detail close-up
4  Benefit 2 — in use, hands holding it
5  CTA — strong final hero composition
```

Six or more slides → estimate and state the credit total with the outline (SKILL.md, Cost).

## Step 2 — lock the visual system

```
[VISUAL SYSTEM — identical on every slide]
Palette: {{2–3 tones}}
Surface / backdrop: {{one texture or color}}
Lighting: {{one setup — direction, quality, Kelvin}}
Camera: {{one height and angle — eye level / 45° / top-down}}
Composition rule: {{rule of thirds / centered / off-center — one}}
Style: {{merged descriptors from the chosen key set}}
```

## Step 3 — per-slide prompt

```
[VISUAL SYSTEM]
{{the locked block, copied word for word}}

[SLIDE {{N}} OF {{TOTAL}} — {{outline line}}]

[CONTENT]
{{what this slide shows and emphasizes}}.

[COMPOSITION VARIATION]
{{how the framing changes while staying inside the locked rule}}.

[QUALITY MARKERS]
Magazine quality, hyper-detailed, photorealistic; one slide of a connected series that
matches the others exactly in palette, light and surface.

[AVOID]
{{universal + stock feel + labels if visible}}
no palette shift between slides, no change of light direction, no change of surface,
no break in continuity.

Render at 2K resolution.
```

## Typography

Exact words for a slide → Case 1 of `typography.md`. User adds text later → Case 2,
applied the same way on every slide. Otherwise compose freely.

## Aspect ratio

| Platform | Ratio |
|---|---|
| Instagram (default) | `4:5` |
| Instagram square | `1:1` |
| LinkedIn | `1:1` |
| Facebook | `1:1` or `4:5` |
| TikTok photo carousel | `9:16` |

All slides share one ratio.

## Invocation

Follow SKILL.md. Slide N is index N−1 and keeps that index through refinement so the
user can name a slide later. With a text-only product, slide 1 (index 0) goes first and
its result becomes the reference for all other slides.

## Refinement

Look at the slides as a set first: continuous palette, same light direction, same
surface, arc reads in order. If one slide breaks the system, refine only that slide,
quoting the visual system as its preservation line. Never regenerate the whole set.

## Quality gates

- [ ] One palette across all slides
- [ ] One light direction and quality
- [ ] One surface / backdrop
- [ ] Arc follows the preset
- [ ] No slide breaks the system
- [ ] One ratio for all
- [ ] Brand colors throughout
- [ ] Text, if any, follows the three-case rule
- [ ] Every prompt ends with the 2K line
