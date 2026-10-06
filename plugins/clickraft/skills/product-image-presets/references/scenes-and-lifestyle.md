# Scene and lifestyle presets

Twelve presets that place the product in a real setting or a staged arrangement:
`in-hand`, `kitchen-scene`, `on-desk`, `gym-bag`, `travel-pack`, `weekend-carry`,
`flatlay`, `shelf-ready`, `retail-stack`, `bundle`, `unboxing`, `inside-pack`.

Flags for all of them (see SKILL.md "Locked settings"):

```
--model-slug gpt-image-2.5-sunburst --quality high --aspect-ratio 3:4
--reference-image <photo>   or   --product <uuid>[:imageId]
```

Inputs: the product photo only. No on-image text. Supporting objects are always generic
and unbranded, and always secondary to the product.

## Fidelity blocks

Append the named block after the scene paragraph, word for word.

**STAGED** (arrangements built around the product itself)

> Treat the attached photo as the only source of truth for the product. If that photo was
> taken from above or at a tilt, do not copy its camera angle: place the product upright
> and level in its normal orientation for this shot. Keep the product identical to the
> photo in outline, proportions, materials, surface finish, colors, closure, logo position
> and packaging construction, and keep its printed label text exactly as printed. Add
> nothing that was not requested: no extra logos, watermarks, prices, claims, captions or
> unrelated products. If a hand or person appears, give them natural anatomy and keep the
> product at its real size. Render a photorealistic, production-ready image with crisp
> edges and light and shadows that agree with each other.

**LIFESTYLE** (the product living in an everyday place)

> Treat the attached photo as the only source of truth for the product. If that photo was
> taken from above or at a tilt, do not copy its camera angle: place the product upright
> and level in its normal orientation for this shot. Keep the product identical to the
> photo in outline, proportions, materials, surface finish, colors, closure, logo position
> and packaging construction, and keep the text printed on it exactly as printed. If a
> hand or person appears, keep the grip, anatomy and scale natural. Light the scene from
> one believable direction and give every object a physically correct contact shadow.
> Invent no facts about the product: no claims, measurements, ingredients, prices or
> certifications, and no extra logos, watermarks or unrelated branded products.

## in-hand

Visible effect: the product held in a hand.
Fidelity block: **STAGED**

> Commercial photograph of the product held naturally in one human hand. The grip suits
> the product's size and shape, the fingers are anatomically correct with real knuckles
> and nails, and the product casts soft contact shadows onto the palm and fingers. The
> fingers wrap around the sides so the front label stays fully visible. Soft, flattering
> light; a simple, out-of-focus background.

## kitchen-scene

Visible effect: the product in a kitchen.
Fidelity block: **LIFESTYLE**

> Lifestyle photograph of the product standing on a clean kitchen counter in soft
> daylight from a nearby window. A few everyday kitchen elements in the background (a
> tiled wall, a cutting board, a plant) give a lived-in home feeling and stay out of
> focus. Show no food, ingredients or uses that the product category does not support.

## on-desk

Visible effect: the product on a work desk.
Fidelity block: **LIFESTYLE**

> Lifestyle photograph of the product on a contemporary work desk: a believable desktop
> surface, a small number of restrained work objects (a notebook, a pen, the edge of a
> laptop), and soft directional daylight. The desk looks in use but deliberately
> composed, with the product clearly the focus.

## gym-bag

Visible effect: the product as part of a gym kit.
Fidelity block: **LIFESTYLE**

> Lifestyle photograph of the product in or next to an open gym bag, with a few
> unbranded training essentials (a folded towel, a water bottle, earphones). Realistic
> scale, natural fabric folds, contact shadows, and an organized but slightly lived-in
> feel.

## travel-pack

Visible effect: the product in a travel setting.
Fidelity block: **LIFESTYLE**

> Lifestyle photograph of the product in a believable travel moment: tucked into an open
> suitcase, sitting in a carry-on tray, or on a hotel nightstand. Packaging is intact and
> unopened unless the photo shows it open, the scale is correct, and travel objects stay
> in a supporting role.

## weekend-carry

Visible effect: a collection of weekend essentials.
Fidelity block: **LIFESTYLE**

> Editorial arrangement of the product with a small selection of unbranded weekend
> things to carry (sunglasses, a canvas tote, keys, a paperback). Relaxed styling,
> materials that go together, and a clear hierarchy with the product first. Show only
> the one product as given; do not create other colorways or variants of it.

## flatlay

Visible effect: a neat overhead composition.
Fidelity block: **STAGED**

> Flat-lay photograph shot straight down from above. The product anchors the layout,
> with a few relevant, unbranded supporting objects placed around it on an editorial
> grid with even spacing. Flat, soft light and small natural contact shadows under every
> object. For a flat-lay, lying the product flat and facing the camera is its natural
> orientation.

## shelf-ready

Visible effect: the product presented on a shelf.
Fidelity block: **STAGED**

> Retail photograph of the product on a premium store shelf, facing forward and easy to
> identify at a glance. Real shelf depth, clean merchandising light from above, and
> neighboring items reduced to soft, unbranded shapes that stay secondary.

## retail-stack

Visible effect: several product packs grouped together.
Fidelity block: **STAGED**

> Retail display photograph of several identical copies of the product package, stacked
> in a stable, physically believable arrangement. Every copy carries the same printing at
> a consistent scale and perspective. One unit sits at the front facing the camera and
> dominates; the rest support it. Clean, bright light.

## bundle

Visible effect: several units presented as a set.
Fidelity block: **STAGED**

> Product set photograph: several units of the product grouped as one coordinated
> bundle, each unit an exact copy of the photographed product. Clear hierarchy (one lead
> unit, the rest arranged around or behind it) and consistent scale. Do not add other
> products, flavors or variants that the photo does not show.

## unboxing

Visible effect: an open box revealing its contents.
Fidelity block: **STAGED**

> Premium unboxing photograph: the product's box is open and the product is revealed
> inside it or lifted out beside it. The box design follows the photographed packaging;
> lids, inserts, tissue and folds behave like real cardboard and paper. Include no
> accessories that the photo does not suggest.

## inside-pack

Visible effect: the internal structure of the packaging.
Fidelity block: **STAGED**

> Packaging cutaway photograph: the package is shown opened or in a clean cross-section
> so you can see how the product sits inside. The outside of the pack matches the photo
> exactly; inner trays, folds and compartments are mechanically plausible for this kind
> of packaging.
