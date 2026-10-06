# Social card presets

Seven presets designed for feeds, Reels and carousels:
`moodboard`, `saveable-tip`, `share-card`, `new-drop`, `reel-cover`, `swipe-opener`,
`vertical-hook`.

<cli>Flags</cli><mcp>Settings</mcp> for all of them (see SKILL.md "Locked settings"):

```
<cli>
--model-slug gpt-image-2.5-sunburst --quality high --aspect-ratio 3:4
--reference-image <photo>   or   --product <uuid>[:imageId]
</cli>
<mcp>
modelSlug: "gpt-image-2.5-sunburst", quality: "high", aspectRatio: "3:4"
referenceImages: ["<photo URL>"]   or   products: [{ id, imageId? }]
</mcp>
```

`reel-cover`, `vertical-hook` and `swipe-opener` are often wanted at `9:16`: use it when
the user says Reel, Story or full screen, and change "portrait" to "full-screen vertical"
in the scene paragraph.

Inputs: the product photo, plus the optional content each preset lists, sourced only as
described in SKILL.md ("Facts for on-image text"). Every preset here works with no text
at all; a missing slot means leaving the text out, not inventing it (except
`saveable-tip`, which needs a tip).

## Fidelity block

**SOCIAL** (append after the scene paragraph, word for word)

> Treat the attached photo as the only source of truth for the product. If that photo was
> taken from above or at a tilt, do not copy its camera angle: stand the product upright
> and level in its normal orientation for this layout. Keep the product identical to the
> photo in outline, proportions, materials, surface finish, colors, closure, logo position
> and packaging construction, and keep the text printed on it exactly as printed. The only
> words allowed anywhere on the image are the quoted strings in this prompt and the text
> already printed on the product; spell them exactly, keep them short and legible at
> phone size, and keep them visually secondary to the product. Write no other words: no
> slogans, taglines, claims, numbers, prices, endorsements, web addresses, social
> handles, phone numbers or QR codes. No extra logos, watermarks or unrelated products.

## moodboard

Visible effect: a branded moodboard built around the product.
Content: optional swatch captions, naming only materials, colors and textures you can see
("Matte black", "Brushed gold", "Frosted glass").

> Curated editorial moodboard on a portrait board. The whole product sits at the center,
> surrounded on a tidy grid by material swatches, color chips, small contextual fragments
> and close-up crops of its own surfaces, all drawn from the product's palette and
> finishes. {captions_clause}

`{captions_clause}` = `Small swatch captions read {captions}.` or empty.

## saveable-tip

Visible effect: a useful tip card designed to be saved.
Content: one actionable tip. From the user, or from directions printed on the pack. If
neither exists, ask once: "What tip should the card share?" Never health, financial or
performance advice the user did not supply.

> Social tip card on a clean portrait layout: one concise, actionable tip set as the main
> text, "{tip}", with the product integrated beside it as a supporting visual. Calm
> background, clear hierarchy, room to breathe.

## share-card

Visible effect: a visual designed for sharing.
Content: optional short wording from the user or the pack (often just the product name).

> Highly shareable branded image built on one clear visual idea, with the product as the
> source of the color scheme and visual identity, and wide margins of empty space so
> repost frames and stickers do not cover anything important. {text_clause}

`{text_clause}` = `A short line reads "{text}".` or empty.

## new-drop

Visible effect: a new product announcement.
Content: the product name only, and only if it is legible on the pack or in the catalog
`title`. The user may supply a launch line ("Out now", a date); use it verbatim.

> Energetic new-release visual. The product arrives in a fresh, contemporary scene built
> from its packaging colors, with crisp contrast and a strong sense of arrival (a light
> burst behind it, a dynamic diagonal, a stage-like reveal). {name_clause}

`{name_clause}` = `The product name "{name}" appears once{launch_line}.` or empty, where
`{launch_line}` = ` with the line "{line}"` or empty.

## reel-cover

Visible effect: a static cover image for a Reel.
Content: optional short hook from the user (up to five words). Without one, no text.

> Bold static cover for a short vertical video, built to stay readable as a small
> thumbnail in a grid. A strong, centered crop of the product, high contrast, and clear
> empty bands at the top and bottom for app interface elements. {hook_clause}

`{hook_clause}` = `A short hook reads "{hook}".` or empty.

## swipe-opener

Visible effect: the opening slide of a carousel.
Content: optional short title from the user. Without one, leave the title space empty.

> Opening slide of a swipeable carousel. A product-led hook image that makes sense on its
> own, a clear visual flow pulling the eye toward the right edge (the product or a shape
> breaking out of frame on the right), and a clean area reserved for a short title.
> {title_clause}

`{title_clause}` = `The title reads "{title}".` or empty.

## vertical-hook

Visible effect: a vertical visual with a strong hook.
Content: optional short hook from the user. Without one, no text.

> Vertical-first attention grabber. An unusual, striking crop of the product with
> immediate contrast, so the product is recognizable in the first glance. The top and
> bottom zones stay clear of anything important for app interface overlays. {hook_clause}

`{hook_clause}` = `A short hook reads "{hook}".` or empty.
