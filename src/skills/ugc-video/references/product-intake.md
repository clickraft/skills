# Product intake — normalise the product once

Run this only when a product exists. A productless review is a valid mode: set the
product reference and description to null and skip every product rule downstream. Never
ask for a product just to fill this step.

Every input path ends in the same four values, decided here once and reused verbatim:

- **product reference** — one image URL<cli> (or local path) for `--reference-image`</cli><mcp> for `referenceImages`</mcp>;
- **product description** — the canonical staging text (below);
- **tier** — `luxury`, `premium` or `drugstore`, read from packaging and finish only,
  never from a looked-up price;
- **category** — skincare, cosmetics, fragrance, food, drink, supplements, fashion,
  footwear, jewellery, tech, home, fitness, car, tool…

## Paths

<cli>
**Photo attached (preferred).** Use the local path or URL as the reference. Open it with
Read and identify the category, the exact use mechanic, the opening mechanic and the key
visual details.

**Catalog product.** `clickraft product list --json --search "<name>"`. One match → use
</cli>
<mcp>
**Photo attached (preferred).** Use its uploaded URL as the reference (a file the user
has goes through `upload_widget({ accept: 'image' })` first). Look at the photo the user
shared in chat and identify the category, the exact use mechanic, the opening mechanic
and the key visual details; if you cannot see it, ask the user for them in the intake
question.

**Catalog product.** `product_list({ search: '<name>' })`. One match → use
</mcp>
it; several → ask which. The search often returns two products with the same title, so
titles alone cannot disambiguate: pick the one whose image matches what the user
showed, or show each candidate's primary image (or its image count and id suffix) and
<cli>
ask. Take the image marked `isPrimary` from `data.products[].images[].url` (else the
first) and pass it as a `--reference-image` so its `@ImageN` position is explicit — not
as `--product`, which the server always numbers after every `--reference-image`. Up to two more images of the same item may be kept
</cli>
<mcp>
ask. Take the image marked `isPrimary` from `items[].images[].url` (else the
first) and pass it in `referenceImages` so its `@ImageN` position is explicit — not
in `products`, which the server always numbers after every `referenceImages` URL. Up to two more images of the same item may be kept
</mcp>
when a later stage truly needs another side.

**Only a URL.** This skill cannot browse. Ask the user once for a product photo or the
catalog item. Never substitute a stock, generated or look-alike product.

## Use and opening mechanics

Describe exactly how the item is used — never default to "applies cream":

| Container | Mechanic |
|---|---|
| Spray / perfume | lift cap, press nozzle, mist on wrist or neck |
| Tube | uncap or flip, squeeze onto fingertip, apply |
| Pump bottle | press pump onto fingers or palm |
| Dropper | unscrew, lift pipette, squeeze bulb, drops on fingertips |
| Jar | twist lid off, scoop with fingertip |
| Stick / lipstick | pull cap, twist base, swipe |
| Wand (mascara, gloss) | unscrew, draw out, apply |
| Compact | open hinged lid, press brush or sponge |
| Capsule / gummy | take one, swallow or chew |
| Powder sachet / scoop | tip into liquid, stir |
| Garment / shoe | hold up, put on, adjust, smooth |
| Device | hold, present, point to a visible detail; no cable or compartment play |

The opening always happens on screen before anything comes out.

## The staging description

Write one paragraph and reuse it word for word in every board and clip prompt:

- shape, material, colour, finish;
- size relative to a hand plus centimetres ("palm-sized, about 11 cm tall") — never
  "the size of a…", which drifts;
- mechanism layout: which part is where, what moves, where the contents come out;
- missing features stated visually when they matter ("cordless, smooth body, no
  buttons, no screen") — otherwise the model adds them;
- label treatment (below);
- one honest imperfection (a faint fingerprint on the glass, a slightly creased label).

**Label.** With a real photo the label keeps its real text — the reference carries it;
never call it unreadable. With no photo at all, describe it as a small label turned
slightly away, too small to read. No other prop in the scene carries readable text or
numbers. If the photo shows a large wordmark, warn the user once that generated video
can garble lettering, and keep it angled away only if they agree.

**Claims.** Keep the description visual and mechanical. Only the user's
`approved_claims` may appear as claims, each verbatim. With none, no numbers, durations,
comparisons or results in speech or on screen.
