---
version: 0.8.1
name: generate-image
description: |
  Generate a single image with Clickraft. Calls `generate_create` with an
  AI model slug (e.g. nano-banana-2) and a text prompt, checks the result's preview
  and shows it in the generation widget.

  Use when: "generate an image", "create an image", "render an image", "make an
  image", "make a picture", "produce a hero image", "generate a product photo",
  "render with my brand model", "image from this prompt", "make me a graphic".

  NOT for: a finished product photoshoot or set (use `product-photoshoot`), a named
  product look like "hero shot" or "flatlay" (use `product-image-presets`), video
  (use `product-video-presets`, `ugc-video` or `ad-multiplier`), thumbnails (use
  `thumbnail-generation`), character sheets (use `character-sheet`).

  Chain with: any skill above. A finished result URL is a valid
  `referenceImages` entry or `startFrame` for the next call.
---

# Generate an image with Clickraft

## Quick start

```
generate_create({ modelSlug: "nano-banana-2", aspectRatio: "1:1",
  prompt: "<user's prompt in English>", requestId: "<unique id>" })
```

`generate_create` waits up to `timeoutSeconds` (default 25) and returns the job. If it is
still `queued` or `processing`, call `generate_wait({ jobId, timeoutSeconds: 60 })`. When
that time runs out it returns the job still running, which is not an error: call
`generate_wait` again with the same `jobId`. A job can sit in the queue for several
minutes before it starts. Never create the job a second time.

A finished image comes with a small preview. **Look at it before you reply** — check it
matches the request (subject, text, composition). The preview is small, so never claim
fine detail such as small text is verified from it. The result renders in the generation
widget and updates live: don't paste its URL or re-display it unless the user asks.

## UX rules

1. Be concise. No raw IDs, no JSON dumps. The widget shows the image; add a
   one-line summary of what you see in the image.
2. Detect the user's language and reply in it. The prompt sent to `generate_create`
   stays English whatever the user's language: translate the intent
   (style, composition, scene, mood, lighting) to English before submitting. Text that
   must appear in the image stays verbatim. Field values such as slugs and ratios stay English.
3. Don't batch-ask. Pick the default for the user's modality and submit. Ask one thing only if a required field is genuinely missing.
4. Don't pre-estimate cost or downgrade models silently — see "Cost handling".
5. Polling is silent: `generate_wait` calls run with no status narration.

## When to ask

Default: act with sensible defaults.

Ask one labeled-options question ONLY when:

- Modality is ambiguous (image vs video vs audio).
- Family resolves to ≥3 slugs with materially different quality/cost — surface the top 2.
- A required input is genuinely missing (no prompt, no reference image on "edit this").

Never ask about aspect ratio, resolution, or duration — default and submit. The user re-runs with overrides if needed.

## Model selection

Static catalog. Pick by intent. Pass the chosen slug as `modelSlug` to
`generate_create`.

- **`nano-banana-2`**: the default (`isDefault` in `models_list`). Use it for ordinary
  generation, photoreal scenes, a trained identity (`brandModels`) and characters kept
  consistent across images. It takes up to 10 asset and 4 character references, and it
  is the only one with extreme ratios (1:4, 1:8, 4:1, 8:1). Default resolution is 1K
  (134 credits); pass `resolution: "2K"` only when the user wants a larger file.
- **`gpt-image-2.5-sunburst`** with `quality: "high"`: for precise edits of a supplied
  image, and compositions where a reference must be kept faithful (up to 8
  `referenceImages`). It is cheaper (about 106 credits), but in a side-by-side test its
  photoreal scenes looked flatter than `nano-banana-2`. It takes no `resolution`: the
  size comes from the ratio (16:9 → 2048×1152).
- **`nano-banana-pro`** at `resolution: "2K"`: for finished commercial product images
  where label and material fidelity matter, or when the user asks for "best",
  "professional" or "Pro". It costs about 3× the default, so don't pick it for a draft.
  For a full product set, use the `product-photoshoot` skill, which locks this model.
- **`gpt-image-2`**: when the image must carry exact text (headlines, posters, labels,
  quoted strings) and there is no reference image. When a reference must be kept
  faithful, use `gpt-image-2.5-sunburst` instead.
- **`gpt-image-2.5-flare`**: fast drafts and quick iteration.

When two could apply: exact text with no reference → `gpt-image-2`; editing a supplied
image or keeping a reference faithful → `gpt-image-2.5-sunburst`; otherwise →
`nano-banana-2`. Constraints change, so before
setting a ratio, resolution or quality, check that model's constraints with
`models_list({ slug })`.

When the user names a model explicitly, use that slug — skip the decisions
above. Pass any slug the user names directly to the tool; the server validates
it.

## Intent to aspect ratio

Resolve the aspect ratio from the user's intent. Default to the listed
value. Do NOT ask the user about aspect ratio if intent is clear from the
listed keywords.

| Intent keywords | Aspect ratio |
|---|---|
| story, Instagram story, vertical, reel cover | 9:16 |
| Instagram post, square, social square | 1:1 |
| hero, banner, website header, landing page, email header | 16:9 |
| Pinterest, pin, vertical pin | 2:3 |
| portrait | 3:4 |
| landscape, widescreen | 4:3 |

Override rules:
- If the user names an aspect ratio or dimensions explicitly (e.g. "1024x1536",
  "9:16", "vertical 2:3"), use that. Skip the table.
- If the intent doesn't match any listed keyword, use `1:1` without asking. The user
  re-runs with another ratio if they want one.

Pass the chosen aspect ratio as `aspectRatio: "W:H"` to `generate_create`.

## Brand model context

A brand model is a trained identity -- a person's face, body, or style -- saved
in the user's Clickraft account. It is distinct from `modelSlug`, which
selects the generation engine (e.g. `nano-banana-2`). Brand models inject a
consistent identity into the generated image so the same person appears across
multiple outputs.

Field: `brandModels: [{ id }]`, or `[{ id, imageType: "<pose>" }]` for a pose. Up to 3
per call.

**Pass only the `id` by default.** The server then uses the model's primary image.

Pose names are `front`, `3/4-right`, `right`, `left`, `3/4-left`, `back`,
`face-closeup`, `hands` and `approved`. A pose works only if that particular brand model
has an image of that angle stored, and many have none. Shared system models
(`source: "system"`) reject every pose. No tool lists a model's poses. So:

- Add a pose only when the user asks for an angle.
- Check it first with the free `generate_estimate` and the same fields.
- If you get `BRAND_MODEL_POSE_NOT_FOUND`, drop the pose and use only the `id`.

Each brand model can appear only once per call ("Duplicate brand model ID").

Discovery -- resolve a named brand model to its UUID:

Call `brand_model_list()` and read `brandModels[].id` and `brandModels[].name`.

When to ask: the user says "my model", "use my face", or names a brand model by
name but not UUID. List brand models and ask which one. The user's own models
(`source: "user"`) come before shared system ones. Names can repeat, so on a clash show
each candidate's `thumbnailUrl` (it can be null) rather than the name alone.

When to act: the user provides a UUID directly, or only one brand model exists
in the account (use it without asking).

When to skip: generic prompts with no identity reference ("a cat on a roof")
don't need a brand model.

```
generate_create({ modelSlug: "nano-banana-2",
  brandModels: [{ id: "8f3a1b2c-..." }],
  prompt: "portrait in a coffee shop, warm lighting", requestId: "<unique id>" })
```

## Product context

A product is a catalog item with reference images (e.g. a shoe, a bottle, a
handbag) stored in the user's Clickraft account. The server uses the reference
images to render the product faithfully in the output.

Field: `products: [{ id }]` or `[{ id, imageId }]`. The server enforces a per-model cap
on how many products a single call accepts.

Discovery -- search the product catalog:

Call `product_list({ search: "red sneaker" })` and read `items[].id`, `items[].title`
and `items[].images[]` (`id`, `url`, `isPrimary`).

When to ask: the user references a product by name ("the red sneaker",
"my latest shoe") but hasn't provided a UUID. Search the catalog and confirm. Catalogs
often hold two products with the same title, and then the title can't tell them apart:
show each candidate's primary image, or pick the one whose image matches what the user
showed.

Each product entry contributes one image: the given `imageId`, otherwise the primary image.

When to act: the user provides a UUID directly, or the search returns exactly
one match.

When to skip: no product is mentioned in the prompt.

```
generate_create({ modelSlug: "nano-banana-2",
  products: [{ id: "a1b2c3d4-..." }],
  prompt: "product on a marble countertop, soft studio lighting", requestId: "<unique id>" })
```

## Reference image context

Use `referenceImages` when the user supplies an arbitrary visual reference
that is not a trained brand model or a catalog product -- mood boards, style
references, composition guides, or user-uploaded photos.

Field: `referenceImages: [url, …]`, up to 8 per call. Only http(s) URLs work: publicly
accessible links, earlier result URLs, or uploaded files.

For a file the user attached or has on their device, call
`upload_widget({ accept: "image", maxFiles, label })` as the only tool in that turn, then
wait for the user's next message, which lists the uploaded URLs. If you already hold the
image bytes, `upload({ contentBase64, filename })` returns a URL instead. Never ask the
user for base64.

Whatever the field order, the server sends images to the model in this order:
brand-model images, then `referenceImages` (in array order), then product images.
Write the prompt to match that order ("the person in the first image, the product in the
last"). The model's reference cap covers all three together; going over it fails with
`REFERENCE_LIMIT_EXCEEDED` and nothing is dropped silently.

How it differs from the other fields:
- `brandModels` -- for trained identities (faces, personas). The server
  knows the identity and can render it from any pose.
- `products` -- for catalog items with curated reference images managed in the
  Clickraft account.
- `referenceImages` -- for everything else: arbitrary URLs, uploaded files, or
  images the user just pasted or uploaded.

```
generate_create({ modelSlug: "nano-banana-2",
  referenceImages: ["<uploaded mood-board URL>", "https://example.com/style-ref.jpg"],
  prompt: "fashion editorial, same color palette as references", requestId: "<unique id>" })
```

## Combined: brand model with product

The most common advanced workflow: a brand model wearing or holding a product.
Both fields in a single call.

The fields handle identity and product; the prompt handles composition. Keep the
prompt focused on scene, pose, and lighting rather than re-describing who or
what -- the fields already carry that context.

Describe the angle in the prompt ("three-quarter view, garment fully visible"). Add a
pose (`imageType`) only after checking it exists (see "Brand model context").

```
generate_create({ modelSlug: "nano-banana-2",
  brandModels: [{ id: "8f3a1b2c-..." }],
  products: [{ id: "a1b2c3d4-..." }],
  prompt: "walking down a city street at golden hour, wearing the product",
  requestId: "<unique id>" })
```

## Prerequisites

1. The Clickraft connector is connected. If a call fails with `AUTH_TOKEN_MISSING` or
   `AUTH_TOKEN_EXPIRED`, tell the user to reconnect the Clickraft connector.

2. A valid **AI model** slug for `modelSlug` (e.g. `nano-banana-2`). This is the
   generation engine, NOT a brand model — brand models go in `brandModels`. The
   "Model selection" section covers the defaults; to see every available model, call
   `models_list({ category: "image" })` and pick a `slug` (`isDefault` marks the default).

## Invocation pattern

Submit, then wait only while the job is still running:

```
generate_create({ modelSlug: "<slug>", aspectRatio: "<W:H>",
  prompt: "<prompt in English>", requestId: "<unique id>" })
generate_wait({ jobId: "<jobId>", timeoutSeconds: 60 })
```

Give every intended generation its own `requestId`. If a call fails in transport, retry
with the SAME `requestId`: the server returns the original job instead of charging again.
A new `requestId` is a new, separately charged job.

Jobs can wait in the queue for minutes before they start, and one account's jobs may run
one after another. Two or three waits that return the job still running in a row are normal. Keep waiting on the
same `jobId` and never re-create the job.

**Optional fields:**

| Field | Use |
|---|---|
| `aspectRatio` | Always set from "Intent to aspect ratio" (default `1:1`) |
| `resolution` (`1K`, `2K`, `4K`) | nano-banana models only; omit for gpt-image models (size comes from the ratio) |
| `quality` | gpt-image models: `high` for `gpt-image-2.5-sunburst` (its default); `low`/`medium` for drafts |
| `brandModels: [{ id, imageType? }]` | Brand model identity; up to 3. Only the `id` by default. See "Brand model context" |
| `products: [{ id, imageId? }]` | Product catalog item. See "Product context" |
| `referenceImages: [url, …]` | Arbitrary reference; up to 8. URLs only. See "Reference image context" |
| `requestId` | Your own id for this intended generation; reuse it only to retry the same job |
| `timeoutSeconds` | How long `generate_create` holds before returning (default 25) |

## The result

`generate_create`, `generate_wait` and `generate_get({ id })` return the job: `jobId`,
`status`, and once it is completed, `resultUrl` (signed and stable for the asset's
lifetime) plus a small preview image. `generate_get` reads the state once without
waiting.

The result renders in the generation widget and updates itself. Use `resultUrl` to chain
into a further call (`referenceImages`, `startFrame`), not to show the user. To present a
final set after refinements, without the superseded attempts, call
`generate_show({ jobIds: [final ids in order] })` once.

## Cost handling

Default: submit without pre-estimating. Quality first.

Surface cost ONLY when:

1. **User asks.** Call `generate_estimate` with the SAME fields you would pass to
   `generate_create` and quote `creditCost`; `affordable` / `blockedReason` say whether
   the account can run it now. It charges nothing.
2. **High-cost configuration.** `resolution: "4K"`, `nano-banana-pro`, or
   `quality` `xhigh`/`max` → call `generate_estimate` first and say "this will use N
   credits" before submitting. Don't ask, just inform. `quality: "high"` on
   `gpt-image-2.5-sunburst` is its normal default and needs no estimate.
3. **Insufficient balance.** On `INSUFFICIENT_CREDITS`, tell the user the
   exact gap and give the pricing link from the error.

Do NOT pre-check balance every call (latency tax). Trust the server's `INSUFFICIENT_CREDITS` and handle in the error path. Do NOT downgrade models silently — switching behind the user's back is worse than running out.

## Error handling

A failed call returns its error text as `Error [CODE] (HTTP n)`. Top codes for this skill:

| Code | What to do |
|---|---|
| `AUTH_TOKEN_MISSING` / `AUTH_TOKEN_EXPIRED` | Tell the user to reconnect the Clickraft connector. Do not retry. |
| `INSUFFICIENT_CREDITS` | Stop. Tell the user their account is out of credits and give the pricing link from the error. Do not retry. |
| `BRAND_MODEL_POSE_NOT_FOUND` | That model has no image for the pose. Drop `imageType` and submit with only the `id`. |
| `BRAND_MODEL_DUPLICATE_ID` | The same brand model is listed twice. Keep one entry. |
| `REFERENCE_LIMIT_EXCEEDED` | Brand models, reference images and products together exceed the model's cap. Drop references or pick a model with a higher cap. |
| `RATE_LIMITED` | Wait a moment and retry once with the same `requestId`. |
| `MODEL_NOT_FOUND` | Call `models_list({ category: "image" })` and pick a different slug. |
| `GEN_CONTENT_REFUSAL` | The model refused the prompt for safety. Ask the user to rephrase. |

A job still `queued` or `processing` when a wait ends is not an error: call
`generate_wait` again with the same `jobId`; never re-create it.
