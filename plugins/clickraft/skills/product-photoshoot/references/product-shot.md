# Mode: product-shot

Studio packshots on seamless, neutral or controlled backdrops: catalog, e-commerce
listing, Shopify main image.

## Presets

| Preset | Best for | Look |
|---|---|---|
| `clean-studio` (default) | Any e-commerce or catalog | White-to-pale-grey seamless sweep, soft frontal key, faint contact shadow |
| `dramatic-studio` | Premium, fragrance, electronics | One hard source, strong rim, deep shadow, dark backdrop |
| `minimal-design` | Modern DTC | One pastel or solid color sweep, simple geometry, lots of air |
| `etsy-handmade` | Handmade, artisan, small batch | Warm daylight, linen, wood or stone, organic shadow |
| `luxury-editorial` | Jewelry, perfume, high fashion | Reflective surface, marble or velvet, jewel-tone backdrop |
| `vibrant-color` | Beauty, snacks, lifestyle DTC | Saturated solid backdrop, bold color blocking, flat modern layout |
| `floating-product` | Hero display | Product hovering mid-air, small motion accents, slightly surreal |
| `ingredient-flatlay` | Beauty, food, supplements | Top-down, raw ingredients arranged around the product |

## Style descriptor keys (from `style-descriptors.md`)

| Preset | Keys |
|---|---|
| clean-studio | `clean-ecommerce`, `graphic-color-block` |
| minimal-design | `graphic-color-block`, `clean-ecommerce` |
| dramatic-studio, luxury-editorial | `sculpted-dramatic-light`, `classical-still-life` |
| etsy-handmade | `warm-editorial-table`, `sunlit-airy-lifestyle` |
| vibrant-color | `playful-pop-still-life`, `graphic-color-block` |
| floating-product | `surreal-levitation`, `high-concept-premium`, `graphic-color-block` |
| ingredient-flatlay | `graphic-color-block`, `warm-editorial-table`, `color-sorted-flatlay` |

## Prompt template

```
[SUBJECT]
Hero packshot of {{exact product: form, size cues, packaging}}, {{material and finish}},
{{label or logo visible, if any}}.
{{for a set: exact piece count and arrangement — "the teapot with exactly four identical
cups in a row in front of it"}}; {{small structural parts as in the reference, with
material — "clear glass strainer inside, glass handle joins"}}.

[COMPOSITION]
{{camera angle — eye level / slight high three-quarter / straight-on / top-down}},
{{framing}}, product placed {{on a third / centered for catalog}}, {{how much air around it}}.

[LIGHTING]
{{direction + quality from photography-vocabulary.md, as the effect on the product — no
lamps, softboxes or stands named}}, {{Kelvin}}, {{shadow behaviour}}.

[LENS & CAMERA]
{{focal length}}, {{aperture}}, {{depth of field}}, focus locked on {{label / cap / front face}}.

[MATERIALS & TEXTURE]
{{surface under the product}}, {{reflections}}, {{micro-detail on the product}}.

[COLOR PALETTE]
{{2–3 tones from the product or stated brand}}, {{contrast level}}.

[STYLE REFERENCE]
{{merged descriptors from the keys above}}. Commercial still life, editorial finish.

[BRAND INTEGRATION]
{{known brand colors}}, mood {{clean / warm / edgy / refined}}.

[QUALITY MARKERS]
Tack-sharp, hyper-detailed, photorealistic, commercial grade.

[AVOID]
{{universal + labels-and-branding}}

Render at 2K resolution.
```

## Aspect ratio

| Use | Ratio |
|---|---|
| Shopify / catalog main (default) | `1:1` |
| Instagram shop post | `4:5` |
| Product page hero | `3:4` or `4:5` |
| Pinterest-friendly | `2:3` |
| Wide editorial | `16:9` |

## Quality gates

- [ ] Product recognizable and faithful to the reference
- [ ] Same number of pieces as the reference, in the stated arrangement
- [ ] Small structural details (strainer, gasket, handle joins, caps) match the
      reference in shape and material
- [ ] No light stands, softboxes, reflectors or other studio gear in frame
- [ ] Light has a clear direction and quality, not flat
- [ ] Shadows physically plausible
- [ ] Label and logo sharp, not warped
- [ ] Clean edges and reflections, no artifacts
- [ ] Backdrop deliberate, not muddy
- [ ] Palette matches the product or brand
- [ ] Prompt ends with the 2K line and `--resolution 2K` is set

## Invocation

Follow SKILL.md. One stable index per variant, the ratio chosen above, the same product
handle on every first pass.
