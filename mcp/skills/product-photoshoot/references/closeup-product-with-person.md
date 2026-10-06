# Mode: closeup-product-with-person

A tight crop where the product leads and a body part gives context: hands, lips, cheek,
eye area. The person adds feeling; the product owns the frame.

How it differs: `lifestyle-scene` is a wider environment; `virtual-model-tryout` is a
full or partial model wearing the product. Here the crop is close, the person is always
partial, and the register is premium DTC beauty, skincare, fragrance or wellness.

**Requires** a catalog product or a product image. Attach it to every first pass.

## Presets

| Preset | Best for | Look |
|---|---|---|
| `serum-application` | Serums, oils, treatments | Hand applying to the face, dropper or spatula visible, luminous skin |
| `lipstick-on-lips` | Lipstick, balm, gloss | Lips in close-up, product touching or just applied, crisp highlight |
| `hand-holding-vertical` | Bottles, fragrance, skincare | Hand cradling the product upright, wrist in frame, soft glow on glass |
| `pour-into-palm` | Creams, lotions, oils, capsules | Product poured into an open palm, rich texture |
| `eye-makeup-closeup` | Mascara, shadow, liner | Eye area cropped tight, product near or applied, lash detail |
| `texture-on-skin` | Creams, balms, scrubs, foundation | Swatch on the back of a hand or cheek, texture readable |
| `dropper-mid-air` | Dropper serums and oils | Dropper above skin, one drop suspended, clinical-premium |
| `hands-cradling-jar` | Body care, candles, jars | Two hands around an open jar, fingertips in product |
| `face-touch-product` | Results-led skincare | Hand resting on cheek, product nearby, glow linking the two |
| `mouth-bite-or-sip` | Food, drinks, supplements | Lips or teeth meeting the product — sip, bite, taste |

## Style descriptor keys

| Preset | Keys |
|---|---|
| serum-application, face-touch-product, texture-on-skin | `skin-sculpting-light`, `glossy-beauty`, `sunlit-airy-lifestyle` |
| lipstick-on-lips, eye-makeup-closeup | `modern-minimal-beauty`, `glossy-beauty`, `experimental-beauty` |
| hand-holding-vertical, hands-cradling-jar | `graphic-color-block`, `sunlit-airy-lifestyle`, `surreal-levitation` |
| pour-into-palm, dropper-mid-air | `surreal-levitation`, `skin-sculpting-light`, `high-concept-premium` |
| mouth-bite-or-sip | `warm-editorial-table`, `bright-modern-food`, `sunlit-airy-lifestyle` |

## Lighting per preset

- **serum-application** — soft beauty dish in front, light fill from below, 5000K, gentle highlight on glass and skin.
- **lipstick-on-lips / eye-makeup-closeup** — frontal beauty dish or ring, 5500K, crisp catchlight, even skin.
- **hand-holding-vertical** — window light from the side, 4500K, rim behind the product, soft fill on the hand.
- **pour-into-palm** — overhead softbox, 5000K, quick falloff that shows the liquid, hand slightly darker.
- **dropper-mid-air** — gridded hard key, 5000K, drop frozen sharp, dark background.
- **hands-cradling-jar** — soft warm window, 3500K, ritual intimacy, highlight on the rim.
- **texture-on-skin** — low raking side light, 5000K, texture casts tiny shadows.
- **face-touch-product** — soft front fill with a key 45° camera-left, 4500K, glowing skin.
- **mouth-bite-or-sip** — warm practical or window key, 4000K, appetizing highlight.

## Prompt template

```
[FRAMING]
Tight close-up. The product leads the frame and fills about {{40–60}}% of it.
Crop: {{nose to chin / both hands around the product / open palm / eye area}}.

[PRODUCT]
The product from the reference — {{form, material, finish, label}} — in sharp focus.

[PERSON CONTEXT]
{{hands with real skin texture / lips with natural detail / cheek with healthy glow /
eye area with defined lashes}}. Partial and supporting, never the subject.
{{skin tone, if specified}}.

[INTERACTION]
{{applying / holding / pouring / touching / tasting}}, natural and unhurried, ritual-like.

[LIGHTING]
{{the preset's setup above, written as its effect — no gear named}}. Clean highlight on the product. Real skin sheen, no plastic.

[LENS & CAMERA]
{{100mm macro / 85mm}}, {{f/2.8–f/4}}, shallow focus on the product, skin softly defocused.

[SKIN & DETAIL]
Pores, fine hairs and small imperfections visible, nothing smoothed. Fingers and hands
anatomically correct. Hair crisp where visible.

[COLOR PALETTE]
{{2–3 tones}}, product colors exactly as in the reference.

[STYLE REFERENCE]
{{merged descriptors from the keys above}}. Premium beauty editorial.

[PRODUCT FIDELITY]
The product is identical to the reference — same color, material, shape and branding.
The person supports it; the product is the anchor.

[QUALITY MARKERS]
Magazine-cover finish, hyper-detailed, photorealistic.

[AVOID]
{{universal + people-in-frame + labels-and-branding}}
no full face filling the frame, no person stealing focus,
no airbrushed skin, no clinical coldness where warmth is wanted.

Render at 2K resolution.
```

## Aspect ratio

| Use | Ratio |
|---|---|
| Instagram feed (default) | `4:5` |
| E-commerce close-up | `1:1` |
| Pinterest | `2:3` |
| Story / TikTok | `9:16` |
| Wide editorial | `3:2` or `16:9` |

## Composition rules

- Product first. If the person dominates, recompose.
- Product covers 40–60% of the frame — never under 30%, never over 70%.
- Place it on a third unless centering is a deliberate choice.
- State finger positions: relaxed, natural grip.
- Partial face only — never the whole face.
- Background blur supports the product; not muddy.
- Skin always real: pores, fine hair, small irregularities.

## Quality gates

- [ ] Product is the anchor at 40–60% of the frame
- [ ] Person is partial context only
- [ ] Product matches the reference exactly
- [ ] Hands, lips, eyes anatomically right
- [ ] Skin textured, not plastic
- [ ] Light matches the preset
- [ ] Focus sits on the product surface
- [ ] Brand colors present
- [ ] Ratio matches the use
- [ ] Prompt ends with the 2K line
