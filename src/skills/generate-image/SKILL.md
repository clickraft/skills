---
version: 0.8.1
name: generate-image
surfaces: [cli, mcp]
description: |
  Generate a single image with Clickraft. <cli>Invokes `clickraft generate create`</cli><mcp>Calls `generate_create`</mcp> with an
  AI model slug (e.g. nano-banana-2) and a text prompt, <cli>saves the result locally so the</cli><mcp>checks the result's preview</mcp>
  <cli>agent can look at it, and returns the result URL.</cli><mcp>and shows it in the generation widget.</mcp>

  Use when: "generate an image", "create an image", "render an image", "make an
  image", "make a picture", "produce a hero image", "generate a product photo",
  "render with my brand model", "image from this prompt", "make me a graphic".

  NOT for: a finished product photoshoot or set (use `product-photoshoot`), a named
  product look like "hero shot" or "flatlay" (use `product-image-presets`), video
  (use `product-video-presets`, `ugc-video` or `ad-multiplier`), thumbnails (use
  `thumbnail-generation`), character sheets (use `character-sheet`).

  Chain with: any skill above. A finished <cli>`data.resultUrl`</cli><mcp>result URL</mcp> is a valid
  <cli>`--reference-image` or `--start-frame`</cli><mcp>`referenceImages` entry or `startFrame`</mcp> for the next call.
<cli>
argument-hint: "[prompt] [--model-slug <slug>] [--aspect-ratio <W:H>] [--brand-model <uuid>] [--product <uuid>:<imageId>] [--reference-image <url|path>]"
allowed-tools: Bash(clickraft:*), Read
</cli>
---

# Generate an image with <cli>the Clickraft CLI</cli><mcp>Clickraft</mcp>

## Quick start

<cli>
```bash
clickraft generate create --json --no-wait --model-slug nano-banana-2 \
  --aspect-ratio 1:1 --prompt "<user's prompt in English>"
clickraft generate wait <jobId> --json --timeout 100 --output ./clickraft-output/
```

Submit with `--no-wait`, then wait on the returned `data.jobId`. Agent shells are killed
after about 2 minutes, and a job can sit in the queue for several minutes before it starts.
If `generate wait` comes back with `E_TIMEOUT` (exit code 6), the job is still running: run
the same `generate wait <jobId>` again. Never create the job a second time.

`--output` saves the finished image as `./clickraft-output/<jobId>.<ext>` and reports
the path in `data.savedPath`. **Open that file (Read) and look at it before you
reply** — check it matches the request (subject, text, composition). Then surface
`data.savedPath` and `data.resultUrl` to the user.
</cli>
<mcp>
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
</mcp>

## UX rules

1. Be concise. No raw IDs, no JSON dumps. <cli>Print the saved path, the resultUrl, and a</cli><mcp>The widget shows the image; add a</mcp>
   one-line summary of what you see in the image.
2. Detect the user's language and reply in it. The prompt sent to <cli>the CLI via</cli><mcp>`generate_create`</mcp>
   <cli>`--prompt "..."` </cli>stays English whatever the user's language: translate the intent
   (style, composition, scene, mood, lighting) to English before submitting. Text that
   must appear in the image stays verbatim. <cli>CLI flags</cli><mcp>Field values such as slugs and ratios</mcp> stay English.
3. Don't batch-ask. Pick the default for the user's modality and submit. Ask one thing only if a required field is genuinely missing.
4. Don't pre-estimate cost or downgrade models silently — see "Cost handling".
5. Polling is silent: <cli>`--no-wait`, then `generate wait`,</cli><mcp>`generate_wait` calls run</mcp> with no status narration.

## When to ask

Default: act with sensible defaults.

Ask one labeled-options question ONLY when:

- Modality is ambiguous (image vs video vs audio).
- Family resolves to ≥3 slugs with materially different quality/cost — surface the top 2.
- A required input is genuinely missing (no prompt, no reference image on "edit this").

Never ask about aspect ratio, resolution, or duration — default and submit. The user re-runs with overrides if needed.

## Model selection

Static catalog. Pick by intent. Pass the chosen slug as <cli>`--model-slug` to</cli><mcp>`modelSlug` to</mcp>
<cli>`clickraft generate create`.</cli><mcp>`generate_create`.</mcp>

- **`nano-banana-2`**: the default (`isDefault` in <cli>`models list`</cli><mcp>`models_list`</mcp>). Use it for ordinary
  generation, photoreal scenes, a trained identity (<cli>`--brand-model`</cli><mcp>`brandModels`</mcp>) and characters kept
  consistent across images. It takes up to 10 asset and 4 character references, and it
  is the only one with extreme ratios (1:4, 1:8, 4:1, 8:1). Default resolution is 1K
  (134 credits); pass <cli>`--resolution 2K`</cli><mcp>`resolution: "2K"`</mcp> only when the user wants a larger file.
- **`gpt-image-2.5-sunburst`** with <cli>`--quality high`</cli><mcp>`quality: "high"`</mcp>: for precise edits of a supplied
  image, and compositions where a reference must be kept faithful (up to 8
  <cli>`--reference-image`</cli><mcp>`referenceImages`</mcp>). It is cheaper (about 106 credits), but in a side-by-side test its
  photoreal scenes looked flatter than `nano-banana-2`. It takes no <cli>`--resolution`</cli><mcp>`resolution`</mcp>: the
  size comes from the ratio (16:9 → 2048×1152).
- **`nano-banana-pro`** at <cli>`--resolution 2K`</cli><mcp>`resolution: "2K"`</mcp>: for finished commercial product images
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
setting a ratio, resolution or quality, check <cli>`clickraft models list --json` →</cli><mcp>that model's constraints with</mcp>
<cli>`data.models[].constraints.capabilities`.</cli><mcp>`models_list({ slug })`.</mcp>

When the user names a model explicitly, use that slug — skip the decisions
above. Pass any slug the user names directly to the <cli>CLI; the CLI validates</cli><mcp>tool; the server validates</mcp>
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

<cli>
Pass the chosen aspect ratio as `--aspect-ratio <W:H>` to `clickraft generate
create`.
</cli>
<mcp>
Pass the chosen aspect ratio as `aspectRatio: "W:H"` to `generate_create`.
</mcp>

## Brand model context

A brand model is a trained identity -- a person's face, body, or style -- saved
in the user's Clickraft account. It is distinct from <cli>`--model-slug`</cli><mcp>`modelSlug`</mcp>, which
selects the generation engine (e.g. `nano-banana-2`). Brand models inject a
consistent identity into the generated image so the same person appears across
multiple outputs.

<cli>
Flag: `--brand-model <uuid>` or `--brand-model <uuid>:<pose>`. Repeatable, up
to 3 per call.
</cli>
<mcp>
Field: `brandModels: [{ id }]`, or `[{ id, imageType: "<pose>" }]` for a pose. Up to 3
per call.
</mcp>

**Pass <cli>the bare uuid</cli><mcp>only the `id`</mcp> by default.** The server then uses the model's primary image.

Pose names are `front`, `3/4-right`, `right`, `left`, `3/4-left`, `back`,
`face-closeup`, `hands` and `approved`. A pose works only if that particular brand model
has an image of that angle stored, and many have none. Shared system models
(`source: "system"`) reject every pose. No <cli>command</cli><mcp>tool</mcp> lists a model's poses. So:

- Add a pose only when the user asks for an angle.
- Check it first with the free <cli>`clickraft generate estimate` and the same flags</cli><mcp>`generate_estimate` and the same fields</mcp>.
- If you get <cli>`E_BRAND_MODEL_POSE_NOT_FOUND`</cli><mcp>`BRAND_MODEL_POSE_NOT_FOUND`</mcp>, drop the pose and use <cli>the bare uuid</cli><mcp>only the `id`</mcp>.

<cli>
Each brand model can appear only once per call ("Duplicate brand model ID"). In zsh,
write `"${UUID}:back"`, because `$UUID:back` is read as a modifier.
</cli>
<mcp>
Each brand model can appear only once per call ("Duplicate brand model ID").
</mcp>

Discovery -- resolve a named brand model to its UUID:

<cli>
```bash
clickraft brand-model list --json
```

Read `data[].id` and `data[].name` (`data` is the list itself).
</cli>
<mcp>
Call `brand_model_list()` and read `brandModels[].id` and `brandModels[].name`.
</mcp>

When to ask: the user says "my model", "use my face", or names a brand model by
name but not UUID. List brand models and ask which one. The user's own models
(`source: "user"`) come before shared system ones. Names can repeat, so on a clash show
each candidate's `thumbnailUrl` (it can be null) rather than the name alone.

When to act: the user provides a UUID directly, or only one brand model exists
in the account (use it without asking).

When to skip: generic prompts with no identity reference ("a cat on a roof")
don't need a brand model.

<cli>
```bash
clickraft generate create --json --no-wait \
  --model-slug nano-banana-2 \
  --brand-model 8f3a1b2c-... \
  --prompt "portrait in a coffee shop, warm lighting"
```
</cli>
<mcp>
```
generate_create({ modelSlug: "nano-banana-2",
  brandModels: [{ id: "8f3a1b2c-..." }],
  prompt: "portrait in a coffee shop, warm lighting", requestId: "<unique id>" })
```
</mcp>

## Product context

A product is a catalog item with reference images (e.g. a shoe, a bottle, a
handbag) stored in the user's Clickraft account. The server uses the reference
images to render the product faithfully in the output.

<cli>
Flag: `--product <uuid>` or `--product <uuid>:<imageId>`. Repeatable; the
server enforces a per-model cap on how many products a single call accepts.
</cli>
<mcp>
Field: `products: [{ id }]` or `[{ id, imageId }]`. The server enforces a per-model cap
on how many products a single call accepts.
</mcp>

Discovery -- search the product catalog:

<cli>
```bash
clickraft product list --json --search "red sneaker"
```

Read `data.products[].id` and `data.products[].title`.
</cli>
<mcp>
Call `product_list({ search: "red sneaker" })` and read `items[].id`, `items[].title`
and `items[].images[]` (`id`, `url`, `isPrimary`).
</mcp>

When to ask: the user references a product by name ("the red sneaker",
"my latest shoe") but hasn't provided a UUID. Search the catalog and confirm. Catalogs
often hold two products with the same title, and then the title can't tell them apart:
show each candidate's primary image, or pick the one whose image matches what the user
showed.

Each <cli>`--product`</cli><mcp>product entry</mcp> contributes one image: the given `imageId`, otherwise the primary image.

When to act: the user provides a UUID directly, or the search returns exactly
one match.

When to skip: no product is mentioned in the prompt.

<cli>
```bash
clickraft generate create --json \
  --model-slug nano-banana-2 \
  --product a1b2c3d4-... \
  --prompt "product on a marble countertop, soft studio lighting"
```
</cli>
<mcp>
```
generate_create({ modelSlug: "nano-banana-2",
  products: [{ id: "a1b2c3d4-..." }],
  prompt: "product on a marble countertop, soft studio lighting", requestId: "<unique id>" })
```
</mcp>

## Reference image context

Use <cli>`--reference-image`</cli><mcp>`referenceImages`</mcp> when the user supplies an arbitrary visual reference
that is not a trained brand model or a catalog product -- mood boards, style
references, composition guides, or user-uploaded photos.

<cli>
Flag: `--reference-image <url|path>`. Repeatable, up to 8 per call.

Local file paths are auto-uploaded by the CLI (via the upload primitive) before
the generation request is sent, which adds about 10 seconds. URLs must be publicly
accessible or GCS-signed URLs from a previous `clickraft upload`.
</cli>
<mcp>
Field: `referenceImages: [url, …]`, up to 8 per call. Only http(s) URLs work: publicly
accessible links, earlier result URLs, or uploaded files.

For a file the user attached or has on their device, call
`upload_widget({ accept: "image", maxFiles, label })` as the only tool in that turn, then
wait for the user's next message, which lists the uploaded URLs. If you already hold the
image bytes, `upload({ contentBase64, filename })` returns a URL instead. Never ask the
user for base64.
</mcp>

Whatever the <cli>flag</cli><mcp>field</mcp> order, the server sends images to the model in this order:
brand-model images, then <cli>`--reference-image` (in flag order)</cli><mcp>`referenceImages` (in array order)</mcp>, then <cli>`--product`</cli><mcp>product</mcp> images.
Write the prompt to match that order ("the person in the first image, the product in the
last"). The model's reference cap covers all three together; going over it fails with
`REFERENCE_LIMIT_EXCEEDED` and nothing is dropped silently.

How it differs from the other <cli>flags</cli><mcp>fields</mcp>:
- <cli>`--brand-model`</cli><mcp>`brandModels`</mcp> -- for trained identities (faces, personas). The server
  knows the identity and can render it from any pose.
- <cli>`--product`</cli><mcp>`products`</mcp> -- for catalog items with curated reference images managed in the
  Clickraft account.
- <cli>`--reference-image`</cli><mcp>`referenceImages`</mcp> -- for everything else: arbitrary URLs, <cli>local files</cli><mcp>uploaded files</mcp>, or
  images the user just pasted or uploaded.

<cli>
```bash
clickraft generate create --json \
  --model-slug nano-banana-2 \
  --reference-image ./mood-board.png \
  --reference-image "https://example.com/style-ref.jpg" \
  --prompt "fashion editorial, same color palette as references"
```
</cli>
<mcp>
```
generate_create({ modelSlug: "nano-banana-2",
  referenceImages: ["<uploaded mood-board URL>", "https://example.com/style-ref.jpg"],
  prompt: "fashion editorial, same color palette as references", requestId: "<unique id>" })
```
</mcp>

## Combined: brand model with product

The most common advanced workflow: a brand model wearing or holding a product.
Both <cli>flags</cli><mcp>fields</mcp> in a single call.

The <cli>flags</cli><mcp>fields</mcp> handle identity and product; the prompt handles composition. Keep the
prompt focused on scene, pose, and lighting rather than re-describing who or
what -- the <cli>flags</cli><mcp>fields</mcp> already carry that context.

Describe the angle in the prompt ("three-quarter view, garment fully visible"). Add a
<cli>pose suffix</cli><mcp>pose (`imageType`)</mcp> only after checking it exists (see "Brand model context").

<cli>
```bash
clickraft generate create --json --no-wait \
  --model-slug nano-banana-2 \
  --brand-model 8f3a1b2c-... \
  --product a1b2c3d4-... \
  --prompt "walking down a city street at golden hour, wearing the product"
```
</cli>
<mcp>
```
generate_create({ modelSlug: "nano-banana-2",
  brandModels: [{ id: "8f3a1b2c-..." }],
  products: [{ id: "a1b2c3d4-..." }],
  prompt: "walking down a city street at golden hour, wearing the product",
  requestId: "<unique id>" })
```
</mcp>

## Prerequisites

<cli>
1. CLI installed and authenticated:

   ```bash
   clickraft --version       # must report >= 0.6.0
   clickraft tokens list     # must return at least one active token
   ```

   If not authenticated, instruct the user to run `clickraft login`.

2. A valid **AI model** slug for `--model-slug` (e.g. `nano-banana-2`). This is the
   generation engine, NOT a brand model — brand models go in `--brand-model`. The
   "Model selection" section covers the defaults; to see every available model:

   ```bash
   clickraft models list --json --category image
   ```

   Pick a slug from `data.models[].slug` (`isDefault` marks the default).
</cli>
<mcp>
1. The Clickraft connector is connected. If a call fails with `AUTH_TOKEN_MISSING` or
   `AUTH_TOKEN_EXPIRED`, tell the user to reconnect the Clickraft connector.

2. A valid **AI model** slug for `modelSlug` (e.g. `nano-banana-2`). This is the
   generation engine, NOT a brand model — brand models go in `brandModels`. The
   "Model selection" section covers the defaults; to see every available model, call
   `models_list({ category: "image" })` and pick a `slug` (`isDefault` marks the default).
</mcp>

## Invocation pattern

<cli>
Always pass `--json` so the response is parseable. Submit with `--no-wait`, then wait:

```bash
clickraft generate create --json --no-wait \
  --model-slug <slug> \
  --aspect-ratio <W:H> \
  --prompt "<prompt in English>"
clickraft generate wait <jobId> --json --timeout 100 --output ./clickraft-output/
```
</cli>
<mcp>
Submit, then wait only while the job is still running:

```
generate_create({ modelSlug: "<slug>", aspectRatio: "<W:H>",
  prompt: "<prompt in English>", requestId: "<unique id>" })
generate_wait({ jobId: "<jobId>", timeoutSeconds: 60 })
```

Give every intended generation its own `requestId`. If a call fails in transport, retry
with the SAME `requestId`: the server returns the original job instead of charging again.
A new `requestId` is a new, separately charged job.
</mcp>

Jobs can wait in the queue for minutes before they start, and one account's jobs may run
one after another. Two or three <cli>timed-out waits</cli><mcp>waits that return the job still running</mcp> in a row are normal. Keep waiting on the
<cli>
same jobId and never re-create the job. Don't chain `generate wait` with `&&`, because a
timeout exits non-zero.
</cli>
<mcp>
same `jobId` and never re-create the job.
</mcp>

**Optional <cli>flags</cli><mcp>fields</mcp>:**

| <cli>Flag</cli><mcp>Field</mcp> | Use |
|---|---|
| <cli>`--aspect-ratio <W:H>`</cli><mcp>`aspectRatio`</mcp> | Always set from "Intent to aspect ratio" (default `1:1`) |
| <cli>`--resolution <1K\|2K\|4K>`</cli><mcp>`resolution` (`1K`, `2K`, `4K`)</mcp> | nano-banana models only; omit for gpt-image models (size comes from the ratio) |
| <cli>`--quality <tier>`</cli><mcp>`quality`</mcp> | gpt-image models: `high` for `gpt-image-2.5-sunburst` (its default); `low`/`medium` for drafts |
| <cli>`--brand-model <uuid>[:<pose>]`</cli><mcp>`brandModels: [{ id, imageType? }]`</mcp> | Brand model identity; <cli>repeatable, </cli>up to 3. <cli>Bare uuid</cli><mcp>Only the `id`</mcp> by default. See "Brand model context" |
| <cli>`--product <uuid>:<imageId>`</cli><mcp>`products: [{ id, imageId? }]`</mcp> | Product catalog item<cli>; repeatable</cli>. See "Product context" |
| <cli>`--reference-image <url\|path>`</cli><mcp>`referenceImages: [url, …]`</mcp> | Arbitrary reference; <cli>repeatable, </cli>up to 8. <cli>Local paths auto-uploaded.</cli><mcp>URLs only.</mcp> See "Reference image context" |
<mcp>
| `requestId` | Your own id for this intended generation; reuse it only to retry the same job |
| `timeoutSeconds` | How long `generate_create` holds before returning (default 25) |
</mcp>

<cli>
## Response envelope

On success the CLI prints:

```json
{
  "ok": true,
  "data": {
    "jobId": "...",
    "status": "completed",
    "resultUrl": "https://...",
    "thumbnailUrl": "https://...",
    "creditsCharged": 25,
    "savedPath": "/abs/path/clickraft-output/<jobId>.png"
  },
  "error": null,
  "meta": { "request_id": "...", "command": "generate create", "duration_ms": 8412 }
}
```

Read the final image URL from `data.resultUrl`. `data.thumbnailUrl` is often null, so don't rely on it. Both URLs are GCS-signed and stable for the asset's lifetime. Full envelope reference: `docs/ENVELOPE.md` in the [clickraft/skills](https://github.com/clickraft/skills/blob/main/docs/ENVELOPE.md) repo.

## The submit response

`generate create --no-wait` (equivalent: `--async`) returns at once. The response has `data.status = "queued"` and `data.resultUrl = null`. Resume later with `clickraft generate wait <jobId> --json --output ./clickraft-output/` (long-poll) or `clickraft generate get <jobId> --json --output ./clickraft-output/` (single-shot). `--output` only saves a completed job; otherwise the CLI notes `Not saved: …` on stderr and `data.savedPath` is absent.
</cli>
<mcp>
## The result

`generate_create`, `generate_wait` and `generate_get({ id })` return the job: `jobId`,
`status`, and once it is completed, `resultUrl` (signed and stable for the asset's
lifetime) plus a small preview image. `generate_get` reads the state once without
waiting.

The result renders in the generation widget and updates itself. Use `resultUrl` to chain
into a further call (`referenceImages`, `startFrame`), not to show the user. To present a
final set after refinements, without the superseded attempts, call
`generate_show({ jobIds: [final ids in order] })` once.
</mcp>

## Cost handling

Default: submit without pre-estimating. Quality first.

Surface cost ONLY when:

<cli>
1. **User asks.** Run `clickraft generate estimate` with the SAME flags you
   would pass to `generate create` (plus `--json`) and quote `data.creditCost`;
   `data.affordable` / `data.blockedReason` say whether the account can run it
   now. It charges nothing. (Needs the CLI release that ships `generate
   estimate`; an older CLI answers "Unknown command".)
</cli>
<mcp>
1. **User asks.** Call `generate_estimate` with the SAME fields you would pass to
   `generate_create` and quote `creditCost`; `affordable` / `blockedReason` say whether
   the account can run it now. It charges nothing.
</mcp>
2. **High-cost configuration.** <cli>`--resolution 4K`</cli><mcp>`resolution: "4K"`</mcp>, `nano-banana-pro`, or
   <cli>`--quality xhigh`/`max` → run `generate estimate`</cli><mcp>`quality` `xhigh`/`max` → call `generate_estimate`</mcp> first and say "this will use N
   credits" before submitting. Don't ask, just inform. <cli>`--quality high`</cli><mcp>`quality: "high"`</mcp> on
   `gpt-image-2.5-sunburst` is its normal default and needs no estimate.
3. **Insufficient balance.** On <cli>`E_INSUFFICIENT_CREDITS`</cli><mcp>`INSUFFICIENT_CREDITS`</mcp>, tell the user the
   exact gap and <cli>link to billing</cli><mcp>give the pricing link from the error</mcp>.

Do NOT pre-check balance every call (latency tax). Trust the server's <cli>`E_INSUFFICIENT_CREDITS`</cli><mcp>`INSUFFICIENT_CREDITS`</mcp> and handle in the error path. Do NOT downgrade models silently — switching behind the user's back is worse than running out.

## Error handling

<cli>
On failure the envelope returns `ok: false` and the exit code is non-zero. Top error codes for this skill:

| `error.code` | What to do |
|---|---|
| `E_AUTH_TOKEN_MISSING` / `E_AUTH_TOKEN_EXPIRED` | Tell the user to run `clickraft login`. Do not retry. |
| `E_INSUFFICIENT_CREDITS` | Tell the user their account is out of credits + link to billing. Do not retry. |
| `E_TIMEOUT` (from `generate wait`, exit 6) | Not a failure: the job is still queued or running. Run `generate wait <same jobId>` again; never re-create it. |
| `E_BRAND_MODEL_POSE_NOT_FOUND` | That model has no image for the pose. Drop the pose and submit with the bare uuid. |
| `E_RATE_LIMITED` | Wait `error.retry_after_ms` (default 1000 if unset) and retry once. |
| `E_MODEL_NOT_FOUND` | Re-list models with `clickraft models list --json` and pick a different slug. |
| `E_GEN_CONTENT_REFUSAL` | The model refused the prompt for safety. Ask the user to rephrase. |

Full envelope + exit-code + error-code reference: [docs/ENVELOPE.md on GitHub](https://github.com/clickraft/skills/blob/main/docs/ENVELOPE.md).

## Compatibility

Requires `@clickraft/cli` `>= 0.6.0`. The CLI's `compatibility.json` declares the minimum skills version it supports; this skill's behaviour is locked against CLI `0.6.0` envelope semantics.

`--output` needs a CLI release that includes it. An older CLI rejects it with
`Unknown flag --output` (`E_INPUT_INVALID_FORMAT`, exit 2): rerun the same command
without `--output`, then fetch `data.resultUrl` with `curl -sSfo <path> <url>` and open
that file instead.
</cli>
<mcp>
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
</mcp>
