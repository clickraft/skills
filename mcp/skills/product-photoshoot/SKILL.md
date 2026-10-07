---
version: 0.8.0
name: product-photoshoot
description: |
  Finished product photography with Clickraft: packshots, lifestyle scenes,
  hand/face close-ups, Pinterest pins, hero banners, carousels, static ad packs,
  on-model try-ons, conceptual CGI-style stills and restyles. Ten modes, structured
  photographic prompts, one product identity across the set, refines seen defects.

  Use when: "product photoshoot", "packshot", "Shopify product photos", "catalog
  shots", "lifestyle photo of my product", "hero banner", "launch carousel", "ad
  creatives for this product", "put it on a model", "floating / splash product
  shot", "restyle this product photo for Christmas".

  NOT for: one quick image (use `generate-image`), video ads, thumbnails, Amazon
  compliance listing sets, generic portraits, a reusable catalog Recipe (use
  the recipe_* tools), character sheets (use `character-sheet`).

  Chain with: `generate-image` for one-off follow-ups. A finished result URL is a valid
  `referenceImages` entry or `startFrame` for the next call.
---

# Product photoshoot with Clickraft

Deliver polished, final product stills. In every mode the product is the hero. The flow:
pick one mode, load its reference, write one structured prompt per image, generate them
as indexed jobs, look at the results, refine only what is actually wrong, deliver.

## Quick start

```
product_list({ search: "<product name>" })                 → the product id
generate_batch({ requestId: "<unique set id>", requests: [
  { modelSlug: "nano-banana-pro", resolution: "2K", aspectRatio: "1:1",
    products: [{ id: "<product id>" }], prompt: "<assembled prompt, index 0>" },
  …one request per index, in index order… ] })
generate_wait_batch({ jobIds: ["<jobId 0>", "<jobId 1>", …], timeoutSeconds: 60 })
generate_get({ id: "<jobId>" })                            → that image's preview
```

Look at each finished image's preview before you reply.

## Modes

| Mode | Deliverable | Reference |
|---|---|---|
| `product-shot` | Studio or styled packshot, catalog, Shopify | [references/product-shot.md](references/product-shot.md) |
| `lifestyle-scene` | Product in a real setting or in use | [references/lifestyle-scene.md](references/lifestyle-scene.md) |
| `closeup-product-with-person` | Tight product crop with hands, lips, cheek or eye | [references/closeup-product-with-person.md](references/closeup-product-with-person.md) |
| `pinterest-pin` | Vertical Pinterest-native still | [references/pinterest-pin.md](references/pinterest-pin.md) |
| `hero-banner` | Wide web, email or campaign header | [references/hero-banner.md](references/hero-banner.md) |
| `social-carousel` | 3–10 connected slides | [references/social-carousel.md](references/social-carousel.md) |
| `ad-creative-pack` | Coordinated static paid-social variants | [references/ad-creative-pack.md](references/ad-creative-pack.md) |
| `virtual-model-tryout` | Product worn or used by a generated adult model | [references/virtual-model-tryout.md](references/virtual-model-tryout.md) |
| `conceptual-product` | Levitating, splash, sculptural, CGI-look still | [references/conceptual-product.md](references/conceptual-product.md) |
| `restyle` | New aesthetic or season on an existing image, same subject | [references/restyle.md](references/restyle.md) |

**Routing.** Choose by deliverable, not by setting. The destination format wins over the
environment: a pin beats a lifestyle scene, a banner beats a lifestyle scene, a carousel
beats a single scene, and a hands/face close-up beats a generic lifestyle shot. Use
`restyle` only when subject and composition should stay essentially the same.

Stay in scope. Amazon main images and listing infographics need compliance rules this
skill does not carry; moving product ads are video; video covers are thumbnails;
creator-led reviews or unboxings are UGC video. Say so and stop.

**Load, in this order:** the selected mode file (only that one — never all ten), then
[references/typography.md](references/typography.md),
[references/photography-vocabulary.md](references/photography-vocabulary.md),
[references/style-descriptors.md](references/style-descriptors.md),
[references/negative-prompts.md](references/negative-prompts.md) and
[references/refinement-pass.md](references/refinement-pass.md).

## UX rules

1. Be concise. No raw IDs, job IDs, model names or JSON in chat. No result URLs either: the widget shows the images.
2. Reply in the user's language. Prompts sent to Clickraft are English, except exact
   on-image text, which stays verbatim in its original language.
3. Polling is silent. No status narration between waits.
4. Never expose craft internals: no style-descriptor keys, mode codenames, preset
   codenames in prompts, no prompt sections, no negative lists. The user sees images
   and one sentence.

## Intake

Read the whole brief first and extract: the product (catalog item, image, or
description), mode, count, visual direction, aspect ratio or destination, exact
on-image text, brand palette, and whether the user wants zero questions.

### Silent defaults (full auto)

If the user says "full auto", "no questions", "just do it", "go ahead", "auto approve"
or similar, and a product is available (catalog item, image, or a usable description),
ask nothing. Resolve:

- 3 variants;
- `clean-studio` preset for an otherwise unspecified product shot — every variant uses
  that same default preset and they differ only by camera angle, product arrangement
  and light direction, never by switching preset;
- `1:1` when the use case implies no other ratio (mode defaults apply otherwise);
- palette taken from the product itself or from colors already stated, else neutral;
- craft language from the matching entries in `style-descriptors.md`.

State the resolved plan as one statement ("Three 1:1 clean-studio packshots of the
amber serum bottle — generating now."), never as a question, then proceed. Full auto
also skips the outline confirmation in carousel and ad-pack modes.

### Questions

Ask only when a gap the user owns blocks a useful result. Put up to three short
questions in ONE message; never spread one intake over several turns. Priority:

1. product — no catalog item, no image, and no usable description;
2. style — cannot be inferred from the brief, product or destination;
3. count — only when it changes the deliverable materially;
4. aspect ratio — only when the named destination is genuinely ambiguous;
5. triage — the user rejected a result without naming what is wrong.

Fill omitted count with 3, omitted ratio with the mode default, omitted palette with
product-derived or neutral — do not ask just to show those defaults. Every choice
question allows a free-text answer.

**Never ask** about model, resolution, prompt structure, negatives, refinement, lens,
f-stop, Kelvin, lighting terms, style references or internal brand context. Those are
locked craft decisions.

## Product input

Resolve the product once and reuse the same handle for every first pass in the set.

- **Catalog product** — `product_list({ search: "<name>" })`; read
  `items[].id` and `.title`. One match → use it. Several → titles alone often
  cannot tell them apart (the catalog regularly holds two products with the same
  title): show each candidate's primary image (or its image count and the last few
  characters of its id) and ask, or pick the one whose image matches what the user
  showed. Pass `products: [{ id }]` (add `imageId` to pin one photo).
- **Image** — an http(s) URL the user gave goes straight into `referenceImages: [url]`.
  For a photo the user attached or has on their device, call
  `upload_widget({ accept: 'image', maxFiles: 1, label: 'Product photo' })` as the only
  tool in that turn, then wait for the user's next message with the uploaded URL. Use
  `upload({ contentBase64, filename })` only when you already hold the bytes; never ask
  the user for base64.
- **Text only** — allowed when category, form, packaging, material, color, label
  treatment and distinctive features are described well enough to draw consistently.
- `restyle`, `virtual-model-tryout` and `closeup-product-with-person` need a real product
  image or catalog item. Never invent one; ask for it.

Use brand and product facts already in the conversation. Do not invent claims,
materials, prices, brand colors, label copy or features.

## Model selection

Locked: **`nano-banana-pro` at `resolution: "2K"`**, one image per request. Do not substitute
another model and do not drop the product reference to make a call fit.

Before the first submission of a session, verify the constraints once:
`models_list({ slug: "nano-banana-pro" })`, then check its constraints: the resolutions
include `2K`, the aspect ratios include the one you need, and reference inputs accept
images. If 2K or image references are missing, stop and tell the user; do not switch
model.

Supported ratios: `1:1 2:3 3:2 3:4 4:3 4:5 5:4 9:16 16:9 21:9`. A mode table that asks for
something else (3:1, 2:1, 4:1, long pin) maps to the nearest supported ratio as the mode
file says, and you tell the user in the delivery line.

## Prompt contract

- Assemble every prompt from the mode file's named-section template, filling each
  section with concrete language from `photography-vocabulary.md`.
- `[STYLE REFERENCE]` carries descriptors only, pulled from 2–3 compatible entries in
  `style-descriptors.md`. Before each submission, check the prompt contains no person,
  studio, publication, retailer or competitor name, and no internal mode/preset/key
  codename. The user's own brand name may appear only as literal text on the product.
- Apply the typography three-case rule. Never ask for empty "space for text" unless the
  user explicitly said they will overlay text later.
- End with one `[AVOID]` block assembled per `negative-prompts.md`.
- End every prompt with the line `Render at 2K resolution.` and pass `resolution: "2K"`.
- Make each variant materially different (composition, preset, hook or scene). Distinct
  prompts are separate requests; never rely on one request returning several images.
- When the product is a set (teapot with cups, a duo, a kit), state the exact piece
  count and arrangement in the product section ("exactly four identical cups") and
  name its small structural parts as they appear in the reference (strainer, gasket,
  handle joins, caps), with their material.
- Describe light by its effect, never by its equipment — named gear (softbox, strobe,
  reflector) tends to appear in the frame.

## One product identity across a set

- **Catalog product or supplied image:** attach that same `products` or
  `referenceImages` to every first-pass request.
- **Text-only product, more than one image:** generate index 0 alone first, wait for it,
  inspect it. Then pass its `resultUrl` as the only `referenceImages` entry on every remaining
  first pass, and describe it as "the same product as the reference image". Do not make a
  separate reference image. Vary only scene, light and camera across the set.
- A new, unrelated product starts its own set; never borrow another product's reference.

## Invocation

Keep a ledger, per stable index: prompt, ratio, jobId, status, attempts (max 3). Indexes
stay fixed from first pass through refinement to delivery, so the user can say "redo 3".

Submit the whole first pass in ONE `generate_batch` call — one request per index, in
index order, so each returned `jobs[].index` is the ledger index:

```
generate_batch({
  requestId: "<unique id for this set's first pass>",
  requests: [
    { modelSlug: "nano-banana-pro", resolution: "2K", aspectRatio: "<ratio>",
      products: [{ id: "<product id>" }], prompt: "<assembled prompt, index 0>" },
    { …index 1… },
    { …index 2… }
  ]
})
```

- Swap `products` for `referenceImages: ["<url>"]`, or omit both for a text-only index 0.
- `generate_batch` takes 2–8 requests. A single image, or a text-only index 0 (which goes
  alone first), uses `generate_create` with the same fields, its own `requestId` and
  `wait: false`; a lone remaining index does too. More than 8 indexes (a 9–10 slide
  carousel) → a second batch for the rest; its `jobs[].index` starts again at 0, so add
  the offset when you write the ledger.
- Read each `jobs[].jobId` into the ledger. An item with `jobId: null` was not
  submitted: it counts as an attempt for that index; resubmit only that index with
  `generate_create` and a new `requestId`.
- If the call itself fails in transport, repeat the identical call with the SAME
  `requestId` — the server returns the original jobs and charges nothing extra. A new
  `requestId` is a new, separately charged set.

Then wait for the pending jobs together:

```
generate_wait_batch({ jobIds: ["<jobId 0>", "<jobId 1>", "<jobId 2>"], timeoutSeconds: 60 })
```

- The images appear in the generation widget and update live; do not narrate progress
  or paste URLs. `generate_wait_batch` returns states only, no previews — look at each
  completed index with `generate_get({ id: "<jobId>" })`, which carries a small preview
  (a single job can instead be waited on with `generate_wait`, which also does).
- Jobs can sit queued for several minutes, and one account's jobs may run one after
  another rather than in parallel. Budget about 2 minutes per image (a set of 3 ≈ 6
  minutes), and expect several waits in a row to return with `allTerminal: false` —
  that is normal.
- A job that comes back still `queued`, `processing` or `uploading` is not a failure:
  call `generate_wait_batch` again with only the unfinished jobIds. Never resubmit a
  slow job. After about 12 waits for one set, stop and tell the user which images are
  still pending; they keep updating in the widget, and you resume those jobIds on the
  user's next turn.
- Freeze completed indexes. Retry only a failed index, once, and count it as an attempt.
  Never retry the whole set. Do not retry safety, auth, quota or billing errors.

## Visual QA and refinement

Look at each completed index's preview image (from `generate_get`). Judge only what you can see: product shape,
markings, colors, materials, piece count, small structural details (strainer, gasket,
handle joins, caps) against the reference, stray studio equipment in frame,
composition, requested text, and the mode's quality gates. A URL, status or prompt is not evidence. Do not claim tiny text is verified from
a downscaled view. If you cannot view an image, say it was not visually checked and do
not spend credits refining a defect you have not seen.

Run [references/refinement-pass.md](references/refinement-pass.md) when you see a
quality-gate failure, or when the user names a specific correction (that one may be
applied without viewing). Each refinement:

- uses the latest completed result of the SAME index as its single `referenceImages` entry
  — never another variant, never an older superseded attempt;
- keeps the same ratio and `resolution: "2K"`;
- fixes one thing and preserves subject, product, composition and everything passing.

Budget: 3 submissions per index in total (first pass + up to 2 refinements, failures
and retries included). Rewriting the prompt does not reset it. When it is spent, deliver
the best completed version and name the remaining issue. For carousels and ad packs,
check set coherence first and refine only the indexes that break it.

If the user asks to "make it better" and you cannot see the image, ask what to change
instead of inventing a defect.

## Delivery

Once every final index is terminal, give the final images only — one per index, in index
order — with ONE `generate_show({ jobIds: ["<final jobId of index 0>", …] })` call, in index order, so the widget shows the finished set; do not paste URLs. Leave out first passes and superseded attempts.
Add one compact sentence: mode, look, ratio, and any correction applied or ratio mapped.
Say plainly if anything was not visually checked, and report any index that failed or is
still pending; never call an incomplete set complete. Hide model names, job IDs, style
keys and pipeline mechanics.

On a vague rejection, ask one triage question. On a specific one, change only the named
defect through a refinement on that index.

## Cost handling

`nano-banana-pro` at 2K is about 400 credits per image; refinements cost the same.

- Up to 3 images: submit without estimating.
- More than 3 images (carousels, ad packs, larger sets) or any 4K request: run
  `generate_estimate` with the same fields as one request, multiply by
  the number of images, and state the total before submitting ("This set of 6 will use
  about 2,400 credits."). Inform, don't ask. Read `creditCost`; if
  `affordable` is false, report `blockedReason` and stop.
- Never downgrade model or resolution to save credits.

## Error handling

Errors arrive as text of the form `Error [CODE] (HTTP n)`.

| Code | What to do |
|---|---|
| `AUTH_TOKEN_MISSING` / `AUTH_TOKEN_EXPIRED` | Tell the user to reconnect the Clickraft connector. Do not retry. |
| `INSUFFICIENT_CREDITS` | Stop the set. Say which indexes finished and how many credits the rest need; give the pricing link from the error. Do not retry. |
| A wait returns the job still running | Not a failure — the job keeps running. Wait again on the same jobId; never re-create the job. |
| `RATE_LIMITED` | Pause briefly and retry that one call once, with the same `requestId`. |
| `MODEL_NOT_FOUND` | Re-check `models_list({ slug: "nano-banana-pro" })`. If it is gone, stop and tell the user; do not switch model. |
| `REFERENCE_LIMIT_EXCEEDED` | Too many references on one request. Keep the product (or its single reference image) and drop anything else. |
| `GEN_CONTENT_REFUSAL` | That index was refused for safety. Do not retry it as-is; tell the user and suggest a rephrased direction. |

A technical failure on one index counts toward that index's three attempts.
