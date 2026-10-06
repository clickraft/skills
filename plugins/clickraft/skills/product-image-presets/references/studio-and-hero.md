# Studio and hero presets

Eight presets that keep the product alone in a controlled studio or graphic space:
`hero-shot`, `minimalist-white`, `angles`, `luxury`, `power-angle`, `pedestal-shot`,
`symmetry`, `signature-frame`.

Flags for all of them (see SKILL.md "Locked settings"):

```
--model-slug gpt-image-2.5-sunburst --quality high --aspect-ratio 3:4
--reference-image <photo>   or   --product <uuid>[:imageId]
```

Inputs: the product photo only. No on-image text; none of these presets adds words.

## Fidelity blocks

Append the named block after the scene paragraph, word for word.

**STUDIO**

> Treat the attached photo as the only source of truth for the product. If that photo was
> taken from above or at a tilt, do not copy its camera angle: stand the product upright
> and level in its normal orientation for this shot. Keep the product identical to the
> photo in outline, proportions, materials, surface finish, colors, closure, logo position
> and packaging construction, and keep its printed label text exactly as printed. Add
> nothing that was not requested: no extra logos, watermarks, prices, claims, captions or
> other products. If a hand or person appears, give them natural anatomy and keep the
> product at its real size. Render a photorealistic, production-ready image with crisp
> edges and light and shadows that agree with each other.

**STUDIO-STRICT** (STUDIO plus a stricter label rule; used where the label is the point)

> Treat the attached photo as the only source of truth for the product. If that photo was
> taken from above or at a tilt, do not copy its camera angle: stand the product upright
> and level in its normal orientation for this shot. Keep the product identical to the
> photo in outline, proportions, materials, surface finish, colors, closure, logo position
> and packaging construction. Reproduce every printed element, including small print,
> stickers and secondary marks, letter for letter as in the photo; never translate,
> respell or swap any word or character, and draw text too small to read as the same
> faithful shapes rather than new words. Add nothing that was not requested: no extra
> logos, watermarks, prices, claims, captions or other products. If a hand or person
> appears, give them natural anatomy and keep the product at its real size. Render a
> photorealistic, production-ready image with crisp edges and light and shadows that
> agree with each other.

## hero-shot

Visible effect: the product as the undisputed subject of the frame.
Fidelity block: **STUDIO-STRICT**

> Premium advertising product photograph. The product fills a large share of the frame
> and stands on a seamless studio sweep whose tone and texture are chosen to suit the
> product's own colors, in front of a backdrop with a gentle gradient and plenty of open
> space around it. Lighting: one broad soft key from high front-left, a faint rim light
> to separate the edges from the background, and highlights that behave the way the
> product's real materials would. A single soft shadow anchors it to the floor. Camera at
> product height, tilted up very slightly for a heroic feel, with a medium telephoto lens
> so perspective stays compressed and the whole product is sharp. No props, set pieces or
> scenery beyond the sweep and backdrop, unless they are already in the photo.

## minimalist-white

Visible effect: a clean store image on a neutral background.
Fidelity block: **STUDIO**

> E-commerce catalog photograph of the product on a plain, light neutral background.
> Even, shadow-controlled lighting that shows true color, crisp outlines and a small
> natural shadow directly under the product so it does not float. Straight-on camera, the
> product centered with comfortable margins. Clarity and an honest depiction of the item
> come first; nothing else is in the frame.

## angles

Visible effect: several views of the product side by side in one frame.
Fidelity block: **STUDIO-STRICT**

> Product reference sheet: the same single product photographed from several camera
> positions and laid out side by side in one image, on one continuous studio floor in
> front of a softly graded backdrop. Include a straight front view, a three-quarter view
> and a side profile; add a view from directly above if it fits. Every view is at the
> same scale with equal gaps between them, lit by the same soft even studio light so they
> read with equal clarity, and each has its own soft shadow. No props, scenery, captions
> or view labels. Where the photo does not show a side, continue the visible design
> language plainly and leave that surface clean; never make up regulatory text, barcodes
> or claims for it. Design, branding and color stay consistent across all views.

## luxury

Visible effect: premium lighting with a soft glow.
Fidelity block: **STUDIO**

> Refined luxury product photograph. Low-key setting with deep, clean shadows, a soft
> luminous falloff of light around the product, delicate reflections on a polished
> surface beneath it, and rich rendering of every material. The glow comes from real,
> motivated light sources (a soft backlight, a gentle edge light), never from a haze laid
> over the product or a change to its colors.

## power-angle

Visible effect: a striking low-angle view.
Fidelity block: **STUDIO**

> Dramatic product photograph from a low camera position looking up at the product, so it
> towers and feels important. Real perspective with no stretching of proportions.
> Directional, controlled light from one side carves the form; the background stays
> simple and uncluttered so nothing competes with the product.

## pedestal-shot

Visible effect: the product at monumental scale.
Fidelity block: **STUDIO**

> Monumental product photograph. The product appears larger than life, like an
> architectural landmark, while its real geometry and branding stay exact. Sell the scale
> with a low horizon, atmospheric haze that adds depth into the distance, and sparse,
> restrained surroundings (a plinth or open plaza) that make it read as huge.

## symmetry

Visible effect: a perfectly symmetrical composition.
Fidelity block: **STUDIO**

> Strictly centered product photograph. The product sits exactly on the vertical center
> line; the set around it (floor, backdrop shapes, light falloff) mirrors precisely left
> to right with a calm, repeated spatial rhythm and exact alignment. Clean, even light.
> Only the surroundings are mirrored: the product itself stays physically true, and
> asymmetric label details are never flipped or duplicated to fake symmetry.

## signature-frame

Visible effect: a signature brand key visual.
Fidelity block: **STUDIO**

> Campaign key visual built around the product. A confident, graphic composition with a
> memorable color pairing taken from the packaging, generous negative space, and one
> bold staging idea (a sweeping color field, a strong shadow shape, a single sculptural
> plinth) that makes the image feel ownable and specific to this brand rather than
> generic.
