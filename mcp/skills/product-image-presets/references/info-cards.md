# Info card presets

Thirteen presets that explain the product with short on-image text, icons or diagrams:
`benefits`, `main-benefit`, `three-reasons`, `specs`, `whats-inside`, `care-guide`,
`how-it-works`, `quick-steps`, `usage-guide`, `product-match`, `myth-fact`,
`before-after`, `feature-zoom`.

Settings for all of them (see SKILL.md "Locked settings"):

```
modelSlug: "gpt-image-2.5-sunburst", quality: "high", aspectRatio: "3:4"
referenceImages: ["<photo URL>"]   or   products: [{ id, imageId? }]
```

Inputs: the product photo, plus the **content** each preset lists. Content comes only from
the fact sources in SKILL.md ("Facts for on-image text"): what the user said, catalog
fields, text legible on the product, and physically evident attributes. Write each slot
as a quoted string in the request's language. Keep every label short (two to five words).

Before you submit, check every quoted string: can you name its source? If not, delete it.

## Fidelity block

**INFO** (append after the scene paragraph, word for word)

> Treat the attached photo as the only source of truth for the product. If that photo was
> taken from above or at a tilt, do not copy its camera angle: stand the product upright
> and level in its normal orientation for this layout. Keep the product identical to the
> photo in outline, proportions, materials, surface finish, colors, closure, logo position
> and packaging construction, and keep the text printed on it exactly as printed. The only
> words allowed anywhere on the image are the quoted strings in this prompt and the text
> already printed on the product; spell them exactly, set them in clean, legible type, and
> keep them visually secondary to the product. Write no other words: no headlines,
> slogans, claims, numbers, prices, ingredients, certifications, endorsements, web
> addresses, social handles, phone numbers or QR codes. If a hand or person appears, keep
> grip, anatomy and scale natural. Use one coherent light source and physically correct
> contact shadows. No extra logos, watermarks or unrelated products.

## benefits

Visible effect: the product's key benefits.
Content: up to four benefit labels. From the user if given; otherwise claims printed on
the pack; otherwise visible-attribute noun phrases (form, finish, closure: "Matte glass
jar", "Wooden lid"). Use a verb-led label only for an action the closure visibly shows
("Twist cap" may become "Twist to open"); never a function, fit or use you cannot see.
Optional title: only a product name taken from the pack or catalog `title`.

> Clean informational layout. The product stands upright and dominant on a plain studio
> floor, with up to four short benefit labels arranged around it, each paired with a
> simple line icon: {labels}. {title_clause} No props or scenery apart from the icons and
> labels.

`{title_clause}` = `A small title reads "{title}".` when a title exists, otherwise empty.

## main-benefit

Visible effect: the single most important benefit.
Content: one benefit. From the user; otherwise the most prominent claim printed on the
pack; otherwise one visible-attribute noun phrase (form, finish, closure, texture:
"Hand-poured glass"), never a function or use you cannot see.

> Single-message marketing still. One strong visual metaphor dramatizes one benefit of
> the product: {benefit_visual}. One short line of text reads "{benefit}". The product
> is the clear focal point and the metaphor supports it without crowding it.

`{benefit_visual}` = a plain description of the metaphor you chose for that benefit (for
"Matte glass": "soft light grazing the matte surface of the product").

## three-reasons

Visible effect: three reasons to choose the product.
Content: exactly three reasons, same sources and fallback as `benefits`. When neither
the user nor the pack gave any claim, the reasons are visible features: say so in one
line on delivery (for example "No claims were given, so the three reasons are visible
features of the product.").

> Structured marketing layout: the product on one side, three short reasons stacked
> beside it, the first reason set noticeably larger than the other two, each with a
> simple icon: "{reason1}", "{reason2}", "{reason3}". Plain background, generous spacing,
> nothing else in the frame.

## specs

Visible effect: the product's key specifications.
Content: three to six spec lines. User-given specs verbatim (including numbers they
gave); otherwise only visible attributes: form, finish, closure, number of pieces,
packaging type. Never a number you did not receive or read on the pack.

> Precise specification card in a technical, catalog style. The product is shown large
> and clean on one side; thin leader lines connect it to short spec labels: {specs}.
> Neutral background, fine rules, a grid-aligned layout.

## whats-inside

Visible effect: the product's contents or ingredients.
Content: items that are visibly inside the pack or legibly listed on it, or listed by the
user. If none, use the package's own physical components (bottle, cap, pump, box).

> Organized breakdown still. The product stands at the center and the items it contains
> are laid out neatly around it in a clean grid, each with a small label: {items}. Only
> these items appear; nothing is added to fill space.

## care-guide

Visible effect: care instructions for the product.
Content: three or four care points. From the user or printed on the pack; otherwise
conservative handling that cannot damage anything ("Store dry", "Keep closed", "Handle
gently", "Keep clean").

> Clean care-guide layout. The product stands upright and dominant like a hero shot on a
> seamless studio floor; around it, three or four care points, each with a simple icon:
> {points}.

## how-it-works

Visible effect: how the product works.
Content: the steps or mechanism from the user, or ones evident from the product's visible
form (a pump is pressed, a cap is twisted). No hidden parts.

> Clear visual explanation of how the product is used or put together: {mechanism}. Use
> a short sequence, simple arrows, or a cutaway only where the mechanism is plain from
> the product's shape. Short step labels if any: {labels}.

## quick-steps

Visible effect: a short step-by-step guide.
Content: three steps. From the user or printed directions; otherwise the most obvious
safe use visible from the product's form.

> Three-step visual guide with numbered panels, the same product rendered consistently
> in each: 1 "{step1}", 2 "{step2}", 3 "{step3}". Simple, friendly layout.

## usage-guide

Visible effect: ways to use the product.
Content: two to four uses from the user; otherwise uses that are plain for the visible
category (where it is kept, how it is carried or displayed). Nothing medical, technical
or safety-related unless the user stated it.

> Organized usage guide: a few panels, each showing the product used or presented in one
> plausible way, with a short label: {uses}. Consistent product rendering across panels.

## product-match

Visible effect: a guide to choosing the right product.
Content: needs or contexts mapped to products. Only products the user supplied (several
photos or catalog items, each passed as its own `referenceImages` entry / `products` item). With a
single product, match it to two or three contexts from the user or plainly visible use.

> Simple selection guide that matches products to needs: {pairs}. Neutral labels, each
> need beside the product that suits it, a tidy chart-like layout. Show no product,
> color or size that was not supplied.

`{pairs}` = `"need" → product N` lines, N being the order of the references.

## myth-fact

Visible effect: a myth paired with the real fact.
Content: one myth and its correction. Required from the user or printed on the pack.
If neither exists, ask once: "Which myth should the card correct, and what is the fact?"

> Two-part card split down the middle. The left half is labeled "Myth" and reads
> "{myth}"; the right half is labeled "Fact" and reads "{fact}", with the product shown on
> the fact side. Clear contrast between the halves, minimal decoration.

Write the "Myth" and "Fact" labels in the request's language.

## before-after

Visible effect: the product as a solution to a specific problem.
Content: the problem, from the user if given; otherwise a simple environmental contrast
plain from the category (clutter vs. order, empty vs. stocked). Text is optional; if
used, only short "Before" / "After" labels in the request's language.

> Problem-and-solution marketing still in one frame. One side shows the problem as a
> simple environmental contrast: {problem}. The other side shows the same setting
> resolved, with the product as the clear reason. {labels_clause}

`{labels_clause}` = `Small labels read "{before}" and "{after}".` or empty.

## feature-zoom

Visible effect: a demonstration of the product's key feature.
Content: one feature visible in the photo (a nozzle, a clasp, a texture), or the one the
user names. Optional short label for it.

> Marketing still showing the whole product plus one magnified detail in a clean circular
> inset or cutaway, connected to the spot it comes from: {feature}. The detail keeps its
> real construction; no invented internal technology. {label_clause}

`{label_clause}` = `A short label reads "{label}".` or empty.
