---
version: 0.3.0
name: generate-image
description: |
  Generate a single image with Clickraft. Invokes `clickraft generate create` against
  a brand-model slug with a text prompt, returns the GCS-signed result URL.

  Use when: "generate an image", "create an image", "render an image", "make an
  image", "make a picture", "produce a hero image", "generate a product photo",
  "render with my brand model", "image from this prompt", "make me a graphic".

  NOT for: editing an existing image (separate edit skill, coming later), batch
  generation in one call (separate batch skill), generating video (separate video
  skill), uploading user-provided images (separate `upload` skill).

  Chain with: none in Wave 1. Future: chain with `clickraft-product-shoot` for
  multi-image product workflows (v0.2.x+).
argument-hint: "[prompt] [--model-slug <slug>] [--aspect-ratio <W:H>] [--reference-image <url>]"
allowed-tools: Bash(clickraft:*)
---

# Generate an image with the Clickraft CLI

## Quick start

```bash
clickraft generate create --json --model-slug <slug> --prompt "<user's prompt>"
```

Read `data.resultUrl` from the JSON envelope and surface it to the user.

## UX rules

1. Be concise. No raw IDs, no JSON dumps. Print the resultUrl + a one-line summary.
2. Detect language and reply in it. CLI flags stay English.
3. Don't batch-ask. Pick the default for the user's modality and submit. Ask one thing only if a required field is genuinely missing.
4. Don't pre-estimate cost or downgrade models silently — see "Cost handling".
5. Polling is silent. Use the default sync mode (no `--no-wait`). No status narration.
6. Detect the user's language and respond in it. The prompt sent to the
   CLI via `--prompt "..."` stays English regardless of the user's language —
   translate intent (style, composition, scene, mood, lighting) to English
   before submitting. CLI flags stay English.

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

- **`nano-banana-2`** — default. Use for general image generation, character,
  stylized, photorealistic scenes, reference-driven work.
- **`nano-banana-pro`** — escalation only. Use when `nano-banana-2` was
  tried and the output didn't land, OR when the user explicitly asks for
  "high quality", "best quality", "professional", "Pro", or "better". Do
  NOT pick Pro proactively from intent keywords like "product", "hero",
  "studio", or "commercial" — those go to `nano-banana-2` first. Pro is
  3-5× more expensive; default-first iteration is the right pattern.
- **`gpt-image-2`** — use when the image must contain rendered text:
  typography, on-image text, headlines, labels, posters, logos with text,
  story/ad with copy. Trigger phrases (any language): "with text", "with
  the words", "with caption", "with title", "with headline", "label that
  reads", explicit quoted strings the user wants rendered.

When two could apply, prefer `gpt-image-2` if text rendering is required;
otherwise prefer `nano-banana-2` for speed and cost. Pro is reserved for
explicit user request or retry after a failed `nano-banana-2` attempt.

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
- If the intent doesn't match any listed keyword, ask ONE labeled-options
  question: `[1:1 (square) / 9:16 (vertical) / 16:9 (wide)]`.

Pass the chosen aspect ratio as `--aspect-ratio <W:H>` to `clickraft generate
create`.

## Prerequisites

1. CLI installed and authenticated:

   ```bash
   clickraft --version       # must report >= 0.1.2
   clickraft tokens list     # must return at least one active token
   ```

   If not authenticated, instruct the user to run `clickraft login`.

2. A valid brand-model slug. If the user has not named one, list available models first:

   ```bash
   clickraft brand-model list --json
   ```

   Pick a slug from `data.items[].slug`. If unsure which model fits, ask the user or default to the model they previously used.

## Invocation pattern

Always pass `--json` so the response is parseable. Default mode waits for completion (up to 120s):

```bash
clickraft generate create \
  --json \
  --model-slug <slug> \
  --prompt "<user's prompt>"
```

**Optional flags** (only pass when the user explicitly requests):

| Flag | Use |
|---|---|
| `--aspect-ratio <W:H>` | e.g. `16:9`, `1:1` |
| `--resolution <WxH>` | e.g. `1024x1024` |
| `--reference-image-url <url>` | Single reference image |
| `--reference-image <url>` | Repeatable, up to 8 (multi-reference) |

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
    "creditsCharged": 25
  },
  "error": null,
  "meta": { "request_id": "...", "command": "generate create", "duration_ms": 8412 }
}
```

Read the final image URL from `data.resultUrl`. `data.thumbnailUrl` is faster to display. Both URLs are GCS-signed and stable for the asset's lifetime. Full envelope reference: `docs/ENVELOPE.md` in the [clickraft/skills](https://github.com/clickraft/skills/blob/main/docs/ENVELOPE.md) repo.

## Async pattern

If the user wants a job ID without waiting:

```bash
clickraft generate create --json --no-wait --model-slug <slug> --prompt "..."
```

Response has `data.status = "queued"` and `data.resultUrl = null`. Resume later with `clickraft generate wait <jobId> --json` (long-poll) or `clickraft generate get <jobId> --json` (single-shot).

## Cost handling

Default: submit without pre-estimating. Quality first.

Surface cost ONLY when:

1. **User asks.** TODO — once `clickraft generate cost` ships, run
   `clickraft generate cost --model-slug <slug> --prompt "..." --json` and
   quote the estimated credits. Until then, tell the user cost-estimation is
   coming soon and proceed with the request.
2. **High-cost configuration.** Resolution ≥ 4k or any high-quality flag → say
   "this will use ~N credits" before submitting. Don't ask — just inform.
3. **Insufficient balance.** On `E_INSUFFICIENT_CREDITS`, tell the user the
   exact gap and link to billing.

Do NOT pre-check balance every call (latency tax). Trust the server's `E_INSUFFICIENT_CREDITS` and handle in the error path. Do NOT downgrade models silently — switching behind the user's back is worse than running out.

## Error handling

On failure the envelope returns `ok: false` and the exit code is non-zero. Top error codes for this skill:

| `error.code` | What to do |
|---|---|
| `E_AUTH_TOKEN_MISSING` / `E_AUTH_TOKEN_EXPIRED` | Tell the user to run `clickraft login`. Do not retry. |
| `E_INSUFFICIENT_CREDITS` | Tell the user their account is out of credits + link to billing. Do not retry. |
| `E_RATE_LIMITED` | Wait `error.retry_after_ms` (default 1000 if unset) and retry once. |
| `E_MODEL_NOT_FOUND` | Re-list models with `clickraft brand-model list` and pick a different slug. |
| `E_GEN_CONTENT_REFUSAL` | The model refused the prompt for safety. Ask the user to rephrase. |

Full envelope + exit-code + error-code reference: [docs/ENVELOPE.md on GitHub](https://github.com/clickraft/skills/blob/main/docs/ENVELOPE.md).

## Compatibility

Requires `@clickraft/cli` `>= 0.1.2`. The CLI's `compatibility.json` declares the minimum skills version it supports; this skill's behaviour is locked against CLI `0.1.2` envelope semantics.
