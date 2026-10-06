# Mode: restyle

Change the look, mood or season of an existing image while the subject, composition and
product stay the same.

**Requires** the source image (a local path, a URL, or a finished `data.resultUrl`).
Attach it as `--reference-image` to every first pass. Keep the source's aspect ratio
unless the user asks for another.

## Two axes

Use either one alone, or both together ("a Christmas version in cottage style").

### Axis 1 — aesthetic

| Aesthetic | Signature | Palette | Surfaces |
|---|---|---|---|
| `clean-girl` | Fresh, dewy, minimal | Vanilla, blush, taupe, soft gold | Clear glass, brushed gold, crisp linen |
| `cottagecore` | Rustic, romantic, handmade | Sage, cream, dried rose, wheat | Linen, raw wood, dried flowers, old paper |
| `y2k` | Glossy, playful, futuristic | Hot pink, lime, chrome, baby blue | Chrome, shiny plastic, holographic film, glitter |
| `minimal` | Stripped back, geometric | White, grey, one accent | Concrete, brushed metal, matte paper |
| `dark-academia` | Moody, scholarly | Oxblood, deep brown, parchment, ivy | Worn leather, old paper, dark wood, candlelight |
| `quiet-luxury` | Restrained, expensive | Warm grey, camel, muted navy, parchment | Cashmere, polished marble, brushed metal |
| `scandinavian` | Cool, clean, functional | White, pale grey, raw wood, black | Pale wood, linen, ceramic, simple lines |
| `coastal-grandmother` | Breezy, weathered | Dusty blue, sand, white, driftwood | Linen, driftwood, ceramic, woven fiber |
| `maximalist` | Layered, bold | Intentional color clash | Velvet, brass, patterned wallpaper |
| `brutalist` | Raw, monolithic | Concrete grey, black, white | Raw concrete, brushed steel, exposed structure |
| `art-deco` | Geometric glamour | Black, gold, emerald, ivory | Polished marble, brass, lacquer, mirror |
| `retro-90s` | Grainy nostalgia | Magenta, teal, mustard | Film grain, faded color, soft vintage glow |
| `futurist` | Sleek, glowing | Neon cyan, magenta, deep black | Gloss black, glowing edges, holographic |
| `japandi` | Calm organic-modern | Warm beige, charcoal, soft white | Pale wood, linen, ceramic, soft shadow |
| `bohemian` | Eclectic, warm | Terracotta, mustard, deep teal, cream | Macramé, woven rugs, brass, plants |
| `mid-century-modern` | Clean lines, warm wood | Mustard, teal, walnut, cream | Walnut, leather, geometric patterns |
| `gothic-romance` | Dark, ornate | Black, deep red, gold, deep purple | Velvet, lace, candlelight, antique frames |
| `pastel-dream` | Soft, ethereal | Lavender, peach, mint, baby blue | Tulle, pastel paper, dreamy light |

### Axis 2 — season or holiday

| Occasion | Cues | Palette | Light |
|---|---|---|---|
| `christmas` | Pine, holly, ornaments, candles, ribbon, snowy window | Deep red, evergreen, gold, cream | Warm tungsten glow |
| `black-friday` | Bold sale energy, dramatic | Black, red, white, stark contrast | Hard cinematic contrast |
| `cyber-monday` | Tech, neon, digital cues | Electric blue, magenta, black | Glowing edges |
| `valentines-day` | Roses, soft hearts, candles, ribbon | Dusty rose, deep red, blush, gold | Warm romantic glow |
| `mothers-day` | Spring flowers, brunch | Blush, sage, cream, soft yellow | Soft morning daylight |
| `fathers-day` | Wood, leather | Warm brown, navy, olive | Warm afternoon |
| `easter` | Pastel eggs, spring flowers, greenery | Mint, lavender, peach | Bright spring morning |
| `halloween` | Pumpkins, candles, autumn leaves | Orange, deep purple, black, amber | Candle and twilight |
| `thanksgiving` | Harvest, wheat, gourds, spice | Burnt orange, ochre, deep red, cream | Warm golden afternoon |
| `back-to-school` | Notebooks, pencils, apples, denim | Navy, mustard, red, denim | Crisp morning |
| `pride` | Rainbow accents, celebration | Full saturated spectrum | Vivid festive light |
| `new-years` | Champagne, gold confetti, midnight | Gold, black, navy, white | Sparkling night |
| `summer` | Sun, water, fruit, light fabrics | Bright blue, yellow, white, coral | Midday or golden hour |
| `spring` | Blossoms, fresh greens | Soft pink, green, cream, butter | Soft morning sun |
| `fall` | Foliage, knitwear, spice | Burnt orange, mustard, deep red, brown | Low warm sun |
| `winter` | Snow, frost, cozy textures | Deep blue, white, silver, deep green | Cool daylight or warm interior |
| `lunar-new-year` | Red lanterns, gold, blossoms | Deep red, gold, black | Warm festive glow |
| `4th-of-july` | Summer picnic, fireworks | Red, white, blue, warm | Bright summer outdoors |

## Style descriptor keys

| Aesthetic | Keys |
|---|---|
| clean-girl, minimal, quiet-luxury | `clean-ecommerce`, `graphic-color-block`, `modern-minimal-beauty` |
| cottagecore, coastal-grandmother, japandi | `handcrafted-moody-warm`, `editorial-interiors`, `nordic-soft-daylight` |
| y2k, futurist, pastel-dream | `pastel-nostalgic`, `surreal-conceptual`, `soft-surreal-color` |
| dark-academia, gothic-romance | `whimsical-fantasy`, `cinematic-staged-narrative`, `narrative-portrait` |
| maximalist, bohemian, art-deco | `whimsical-fantasy`, `glossy-high-fashion`, `dramatic-editorial` |
| scandinavian, brutalist, mid-century-modern | `graphic-color-block`, `editorial-interiors`, `nordic-soft-daylight` |
| retro-90s | `pastel-nostalgic`, `abstract-editorial`, `raw-flash-retro` |

Season only: pick the key set of the closest aesthetic (e.g. christmas → cottagecore set,
cyber-monday → futurist set, black-friday → maximalist set).

## Prompt template

```
[SOURCE]
Restyle the reference image. Keep: {{subject identity, composition, framing, focal
point, product details}}.

[TRANSFORMATION]
Turn it into a {{aesthetic}}{{ + season}} look.

[AESTHETIC SHIFT]
{{the aesthetic's cues}}, {{surface and texture changes}}, {{mood shift}}.

[SEASONAL SHIFT]
{{if used: the occasion's cues and props}}, {{palette pulled toward the season}}.

[PALETTE]
Lead with {{the preset palette}}; the product's own colors stay recognizable.

[LIGHTING]
{{new light for the look — direction, quality, Kelvin}}; replace the source light when needed.

[TEXTURE & SURFACE]
{{the preset's surfaces}}.

[STYLE REFERENCE]
{{merged descriptors from the keys above}}.

[PRESERVATION]
It must still read as the same image — same subject, same layout — with only look and
atmosphere changed.

[QUALITY MARKERS]
Photorealistic, magazine quality, faithful to the source subject.

[AVOID]
{{universal + aesthetic-mixing + labels if visible}}
no change of subject identity, no change of composition, no change to the product.

Render at 2K resolution.
```

## Invocation

Follow SKILL.md. Every first pass carries the same source as `--reference-image` and the
source's ratio (map it to the nearest supported ratio if it has an unusual one, and say
so). Several variants = several aesthetics or occasions, one per index.

## Quality gates

- [ ] Subject preserved
- [ ] Composition preserved
- [ ] New look fully committed, not half-applied
- [ ] Palette matches the preset
- [ ] Seasonal cues read clearly (if used)
- [ ] Editorial, not kitsch
- [ ] Ratio matches the source unless changed on request
- [ ] Prompt ends with the 2K line
