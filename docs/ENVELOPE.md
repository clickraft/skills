# JSON envelope and error codes

Wave 1 of the Clickraft CLI emits a unified JSON envelope when invoked with `--json`. The canonical source-of-truth is the CLI repo at [github.com/clickraft/cli](https://github.com/clickraft/cli) — this file mirrors that contract for agents and skill authors. If the two ever drift, the CLI wins.

## Envelope shape

**Success:**

```json
{
  "ok": true,
  "data": { "...command-specific..." },
  "error": null,
  "meta": {
    "request_id": "req_...",
    "command": "generate create",
    "version": "0.1.2",
    "duration_ms": 8412
  }
}
```

**Failure:**

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "E_*",
    "message": "...",
    "retryable": false,
    "retry_after_ms": null,
    "request_id": "req_..."
  },
  "meta": { "...": "..." }
}
```

Dispatch on `ok` (cheap boolean). When `error.retryable` is `true` and `error.retry_after_ms` is set, wait that many ms before retrying.

## Exit codes

| Exit | Meaning |
|---|---|
| 0 | Success |
| 1 | Runtime / API / internal error |
| 2 | Usage / validation (client-side) |
| 3 | Auth required or expired |
| 4 | Permission / policy denial |
| 5 | Rate limit / quota / insufficient credits |
| 6 | Network / timeout |
| 7 | Conflict / idempotency mismatch |
| 130 | SIGINT (user pressed Ctrl-C) |

Prefer `error.code` for dispatch; use the exit code as a fast pre-check.

## Error codes

| `error.code` | Likely cause | Fix |
|---|---|---|
| `E_AUTH_TOKEN_MISSING` | Not logged in | `clickraft login` |
| `E_AUTH_TOKEN_EXPIRED` | 90-day token expired | `clickraft login` (re-issues) |
| `E_AUTH_TOKEN_INVALID` | Token format / env prefix mismatch | `clickraft login` |
| `E_INSUFFICIENT_CREDITS` | Account out of credits | User must add credits at clickraft.ai |
| `E_RATE_LIMITED` | Server rate-limited the request | Wait `error.retry_after_ms` then retry |
| `E_MODEL_NOT_FOUND` | Unknown `modelSlug` | List models with `clickraft brand-model list` |
| `E_INPUT_INVALID_FORMAT` | Bad flag value | Fix the input per `error.message` |
| `E_INPUT_TOO_LONG` | Input over the model's limit | Trim or summarize |
| `E_PROVIDER_UNAVAILABLE` | Upstream provider down | Retry after a short delay if `retryable` is true |
| `E_GEN_CONTENT_REFUSAL` | Model refused the prompt for safety | Ask the user to rephrase |

## Telemetry

The CLI defaults telemetry OFF in non-interactive / CI / agent-detected contexts. To inspect what would be sent:

```bash
clickraft telemetry inspect --json
```

To force-disable:

```bash
export CLICKRAFT_DISABLE_TELEMETRY=1
```

`DO_NOT_TRACK=1` is also honored.
