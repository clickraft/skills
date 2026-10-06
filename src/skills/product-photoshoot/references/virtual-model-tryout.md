# Mode: virtual-model-tryout

Fashion-grade images of the product worn or used by a generated adult model — the
on-model shoot without the shoot. Apparel, accessories, jewelry, eyewear, watches, bags,
hats, footwear.

**Requires** a catalog product or a product image, attached to every first pass.

## What it does and doesn't do

- Renders a new model from the prompt description each time.
<cli>
- Does not keep the same person across images unless the user has a trained identity:
  then add `--brand-model <uuid>` (find it with `clickraft brand-model list
  --json`; `data[].id`, `data[].name`). Without one, a set shows the same "type" of
  person, not the same individual — say so if the user expects one face throughout.
- Pass the bare uuid by default; the server uses the model's primary image. Add a pose
  (`<uuid>:<pose>` — `front`, `3/4-right`, `right`, `left`, `3/4-left`, `back`,
  `face-closeup`, `hands`, `approved`) only when the user asks for that angle, and only
  if that model has an image of it stored: check first with the free `clickraft
  generate estimate --json` and the same flags. `E_BRAND_MODEL_POSE_NOT_FOUND` means it
  is missing — drop the pose and use the bare uuid. Shared system models reject every
  pose.
</cli>
<mcp>
- Does not keep the same person across images unless the user has a trained identity:
  then add `brandModels: [{ id }]` (find it with `brand_model_list()`; `brandModels[].id`,
  `.name`). Without one, a set shows the same "type" of person, not the same individual
  — say so if the user expects one face throughout.
- Pass only the `id` by default; the server uses the model's primary image. Add a pose
  (`imageType` — `front`, `3/4-right`, `right`, `left`, `3/4-left`, `back`,
  `face-closeup`, `hands`, `approved`) only when the user asks for that angle, and only
  if that model has an image of it stored: check first with the free
  `generate_estimate` and the same fields. `BRAND_MODEL_POSE_NOT_FOUND` means it is
  missing — drop `imageType` and pass only the `id`. Shared system models reject every
  pose.
</mcp>
- Models are always adults. No suggestive posing.

## Presets

| Preset | Best for | Look |
|---|---|---|
| `studio-clean` | Catalog on-model main image | Seamless sweep, soft frontal light, neutral pose |
| `editorial-fashion` | Lookbook, campaign | Atmospheric setting, expressive pose, dynamic light |
| `street-style` | Casual, urban brands | Real street, candid pose, daylight |
| `outdoor-natural` | Outdoor, athleisure | Forest, beach or mountain, golden hour, easy pose |
| `home-lifestyle` | Loungewear, sleepwear | Cozy room, relaxed pose, warm lamp |
| `closeup-detail` | Jewelry, watches, eyewear | Tight crop on the product area, shallow focus |
| `runway-style` | Fashion-forward editorial | Runway-like studio, dramatic light, confident stride |
| `flat-lay-on-body` | Top-down outfits | Overhead view of the body wearing the product on a flat surface |

## Style descriptor keys

| Preset | Keys |
|---|---|
| studio-clean | `glossy-high-fashion`, `skin-sculpting-light`, `dark-moody-fashion` (softened) |
| editorial-fashion | `whimsical-fantasy`, `glossy-high-fashion`, `dramatic-editorial` |
| street-style | `street-candid`, `natural-confident`, `atmospheric-documentary` |
| outdoor-natural | `natural-confident`, `atmospheric-documentary`, `youthful-free-outdoor` |
| home-lifestyle | `pastel-nostalgic`, `natural-confident`, `atmospheric-documentary` |
| closeup-detail | `skin-sculpting-light`, `modern-minimal-beauty`, `glossy-beauty` |
| runway-style | `dramatic-editorial`, `glossy-high-fashion`, `experimental-beauty` |
| flat-lay-on-body | `surreal-conceptual`, `pastel-nostalgic`, `abstract-editorial` |

## Lighting per preset

- **studio-clean** — large softbox 45° camera-left, bounce fill camera-right, hair light, 5500K, soft even shadow.
- **editorial-fashion** — one hard gridded or gelled key, deep shadow, strong separation, 4500–5500K.
- **street-style** — available daylight with reflector fill, 5000K, candid.
- **outdoor-natural** — golden-hour backlight with reflector fill, about 4500K, light haze.
- **home-lifestyle** — window light with a warm practical lamp, 3500K, soft.
- **closeup-detail** — beauty dish or soft directional, shallow focus, crisp catchlight, 5500K.
- **runway-style** — strong key with rim, a touch of haze, steep falloff, 5000K.
- **flat-lay-on-body** — even overhead diffusion, minimal shadow, 5000K.

## Prompt template

```
[PRODUCT]
The product from the reference — {{type, color, material, details}} — worn on / held at
the model's {{body area}}.

[MODEL]
Adult model: {{gender presentation, age range, ethnicity if specified, hair, build, skin
tone}}. Natural features, correct anatomy, realistic proportions.

[POSE]
{{standing three-quarter / mid-stride / leaning / seated / candid moment}}; hands
{{exact placement}}; eyes {{direction}}; expression {{mood}}.

[FRAMING]
{{full body / three-quarter / waist up / close on the product area}}, subject on {{a third}}.

[ENVIRONMENT]
{{backdrop or location from the preset}}.

[WARDROBE & STYLING]
{{everything else worn — neutral coordinated / layered / minimal}}, supporting the
product without competing.

[LIGHTING]
{{the preset's setup, written as its effect — no gear named}}, {{skin highlight behaviour}}.

[LENS & CAMERA]
{{50mm / 85mm / 35mm}}, {{f/2.8–f/5.6}}, focus on {{the product area}}, {{shallow / medium}} depth.

[SKIN & DETAIL]
Real skin with pores, no smoothing. Hair in individual strands. Hands and fingers correct.

[STYLE REFERENCE]
{{merged descriptors from the keys above}}. Editorial fashion photography.

[PRODUCT FIDELITY]
The product stays identical to the reference — color, material, construction,
proportions, logo placement. Wearing it does not change it.

[QUALITY MARKERS]
Magazine-cover finish, hyper-real, professional fashion standard.

[AVOID]
{{universal + people-in-frame + labels-and-branding}}
no other garments competing with the product, no suggestive poses,
no distorted product shape, no shifted product color.

Render at 2K resolution.
```

## Anatomy rules (the usual giveaways)

- Hands: say exactly what they do — "fingers loosely curled at her side", "hand on hip,
  thumb forward", "natural grip on the bag strap".
- Feet: shoe and ground contact — "feet shoulder-width, weight on the back leg".
- Face: eye direction and expression — wrong gaze is the most common tell.
- Posture: spine and shoulders relaxed, not stiff.
- Always add "natural human proportions, anatomically correct".

## Product fidelity

- Always pass the product reference.
- State in the prompt that the product keeps its color, texture, branding and details.
- Close-ups show the product unobstructed; wide shots keep it visible and identifiable.

## Aspect ratio

| Use | Ratio |
|---|---|
| E-commerce on-model main (default) | `4:5` |
| Lookbook | `3:4` or `2:3` |
| Instagram feed | `4:5` |
| Pinterest | `2:3` |
| Story / TikTok | `9:16` |
| Wide editorial | `16:9` |

## Quality gates

- [ ] Product matches the reference exactly
- [ ] Anatomy correct — hands, fingers, face
- [ ] Pose natural and on-brand
- [ ] Skin real, not plastic
- [ ] Light matches the preset
- [ ] Wardrobe supports, doesn't compete
- [ ] Framing shows the product clearly
- [ ] Ratio matches the use
- [ ] Prompt ends with the 2K line
