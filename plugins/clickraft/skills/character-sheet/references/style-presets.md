# Style presets

Each preset supplies three modules for the slot architecture: **realism / render**
(slot 7), **lighting** (slot 10) and **quality tail** (slot 11), plus any style-specific
exclusions. Default: `photoreal-unretouched`.

If the user's style fits none of these, build a custom preset with the same three parts
and keep the layout clause and consistency anchor unchanged.

---

## 1. `photoreal-unretouched` (default)

The signature look: a real person photographed in a studio, with nothing smoothed away.

**Realism module (mandatory for this preset):**

> true-to-life skin with fine pores, faint lines and small natural asymmetries, uneven
> texture where real skin has it, everyday makeup that is visible and blended slightly
> unevenly instead of a flawless base, a light natural flush on the cheeks, a soft
> natural sheen only — never glossy or dewy, no retouching, no smoothing, no beauty
> filter, no airbrushed or AI-polished finish, no shine spots, glare or blown highlights
> on the skin, a matte-to-natural complexion

Optional imperfection anchors (pick one or two, keep them identical across revisions):
a scattering of faint freckles, a small mole on the neck or collarbone, a tiny scar
through one eyebrow, slightly chapped lips.

**Eyes (slot 5 add-on):** soft, small catchlights, no large specular reflection in the
iris, eye color slightly muted rather than glowing.

**Lighting:** soft, diffused studio light with no harsh reflections or hot spots.

**Quality tail:** anatomically natural, premium commercial photography left
unretouched, cinematic realism, clean white backdrop, 4K detail, crisp focus on skin
texture.

**Extra exclusions:** no beauty filter, no smoothing, no airbrushing, no plastic or
waxy skin, no glossy skin.

---

## 2. `editorial-polished`

Same photographic base, with tasteful fashion-shoot polish. Use when the user wants
"glam", "magazine", "beauty campaign".

**Realism module:**

> refined, near-flawless skin that still shows fine texture, a soft dewy glow on the
> cheekbones only, polished makeup, groomed brows and hair

**Lighting:** beauty lighting with a soft main light and gentle fill.

**Quality tail:** high-end fashion editorial photograph, cover-shoot finish, cinematic
realism, 4K.

**Extra exclusions:** no plastic skin, no heavy smoothing.

---

## 3. `anime-2d`

**Render module:**

> clean anime illustration, crisp confident lineart, cel shading with flat color and
> soft gradient shadows, large expressive eyes with detailed iris highlights,
> on-model consistency like a studio model sheet

Drop every skin-texture, pore and makeup clause — they do not apply to 2D. The eye
low-glare clause is also dropped (anime eyes keep their highlights).

**Lighting:** even, flat lighting with soft ambient shading.

**Quality tail:** high-quality anime key-visual finish, clean vector-sharp linework,
crisp, 4K.

---

## 4. `3d-stylized`

Feature-animation 3D look.

**Render module:**

> stylized 3D character render, appealing slightly exaggerated proportions, soft
> subsurface-scattered skin, gently rounded features, individually resolved hair
> strands, simulated cloth folds

**Lighting:** soft global illumination, three-point studio setup with a gentle rim
light.

**Quality tail:** feature-animation studio quality, high-end real-time or path-traced
render look, clean neutral backdrop, 4K.

Note: rounded features are part of this style, so for adult characters keep the mature
proportions in the face slot but do not add the "no rounded features" exclusion.

---

## 5. `game-concept`

**Render module:**

> painterly game concept art, semi-realistic rendering, orthographic model-sheet
> views, a strong readable silhouette, materials clearly distinguished through
> surface detail

**Lighting:** neutral, even concept-art lighting.

**Quality tail:** professional character concept art, portfolio-grade finish, sharp,
4K.

Pairs naturally with the `turnaround` layout.

---

## Picking a preset from the brief

| Brief says | Preset |
|---|---|
| nothing about style, "realistic", "photo", "real person", a person photo | `photoreal-unretouched` |
| "glam", "magazine", "editorial", "beauty campaign" | `editorial-polished` |
| "anime", "manga", "2D", "cel-shaded", "cartoon" (flat) | `anime-2d` |
| "3D", "animated movie look", "CG", "toy-like" | `3d-stylized` |
| "concept art", "game character", "RPG", "orthographic" | `game-concept` |
