---
name: generate-image
description: This skill should be used when the user asks to generate, create, render, or make an image using Clickraft. Use it to invoke the Clickraft CLI's `generate create` command against a specific brand model with a text prompt and to read the resulting image URL from the JSON envelope.
---

# Generate an image with the Clickraft CLI

## When to use this skill

Use this skill when the user asks to:

- Generate an image
- Create an image
- Render an image from a prompt
- Make an image with a specific brand model

Do **not** use this skill for:

- Editing an existing image (future skill)
- Generating multiple images in one call (future batch skill)
- Generating video (future video skill)
- Uploading user-provided images (separate `upload` skill)

## Prerequisites

1. The Clickraft CLI must be installed and the user must be logged in:

   ```bash
   clickraft --version       # must report >= 0.1.0
   clickraft tokens list     # must return at least one active token
   ```

   If not authenticated, instruct the user to run `clickraft login`.

2. A valid brand-model slug is required. If the user has not named one, list available models first:

   ```bash
   clickraft brand-model list --json
   ```

   Pick a slug from `data.items[].slug`. If you do not know which model fits, ask the user or default to a stable image model the user has previously used.

## Invocation pattern (default: wait for completion)

Always pass `--json` so the response is parseable:

```bash
clickraft generate create \
  --json \
  --model-slug <slug> \
  --prompt "<user's prompt>"
```

The CLI waits up to 120 seconds for completion by default and then prints the final result to stdout.

**Optional flags** (only pass when the user explicitly requests):

- `--aspect-ratio <W:H>` — e.g. `16:9`, `1:1`
- `--resolution <WxH>` — e.g. `1024x1024`
- `--reference-image-url <url>` — single reference image
- `--reference-image <url>` (repeatable, up to 8) — multi-image reference
- `--duration-seconds <n>` — for video models (1-60)

## Response envelope

On success the CLI prints to stdout:

```json
{
  "ok": true,
  "data": {
    "jobId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "status": "completed",
    "modelSlug": "...",
    "resultUrl": "https://...",
    "thumbnailUrl": "https://...",
    "errorCode": null,
    "errorMessage": null,
    "creditsCharged": 25,
    "creditsRefunded": false,
    "startedAt": "2026-05-22T12:00:00.000Z",
    "completedAt": "2026-05-22T12:00:08.412Z"
  },
  "error": null,
  "meta": {
    "request_id": "req_...",
    "command": "generate create",
    "version": "0.1.0",
    "duration_ms": 8412
  }
}
```

Read the final image URL from `data.resultUrl`. The thumbnail (smaller, faster to display) is at `data.thumbnailUrl`. Both URLs are GCS-signed and stable for the asset's lifetime.

## Async pattern (return immediately)

If the user wants a job ID without waiting (e.g. they will check back later or are queueing many requests):

```bash
clickraft generate create --json --no-wait --model-slug <slug> --prompt "..."
```

The response will have `data.status = "queued"` and `data.resultUrl = null`. Then resume later:

```bash
clickraft generate wait <jobId> --json
```

`wait` long-polls until terminal (`completed`, `failed`, or `cancelled`).

To poll without blocking, use `generate get` instead:

```bash
clickraft generate get <jobId> --json
```

## Error handling

On failure the envelope returns `ok: false` and the exit code is non-zero. Parse:

- `error.code` — stable `E_*` identifier (public API)
- `error.message` — human-readable
- `error.retryable` — boolean
- `error.retry_after_ms` — present for rate-limit / transient errors

| `error.code` | What to do |
|---|---|
| `E_AUTH_TOKEN_MISSING` / `E_AUTH_TOKEN_EXPIRED` | Tell the user to run `clickraft login`. Do not retry. |
| `E_INSUFFICIENT_CREDITS` | Tell the user their account is out of credits. Do not retry. |
| `E_RATE_LIMITED` | Wait `error.retry_after_ms` (default 1000 if unset) and retry once. |
| `E_MODEL_NOT_FOUND` | Re-list models with `clickraft brand-model list` and pick a different slug. |
| `E_INPUT_INVALID_FORMAT` / `E_INPUT_TOO_LONG` | Fix the input per `error.message`. Do not retry blindly. |
| `E_PROVIDER_UNAVAILABLE` | Upstream provider is down. Retry after a short delay if `retryable` is true. |
| `E_GEN_CONTENT_REFUSAL` | The model refused the prompt for safety. Ask the user to rephrase. |

Exit codes follow a sparse scheme: `0` ok, `1` runtime, `2` validation, `3` auth, `4` permission, `5` rate-limit/quota, `6` network, `7` conflict, `130` SIGINT. Prefer `error.code` for dispatch; use the exit code as a fast pre-check.

## Compatibility

Requires `@clickraft/cli` `>= 0.1.0`. The CLI's `compatibility.json` declares the minimum skills version it supports; this skill's behaviour is locked against CLI `0.1.0` envelope semantics.
