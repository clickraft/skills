---
version: 0.8.1
name: generate-image
description: |
  Generate a single image with Clickraft. Invokes `clickraft generate create` with an
  AI model slug (e.g. nano-banana-2) and a text prompt, saves the result locally so the
  agent can look at it, and returns the result URL.

  Use when: "generate an image", "create an image", "render an image", "make an
  image", "make a picture", "produce a hero image", "generate a product photo",
  "render with my brand model", "image from this prompt", "make me a graphic".

  NOT for: a finished product photoshoot or set (use `product-photoshoot`), a named
  product look like "hero shot" or "flatlay" (use `product-image-presets`), video
  (use `product-video-presets`, `ugc-video` or `ad-multiplier`), thumbnails (use
  `thumbnail-generation`), character sheets (use `character-sheet`).

  Chain with: any skill above. A finished `data.resultUrl` is a valid
  `--reference-image` or `--start-frame` for the next call.
argument-hint: "[prompt] [--model-slug <slug>] [--aspect-ratio <W:H>] [--brand-model <uuid>] [--product <uuid>:<imageId>] [--reference-image <url|path>]"
allowed-tools: Bash(clickraft:*), Read
---

# Generate an image with the Clickraft CLI

## Quick start

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

## UX rules

1. Be concise. No raw IDs, no JSON dumps. Print the saved path, the resultUrl, and a
   one-line summary of what you see in the image.
2. Detect the user's language and reply in it. The prompt sent to the CLI via
   `--prompt "..."` stays English whatever the user's language: translate the intent
   (style, composition, scene, mood, lighting) to English before submitting. Text that
   must appear in the image stays verbatim. CLI flags stay English.
3. Don't batch-ask. Pick the default for the user's modality and submit. Ask one thing only if a required field is genuinely missing.
4. Don't pre-estimate cost or downgrade models silently — see "Cost handling".
5. Polling is silent: `--no-wait`, then `generate wait`, with no status narration.

## When to ask

Default: act with sensible defaults.

Ask one labeled-options question ONLY when:

- Modality is ambiguous (image vs video vs audio).
- Family resolves to ≥3 slugs with materially different quality/cost — surface the top 2.
- A required input is genuinely missing (no prompt, no reference image on "edit this").

Never ask about aspect ratio, resolution, or duration — default and submit. The user re-runs with overrides if needed.

## Model selection

Static catalog. Pick by intent. Pass the chosen slug as `--model-slug` to
`clickraft generate create`.

- **`nano-banana-2`**: the default (`isDefault` in `models list`). Use it for ordinary
  generation, photoreal scenes, a trained identity (`--brand-model`) and characters kept
  consistent across images. It takes up to 10 asset and 4 character references, and it
  is the only one with extreme ratios (1:4, 1:8, 4:1, 8:1). Default resolution is 1K
  (134 credits); pass `--resolution 2K` only when the user wants a larger file.
- **`gpt-image-2.5-sunburst`** with `--quality high`: for precise edits of a supplied
  image, and compositions where a reference must be kept faithful (up to 8
  `--reference-image`). It is cheaper (about 106 credits), but in a side-by-side test its
  photoreal scenes looked flatter than `nano-banana-2`. It takes no `--resolution`: the
  size comes from the ratio (16:9 → 2048×1152).
- **`nano-banana-pro`** at `--resolution 2K`: for finished commercial product images
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
setting a ratio, resolution or quality, check `clickraft models list --json` →
`data.models[].constraints.capabilities`.

When the user names a model explicitly, use that slug — skip the decisions
above. Pass any slug the user names directly to the CLI; the CLI validates
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

Pass the chosen aspect ratio as `--aspect-ratio <W:H>` to `clickraft generate
create`.

## Brand model context

A brand model is a trained identity -- a person's face, body, or style -- saved
in the user's Clickraft account. It is distinct from `--model-slug`, which
selects the generation engine (e.g. `nano-banana-2`). Brand models inject a
consistent identity into the generated image so the same person appears across
multiple outputs.

Flag: `--brand-model <uuid>` or `--brand-model <uuid>:<pose>`. Repeatable, up
to 3 per call.

**Pass the bare uuid by default.** The server then uses the model's primary image.

Pose names are `front`, `3/4-right`, `right`, `left`, `3/4-left`, `back`,
`face-closeup`, `hands` and `approved`. A pose works only if that particular brand model
has an image of that angle stored, and many have none. Shared system models
(`source: "system"`) reject every pose. No command lists a model's poses. So:

- Add a pose only when the user asks for an angle.
- Check it first with the free `clickraft generate estimate` and the same flags.
- If you get `E_BRAND_MODEL_POSE_NOT_FOUND`, drop the pose and use the bare uuid.

Each brand model can appear only once per call ("Duplicate brand model ID"). In zsh,
write `"${UUID}:back"`, because `$UUID:back` is read as a modifier.

Discovery -- resolve a named brand model to its UUID:

```bash
clickraft brand-model list --json
```

Read `data[].id` and `data[].name` (`data` is the list itself).

When to ask: the user says "my model", "use my face", or names a brand model by
name but not UUID. List brand models and ask which one. The user's own models
(`source: "user"`) come before shared system ones. Names can repeat, so on a clash show
each candidate's `thumbnailUrl` (it can be null) rather than the name alone.

When to act: the user provides a UUID directly, or only one brand model exists
in the account (use it without asking).

When to skip: generic prompts with no identity reference ("a cat on a roof")
don't need a brand model.

```bash
clickraft generate create --json --no-wait \
  --model-slug nano-banana-2 \
  --brand-model 8f3a1b2c-... \
  --prompt "portrait in a coffee shop, warm lighting"
```

## Product context

A product is a catalog item with reference images (e.g. a shoe, a bottle, a
handbag) stored in the user's Clickraft account. The server uses the reference
images to render the product faithfully in the output.

Flag: `--product <uuid>` or `--product <uuid>:<imageId>`. Repeatable; the
server enforces a per-model cap on how many products a single call accepts.

Discovery -- search the product catalog:

```bash
clickraft product list --json --search "red sneaker"
```

Read `data.products[].id` and `data.products[].title`.

When to ask: the user references a product by name ("the red sneaker",
"my latest shoe") but hasn't provided a UUID. Search the catalog and confirm. Catalogs
often hold two products with the same title, and then the title can't tell them apart:
show each candidate's primary image, or pick the one whose image matches what the user
showed.

Each `--product` contributes one image: the given `imageId`, otherwise the primary image.

When to act: the user provides a UUID directly, or the search returns exactly
one match.

When to skip: no product is mentioned in the prompt.

```bash
clickraft generate create --json \
  --model-slug nano-banana-2 \
  --product a1b2c3d4-... \
  --prompt "product on a marble countertop, soft studio lighting"
```

## Reference image context

Use `--reference-image` when the user supplies an arbitrary visual reference
that is not a trained brand model or a catalog product -- mood boards, style
references, composition guides, or user-uploaded photos.

Flag: `--reference-image <url|path>`. Repeatable, up to 8 per call.

Local file paths are auto-uploaded by the CLI (via the upload primitive) before
the generation request is sent, which adds about 10 seconds. URLs must be publicly
accessible or GCS-signed URLs from a previous `clickraft upload`.

Whatever the flag order, the server sends images to the model in this order:
brand-model images, then `--reference-image` (in flag order), then `--product` images.
Write the prompt to match that order ("the person in the first image, the product in the
last"). The model's reference cap covers all three together; going over it fails with
`REFERENCE_LIMIT_EXCEEDED` and nothing is dropped silently.

How it differs from the other flags:
- `--brand-model` -- for trained identities (faces, personas). The server
  knows the identity and can render it from any pose.
- `--product` -- for catalog items with curated reference images managed in the
  Clickraft account.
- `--reference-image` -- for everything else: arbitrary URLs, local files, or
  images the user just pasted or uploaded.

```bash
clickraft generate create --json \
  --model-slug nano-banana-2 \
  --reference-image ./mood-board.png \
  --reference-image "https://example.com/style-ref.jpg" \
  --prompt "fashion editorial, same color palette as references"
```

## Combined: brand model with product

The most common advanced workflow: a brand model wearing or holding a product.
Both flags in a single call.

The flags handle identity and product; the prompt handles composition. Keep the
prompt focused on scene, pose, and lighting rather than re-describing who or
what -- the flags already carry that context.

Describe the angle in the prompt ("three-quarter view, garment fully visible"). Add a
pose suffix only after checking it exists (see "Brand model context").

```bash
clickraft generate create --json --no-wait \
  --model-slug nano-banana-2 \
  --brand-model 8f3a1b2c-... \
  --product a1b2c3d4-... \
  --prompt "walking down a city street at golden hour, wearing the product"
```

## Prerequisites

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

## Invocation pattern

Always pass `--json` so the response is parseable. Submit with `--no-wait`, then wait:

```bash
clickraft generate create --json --no-wait \
  --model-slug <slug> \
  --aspect-ratio <W:H> \
  --prompt "<prompt in English>"
clickraft generate wait <jobId> --json --timeout 100 --output ./clickraft-output/
```

Jobs can wait in the queue for minutes before they start, and one account's jobs may run
one after another. Two or three timed-out waits in a row are normal. Keep waiting on the
same jobId and never re-create the job. Don't chain `generate wait` with `&&`, because a
timeout exits non-zero.

**Optional flags:**

| Flag | Use |
|---|---|
| `--aspect-ratio <W:H>` | Always set from "Intent to aspect ratio" (default `1:1`) |
| `--resolution <1K\|2K\|4K>` | nano-banana models only; omit for gpt-image models (size comes from the ratio) |
| `--quality <tier>` | gpt-image models: `high` for `gpt-image-2.5-sunburst` (its default); `low`/`medium` for drafts |
| `--brand-model <uuid>[:<pose>]` | Brand model identity; repeatable, up to 3. Bare uuid by default. See "Brand model context" |
| `--product <uuid>:<imageId>` | Product catalog item; repeatable. See "Product context" |
| `--reference-image <url\|path>` | Arbitrary reference; repeatable, up to 8. Local paths auto-uploaded. See "Reference image context" |

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

## Cost handling

Default: submit without pre-estimating. Quality first.

Surface cost ONLY when:

1. **User asks.** Run `clickraft generate estimate` with the SAME flags you
   would pass to `generate create` (plus `--json`) and quote `data.creditCost`;
   `data.affordable` / `data.blockedReason` say whether the account can run it
   now. It charges nothing. (Needs the CLI release that ships `generate
   estimate`; an older CLI answers "Unknown command".)
2. **High-cost configuration.** `--resolution 4K`, `nano-banana-pro`, or
   `--quality xhigh`/`max` → run `generate estimate` first and say "this will use N
   credits" before submitting. Don't ask, just inform. `--quality high` on
   `gpt-image-2.5-sunburst` is its normal default and needs no estimate.
3. **Insufficient balance.** On `E_INSUFFICIENT_CREDITS`, tell the user the
   exact gap and link to billing.

Do NOT pre-check balance every call (latency tax). Trust the server's `E_INSUFFICIENT_CREDITS` and handle in the error path. Do NOT downgrade models silently — switching behind the user's back is worse than running out.

## Error handling

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
