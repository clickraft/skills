# Effect presets

Five conceptual presets that wrap the product in a frozen physical effect:
`color-pop`, `fabric-wave`, `ice-capsule`, `powder-cloud`, `water-splash`.

Settings for all of them (see SKILL.md "Locked settings"):

```
modelSlug: "gpt-image-2.5-sunburst", quality: "high", aspectRatio: "3:4"
referenceImages: ["<photo URL>"]   or   products: [{ id, imageId? }]
```

Inputs: the product photo only. No on-image text. The effect colors come from the
product's own packaging palette unless the preset says otherwise.

## Fidelity block

**EFFECT** (append after the scene paragraph, word for word)

> Treat the attached photo as the only source of truth for the product. If that photo was
> taken from above or at a tilt, do not copy its camera angle: stand the product upright
> and level in its normal orientation for this shot. Keep the product identical to the
> photo in outline, proportions, materials, surface finish, colors, closure, logo position
> and packaging construction, and keep its printed label text exactly as printed. The
> effect must obey the same physics as the product: one perspective, one lighting setup,
> matching reflections and contact shadows. The effect never bends, melts or reshapes the
> product, never creates an accidental second copy of it, and never covers the logo or
> the front label. Add no claims, no unrelated logos and no watermarks.

## color-pop

Visible effect: bold colorful shapes surrounding the product.
Fidelity block: **EFFECT**

> Conceptual high-end product still. A controlled explosion of bold color forms bursts
> around the product: layered cut paper, sculpted shapes and pigment, in colors drawn
> from the packaging, arranged in clear depth from foreground to background. The product
> stands perfectly straight and level, never leaning; the shapes swirl around and behind
> it but never sit under its base or lift it off the ground. Every important product
> detail stays in clear view.

## fabric-wave

Visible effect: fabric flowing around the product.
Fidelity block: **EFFECT**

> Conceptual high-end product still. A wave of luxurious fabric (satin or silk) sweeps
> around the product in mid-motion, with believable folds, tension and drape. The cloth's
> color and sheen complement the packaging. The fabric passes behind and beside the
> product and never crosses in front of the branding.

## ice-capsule

Visible effect: the product encased in transparent ice.
Fidelity block: **EFFECT**

> Conceptual high-end product still. The product is sealed inside a clear, sculpted block
> of ice with realistic frost on the edges, trapped air bubbles, fine internal cracks and
> beads of condensation on the surface. The ice is clear enough at the front that the
> product and its label read sharply through it, with correct refraction. Cool studio
> light.

## powder-cloud

Visible effect: a cloud of colored powder.
Fidelity block: **EFFECT**

> Conceptual high-speed studio still. A cloud of fine colored powder is frozen in mid-air
> around the product, its pigments taken from the packaging colors, with realistic
> particle density that thins out toward the edges. The powder billows around the sides
> and back; the front label stays clean and readable.

## water-splash

Visible effect: water forming a crown around the product.
Fidelity block: **EFFECT**

> Conceptual high-speed studio still. Clear water rises around the base of the product
> and freezes in an elegant crown-shaped splash, with droplets suspended in the air and
> crisp highlights on the liquid. The fluid is physically believable; it neither distorts
> the product's shape nor hides its label.
