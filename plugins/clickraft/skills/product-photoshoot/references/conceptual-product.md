# Mode: conceptual-product

Deliberately unreal premium stills: floating products, frozen splashes, sculptural
arrangements, abstract CGI-look staging. The look that says "expensive".

## What sets it apart

- Gravity is optional: products float, hang or balance impossibly.
- Motion is frozen in ways a camera could barely catch.
- Composition is sculptural and geometric, not naturalistic.
- Light is stylized and dramatic.
- The staging looks rendered; the product itself stays photographically real.

## Presets

| Preset | Best for | Look |
|---|---|---|
| `levitating-suspended` | Fragrance, skincare, tech, luxury | Product floating, soft shadow below, clean backdrop |
| `splash-frozen-motion` | Drinks, cleansers, oils | Liquid burst frozen around the product |
| `abstract-cgi-render` | Premium DTC, fragrance, tech, jewelry | Hyper-clean render look, marble, chrome, liquid metal |
| `sculptural-arrangement` | Beauty, supplements, food | Products stacked into a geometric sculpture |
| `liquid-pour-suspension` | Oils, fragrance, sauces | A ribbon of liquid from the product, frozen mid-air |
| `broken-deconstructed` | Beauty, food, supplements | Exploded view: components and ingredients floating apart |
| `floating-elements` | Beauty, food, drinks | Petals, leaves, crystals, citrus or fabric hanging around the product |
| `surreal-environment` | Fragrance, fashion, conceptual brands | Impossible setting: clouds, water surface, mirror room, infinity space |
| `geometric-pedestal` | Fragrance, jewelry, watches, electronics | Minimal geometric plinth, one dramatic source |
| `chrome-liquid-metal` | Tech, fragrance, accessories | Chrome, liquid metal or mirror surfaces with reflection play |

## Style descriptor keys

| Preset | Keys |
|---|---|
| levitating-suspended, abstract-cgi-render | `surreal-levitation`, `high-concept-premium`, `monolithic-color-sculpture` |
| splash-frozen-motion, liquid-pour-suspension | `surreal-levitation`, `high-concept-premium`, `sculpted-dramatic-light` |
| sculptural-arrangement, geometric-pedestal | `graphic-color-block`, `playful-pop-still-life`, `monolithic-color-sculpture` |
| broken-deconstructed | `graphic-color-block`, `high-concept-premium`, `surreal-levitation` |
| floating-elements, surreal-environment | `whimsical-fantasy`, `surreal-levitation`, `high-concept-premium` |
| chrome-liquid-metal | `surreal-levitation`, `soft-surreal-color`, `monolithic-color-sculpture` |

## Lighting per preset

- **levitating-suspended** — one soft key above-front at 45°, dark backdrop, soft shadow under the floating product, 5000K.
- **splash-frozen-motion** — hard high-speed strobes, several heads to separate the splash, 5500K, crisp shadow.
- **abstract-cgi-render** — multi-source studio with controlled bounce, even key plus rim, 5500K, mirror-clean reflections.
- **sculptural-arrangement** — one gridded dramatic key, deep architectural shadow, 5000K, monumental.
- **liquid-pour-suspension** — hard backlight to outline the liquid, rim separation, 5000K, every drop sharp.
- **broken-deconstructed** — even soft overhead, minimal shadow, 5500K, clinical clarity.
- **floating-elements** — soft directional key with subtle fills, 4500K, airy.
- **surreal-environment** — light from an impossible source (glow from within, light from below, color refracted through liquid), about 5000K.
- **geometric-pedestal** — one hard key with a strong shadow, gallery precision, 5000K.
- **chrome-liquid-metal** — soft dome or tent light to control reflections, 5500K, crisp speculars.

## Prompt template

```
[CONCEPT]
{{the idea in one or two sentences}}. A deliberately surreal, render-like staging with
photoreal detail — not documentary photography.

[PRODUCT]
{{exact product}}, {{material and finish}}, {{label or logo}}, crisp and real despite the
staging.

[COMPOSITION]
{{floating / sculptural / suspended / geometric}}, {{the one surreal element}}, strong
visual hierarchy.

[PHYSICS DEFIANCE]
{{exactly what breaks physics — floats with no support / liquid hangs without falling /
objects balance impossibly / stylized shadow}}.

[LIGHTING]
{{the preset's setup}}, crisp highlights on glass, metal and liquid.

[BACKGROUND & ENVIRONMENT]
{{clean gradient / impossible space / geometric set / infinity cove}}, supporting the
product, never competing.

[MATERIALS & TEXTURES]
{{marble / chrome / liquid metal / polished glass / water / smoke / satin / velvet}},
hyper-real surface detail.

[LENS & CAMERA]
{{50mm / 85mm / 100mm macro}}, {{f/8–f/11 for sculptural depth, or f/2.8 for selective
focus}}, the product sharp throughout.

[COLOR PALETTE]
{{2–3 tones}}, {{high contrast / monochrome / one accent on neutral}}.

[STYLE REFERENCE]
{{merged descriptors from the keys above}}. Premium conceptual still life, render-like
finish, editorial standard.

[BRAND INTEGRATION]
{{brand colors and mood — premium / refined / experimental / luxury}}.

[QUALITY MARKERS]
Render-grade precision with photographic realism, tack-sharp surfaces, exact lighting.

[AVOID]
{{universal + labels-and-branding}}
no cartoon render, no obvious AI tells, no plastic product surface,
no half-surreal — fully committed or fully real, never in between,
no clutter, no random floating objects without purpose,
no text or logos other than the product's own,
no distorted or melted product geometry.

Render at 2K resolution.
```

## Aspect ratio

| Use | Ratio |
|---|---|
| Standalone premium, catalog (default) | `1:1` |
| Editorial portrait | `3:4` |
| Instagram feed | `4:5` |
| Pinterest | `2:3` |
| Story / TikTok | `9:16` |
| Wide editorial / banner | `16:9` |

Default `1:1` standalone, `3:4` for editorial use.

## Composition principles

- Commit fully. Half-surreal looks worse than real.
- Empty space here is a premium device, not a reserved text area — the two are different.
- The product stays photoreal; only the staging is impossible.
- One main surreal element plus 2–4 supporting ones. More is clutter.
- Reward geometry: triangles, golden ratio, symmetry, repetition.

## Brand fit

Strong: premium fragrance and beauty, watches and jewelry, premium tech, fashion
accessories, high-end DTC skincare, supplements and food.

Weak: everyday CPG, value brands, bohemian or handmade, warm rustic brands. If the
brand reads warm, rustic or handmade, suggest `lifestyle-scene` or `product-shot`
instead — this mode will fight the brand.

## Invocation

Follow SKILL.md. Attach the product handle to every first pass when available; a
precisely described text-only product runs without one (index 0 first, then its result
as the reference).

## Quality gates

- [ ] Fully committed to the surreal
- [ ] Product sharp and photoreal
- [ ] Product matches the reference
- [ ] Light dramatic and intentional
- [ ] Few, purposeful surreal elements
- [ ] Reads as premium
- [ ] Brand colors present
- [ ] Ratio matches the use
- [ ] Prompt ends with the 2K line
