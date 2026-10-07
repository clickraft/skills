---
version: 0.8.0
name: product-image-presets
description: |
  One-shot product image presets with Clickraft. Each of 45 presets (hero shot,
  minimalist white, angles, in hand, flat lay, water splash, ice capsule, benefits,
  specs, reel cover and more) is a locked recipe: one product photo in, one finished
  still out, fixed model, settings and prompt. No plan, no confirmation.

  Use when: "/hero-shot", "/flatlay", any "/<preset>" from the catalog, "make a hero
  shot of my bottle", "white store photo", "show it from several angles", "put my
  product in ice", "a benefits card for this", "myth vs fact", "a reel cover for my
  product", "carousel opener", "unboxing shot".

  NOT for: custom product shoots from a written brief (use `product-photoshoot`), a
  catalog Recipe (use the recipe_* tools), an image with no product photo (use
  `generate-image`), product videos, thumbnails.

  Chain with: `generate-image` or `product-photoshoot` for follow-ups. A finished
  `resultUrl` is a valid `referenceImages` entry for the next call.
argument-hint: "/<preset> [product photo or catalog product name] [square|landscape|story] [count]"
---

# Product image presets with Clickraft

A preset is a **locked recipe**. The user names the effect ("/hero-shot", "make a water
splash of my serum"); you take their product photo, assemble that preset's master prompt,
and submit it with the preset's fixed settings. You do not plan, offer prompt variants,
browse models, or ask for confirmation. The product photo is the authoritative
reference: the output must show the same product with the same shape, colors, logo and
label text.

## Quick start

```text
generate_create({
  modelSlug: "gpt-image-2.5-sunburst", quality: "high", aspectRatio: "3:4",
  referenceImages: ["<product photo URL>"],
  prompt: "<assembled master prompt>",
  requestId: "<new id>", timeoutSeconds: 60
})
```

If the call returns the job still `queued`, `processing` or `uploading`, it is running, not
failed: call `generate_wait({ jobId, timeoutSeconds: 60 })` on the same jobId until it
finishes. Never call `generate_create` again for it.

Look at the result's preview image before replying. The image shows in the generation
widget; do not paste its URL. Reply with one line describing what the image shows.

## Locked settings (every preset)

| Setting | Field | Value |
|---|---|---|
| Model | `modelSlug` | `gpt-image-2.5-sunburst` |
| Quality | `quality` | `high` |
| Format | `aspectRatio` | `3:4` (portrait) unless the user overrides it |
| Product | `referenceImages` or `products` | the user's product photo, exactly one source |
| Size | none | the model sizes from the ratio (3:4 renders 1152x1536); there is no `resolution` for this model |

Do not change model or quality to make a request cheaper or faster. The only permitted
swap is the error fallback in "Error handling".

## UX rules

1. Be concise. No raw IDs, no JSON, no model names, no job IDs in chat. Say what the image
   shows; the widget shows the image itself, so do not paste the link unless asked.
2. Reply in the user's language. The `prompt` field is English, except the
   on-image strings, which stay verbatim in quotes.
3. Keep master prompts and production steps out of the chat. If asked what a preset
   does, describe only the visible effect (the catalog line).
4. One output unless the user asks for more.
5. Polling is silent. No status narration while waiting.
6. If a preset fails, report it in one line. Never quietly substitute another preset.

## Resolving the request to a preset

1. **Slash form** (`/hero-shot`, `/hero shot`, `/HeroShot`): normalize to lowercase,
   hyphenated, and match the catalog `id` exactly.
2. **Natural language**: match the visible effect to the catalog line. Examples:
   "make a hero shot of my bottle" → `hero-shot`; "clean white photo for my store" →
   `minimalist-white`; "from every side" → `angles`; "held in someone's hand" → `in-hand`;
   "splash" → `water-splash`; "frozen in ice" → `ice-capsule`; "cover for my Reel" →
   `reel-cover`; "first slide of a carousel" → `swipe-opener`; "why buy it, three
   points" → `three-reasons`.
3. **Two presets fit equally** (for example "premium look": `luxury` or
   `signature-frame`): pick the one whose catalog line is closer to the user's words. Ask
   only if they are truly tied, as one labeled-options question with the two names.
4. **Nothing fits**, or the user gives a detailed creative brief (custom scene, props,
   styling, several different shots): this is not a preset. Use `product-photoshoot`.

## Catalog

All presets output one 3:4 portrait still by default. Group = the reference file that
holds the preset's master prompt.

| id | Visible effect | Group |
|---|---|---|
| `hero-shot` | The product large and dominant, premium studio light | studio |
| `minimalist-white` | Clean store-ready image on a neutral background | studio |
| `angles` | Several views of the product side by side in one frame | studio |
| `luxury` | Premium low-key light with a soft glow | studio |
| `power-angle` | A striking low camera angle | studio |
| `pedestal-shot` | The product at monumental, architectural scale | studio |
| `symmetry` | A rigorously centered, mirrored composition | studio |
| `signature-frame` | A bold campaign key visual in the brand's colors | studio |
| `in-hand` | The product held in a hand | scenes |
| `kitchen-scene` | The product on a kitchen counter | scenes |
| `on-desk` | The product on a work desk | scenes |
| `gym-bag` | The product as part of a gym kit | scenes |
| `travel-pack` | The product in a travel setting | scenes |
| `weekend-carry` | The product among weekend essentials | scenes |
| `flatlay` | A neat overhead arrangement | scenes |
| `shelf-ready` | The product on a retail shelf | scenes |
| `retail-stack` | Several identical packs stacked for retail | scenes |
| `bundle` | Several units presented as a set | scenes |
| `unboxing` | An opened box revealing the product | scenes |
| `inside-pack` | A cutaway of how the product sits in its packaging | scenes |
| `color-pop` | Bold colored shapes bursting around the product | effects |
| `fabric-wave` | A wave of fabric flowing around the product | effects |
| `ice-capsule` | The product sealed in clear ice | effects |
| `powder-cloud` | A frozen cloud of colored powder | effects |
| `water-splash` | Water rising in a crown around the product | effects |
| `benefits` | Up to four key benefits with icons | info |
| `main-benefit` | The single most important benefit | info |
| `three-reasons` | Three reasons to choose the product | info |
| `specs` | A specification card | info |
| `whats-inside` | Contents or ingredients laid out | info |
| `care-guide` | Care instructions | info |
| `how-it-works` | How the product is used or assembled | info |
| `quick-steps` | A three-step guide | info |
| `usage-guide` | Several ways to use the product | info |
| `product-match` | A guide to which product suits which need | info |
| `myth-fact` | A myth paired with the real fact | info |
| `before-after` | The product as the answer to a problem | info |
| `feature-zoom` | The product plus a magnified key detail | info |
| `moodboard` | A branded moodboard around the product | social |
| `saveable-tip` | A useful tip card made to be saved | social |
| `share-card` | A visual made for sharing | social |
| `new-drop` | A new product announcement | social |
| `reel-cover` | A static cover image for a Reel | social |
| `swipe-opener` | The opening slide of a carousel | social |
| `vertical-hook` | A vertical visual with a strong hook | social |

Master prompts, per group:

- studio → [references/studio-and-hero.md](references/studio-and-hero.md)
- scenes → [references/scenes-and-lifestyle.md](references/scenes-and-lifestyle.md)
- effects → [references/effects.md](references/effects.md)
- info → [references/info-cards.md](references/info-cards.md)
- social → [references/social-cards.md](references/social-cards.md)

Open only the file for the selected preset.

## The product photo

Exactly one product source per call (the one exception is `product-match`, which takes
one reference per product the user supplies):

- **URL the user gave**: `referenceImages: ["<url>"]`.
- **A file the user attached or has on their device**: tools take URLs only. Call
  `upload_widget({ accept: 'image', maxFiles: 1, label: 'Product photo' })` as the only
  tool in that turn, then wait for the user's next message listing the uploaded URL and
  pass it as `referenceImages`. If no widget appears, ask for a public image URL. Use
  `upload({ contentBase64, filename })` only when you already hold the bytes; never ask
  the user for base64. If the photo was pasted into the chat, note its visible label text
  there (needed for info and social presets).
- **Catalog product** ("my parfum", a product name): `product_list({ search: "<name>" })`,
  use an item's `id` as `products: [{ id }]` (add `imageId` from its `images[]` to pin a
  specific photo, default the `isPrimary` one). One
  match → use it. Several → if one's primary image matches the photo the user showed,
  use it; otherwise ask which. Search often returns two products with the same title, so
  a title list cannot settle it: show each candidate's primary image (or its image count
  and the last characters of its id) and ask.
- **An image from earlier in this conversation** (a previous `resultUrl` or a file
  the user pointed at): reuse it, do not ask again.
- **No photo at all**: ask for one (an upload, a URL, or a catalog product name). This is the
  only required input; nothing else is asked for image-only presets.

## Format and count overrides

Explicit user requests override the 3:4 default:

| User says | `aspectRatio` |
|---|---|
| square, Instagram post | `1:1` |
| landscape, wide, banner | `16:9` |
| Reel, Story, full-screen vertical, TikTok | `9:16` |
| an explicit ratio | that ratio if it is one of 1:1 2:3 3:2 3:4 4:3 4:5 5:4 9:16 16:9 21:9; otherwise the nearest one, and say which |

`reel-cover`, `vertical-hook` and `swipe-opener` keep 3:4 unless the user asks; a 9:16
request for them is common, so honor it. The master prompt's layout words ("portrait",
"vertical") must follow the final ratio: replace them when the format changes.

Count: "3 hero shots" means one `generate_batch({ requests: [...], requestId })` holding
three requests with the same fields and prompt, each its own job (2 to 8 requests per
batch; more than 8 means several batches). They share one widget. Then
`generate_wait_batch({ jobIds, timeoutSeconds: 60 })` until `allTerminal`. A job still
running when a wait returns is not failed: wait on the same jobId again, never resubmit. A
batch item with `jobId: null` failed to submit; report it in one line.

## Facts for on-image text (info and social presets)

Presets in the info and social groups put words on the image. Every word must trace to one
of these sources, in this order:

1. **What the user said** in this conversation (benefits, specs, a tip, a myth and its
   fact). Use it verbatim; shorten only by cutting words, never by rewording into a
   stronger claim.
2. **Catalog fields** of a catalog product: `title`, `vendor`, `productType`, `tags`.
3. **Text legible on the product photo** (as you saw it in the chat; a photo you hold only as a URL gives you no text, so use the other sources).
4. **Physically evident attributes** you can see: form, finish, closure, size class,
   number of pieces, packaging type ("Pump bottle", "Matte glass", "Twist cap").

Never write anything else: no invented claims, numbers, ingredients, certifications,
health or performance promises, comparisons, prices, slogans, URLs, handles, phone
numbers or QR codes. Each preset's "Content" line in its reference file says which slots
it fills and what to do when a slot has no source. Most fall back to source 4 and run
without asking. A few (`myth-fact`, `saveable-tip`) cannot be made truthfully from source
4; for those, ask one short question for the missing fact, then run.

On-image copy is written in the language of the user's request unless they name another.
Put each string in double quotes inside the prompt, exactly as it must appear.

## Assembling the prompt

Each reference file gives, per preset, a **scene paragraph** and names a **fidelity block**
defined at the top of that file. The prompt you send is:

```
<scene paragraph, with any {slots} filled>
<the named fidelity block>
```

Both parts are printed as `>` quotes in the reference files: send the text without the
`>` markers, as one prompt. Send it unchanged otherwise. Do not add styling ideas of your
own; the recipe is locked.
The only edits allowed are filling `{slots}`, and adjusting layout words to an overridden
aspect ratio.

## Invocation

Image jobs on this model often take longer than one call holds, so submit and then wait:

```text
generate_create({
  modelSlug: "gpt-image-2.5-sunburst", quality: "high", aspectRatio: "3:4",
  products: [{ id: "<product id>" }], prompt: "<assembled prompt>",
  requestId: "<new id>", timeoutSeconds: 60
})
generate_wait({ jobId: "<jobId>", timeoutSeconds: 60 })   // repeat until it finishes
```

When a call returns the job still `queued`, `processing` or `uploading`, it is still
running: call `generate_wait` again on the same jobId, never re-create it. If a call fails
in transport, retry it with the same `requestId` (no double charge). Jobs can sit in `queued`
for several minutes before they start, and an account's jobs may run one after another,
so several waits in a row that return it still running are normal. Budget about 2 minutes
per image. When it completes, look at its preview image and check it: same product, label
intact, no stray words, preset effect visible. The preview is small: judge the label only
as far as it is legible there, and never claim small print is verified. If the label is
garbled or the product changed shape, regenerate once with the same fields and a new
`requestId`, and say so in one line; do not change the recipe. Then present only the kept
image with `generate_show({ jobIds: ["<kept jobId>"] })`.

## When to ask

Only in these cases, one question at a time:

- No product photo is available.
- A catalog search returns several products and none matches a photo the user showed.
- Two presets fit equally (labeled options with both names).
- `myth-fact` or `saveable-tip` with no user-given or printed fact.

Never ask about format, quality, style, props or wording.

## Cost handling

One image at 3:4 high quality costs about 98 credits; square about 106, 16:9 or 9:16
about 85. Do not pre-estimate a single image. For more than 3 images in one request, run
`generate_estimate` with the same fields once, multiply by the count, and
state the total before submitting. Do not ask, inform. If the user asks the price, run
the estimate and quote `creditCost`. Prices can change; the estimate is the truth.

## Error handling

Errors arrive in the tool's error text as `Error [CODE] (HTTP n)`.

| Code | What to do |
|---|---|
| `AUTH_TOKEN_MISSING` / `AUTH_TOKEN_EXPIRED` | Tell the user to reconnect the Clickraft connector. Do not retry. |
| `INSUFFICIENT_CREDITS` | Tell the user they are out of credits and give the pricing link from the error. Do not retry, do not downgrade. |
| A wait returns the job still running | Not an error: the job keeps running. Call `generate_wait` on the same jobId again; never re-create the job. |
| `RATE_LIMITED` | Wait a moment and retry once with the same `requestId`. |
| `MODEL_NOT_FOUND` | Call `models_list({ category: "image" })`. If `gpt-image-2.5-sunburst` is gone, use `gpt-image-2.5-flare` with the same fields (the only allowed swap). If neither exists, report it. |
| `GEN_CONTENT_REFUSAL` | Tell the user the image was refused and ask them to try another photo or preset. |
| `INPUT_INVALID_FORMAT` on `aspectRatio` or `quality` | The model's options changed: read them from `models_list({ slug: "gpt-image-2.5-sunburst" })` and use the closest value. |
