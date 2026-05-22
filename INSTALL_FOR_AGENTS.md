# Install instructions for AI coding agents

This file is read by AI coding agents to autonomously install and configure the Clickraft skills.

## Installation steps

1. Verify the Clickraft CLI is installed:

   ```bash
   clickraft --version
   ```

   If not installed:

   ```bash
   npm install -g @clickraft/cli
   ```

2. Authenticate the CLI (interactive — the user completes a browser device-flow):

   ```bash
   clickraft login
   ```

3. Verify authentication:

   ```bash
   clickraft tokens list
   ```

4. The agent can now use the skills in `plugins/clickraft/skills/`.

## Skill discovery

Skills are markdown files under `plugins/clickraft/skills/<skill-name>/SKILL.md`. Each starts with a YAML frontmatter block (`name`, `description`, optional `version`) describing when the agent should use it. Use `description` trigger phrases to decide whether to load a skill.

## CLI version compatibility

Read `compatibility.json` for the required CLI version range. If the user's CLI is below `min_cli_version`, prompt them to upgrade:

```bash
npm install -g @clickraft/cli@latest
```

## JSON mode and error handling

The Clickraft CLI emits a unified envelope when invoked with `--json`. Use `--json` for all programmatic invocations:

```bash
clickraft generate create --json --model-slug <slug> --prompt "<prompt>"
```

**Envelope shape:**

```json
{
  "ok": true,
  "data": { "...command-specific..." },
  "error": null,
  "meta": { "request_id": "...", "command": "...", "version": "...", "duration_ms": 0 }
}
```

On failure:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "E_*",
    "message": "...",
    "retryable": false,
    "retry_after_ms": null,
    "request_id": "..."
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

Common error codes:

| `error.code` | Likely cause | Fix |
|---|---|---|
| `E_AUTH_TOKEN_MISSING` | Not logged in | `clickraft login` |
| `E_AUTH_TOKEN_EXPIRED` | 90-day token expired | `clickraft login` (re-issues) |
| `E_AUTH_TOKEN_INVALID` | Token format / env prefix mismatch | `clickraft login` |
| `E_INSUFFICIENT_CREDITS` | Account out of credits | User must add credits at clickraft.ai |
| `E_RATE_LIMITED` | Server rate-limited the request | Wait `error.retry_after_ms` then retry |
| `E_MODEL_NOT_FOUND` | Unknown `modelSlug` | List models with `clickraft brand-model list` |
| `E_INPUT_INVALID_FORMAT` | Bad flag value | Fix the input per `error.message` |

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
