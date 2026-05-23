# Install Clickraft Skills

How to install Clickraft Skills into your AI coding agent and verify it works.

## Install

Pick whichever path matches the agent you use.

### 1. `npx skills` — cross-agent, recommended

Works for Claude Code, Cursor, Codex, and any agent that respects the standard `~/.<agent>/skills/` layout. Single command, no marketplace UI:

```bash
npx skills add clickraft/skills
```

### 2. Claude Code marketplace

Add the marketplace, then install the plugin:

```bash
/plugin marketplace add clickraft/skills
/plugin install clickraft
```

### 3. Cursor

```bash
cursor plugin add clickraft/skills
```

### 4. Codex

```bash
codex plugin install clickraft/skills
```

## Verify

Paste this into the agent you just installed into:

```
Generate a simple image of a coffee mug on a table.
```

Expected outcome: the agent runs `clickraft generate create --json --model-slug <slug> --prompt "..."` and surfaces a GCS-signed image URL. If the agent asks you to run `clickraft login` or `clickraft brand-model list`, follow the prompts — that's normal first-run setup.

## Update

| Install method | Update command |
|---|---|
| `npx skills` | re-run `npx skills add clickraft/skills` |
| Claude Code marketplace | `/plugin update clickraft@clickraft` |
| Cursor | `cursor plugin update clickraft` |
| Codex | `codex plugin update clickraft` |

The Clickraft CLI also checks once per 24 hours for new tags on this repo and prints a notice to stderr when an update is available. Run `clickraft skills update` to apply.

## Uninstall

| Install method | Uninstall command |
|---|---|
| `npx skills` | `npx skills remove clickraft/skills` |
| Claude Code marketplace | `/plugin uninstall clickraft` |
| Cursor | `cursor plugin remove clickraft` |
| Codex | `codex plugin uninstall clickraft` |

## Requirements

- [Clickraft CLI](https://github.com/clickraft/cli) `>= 0.1.2` — `npm install -g @clickraft/cli`
- `clickraft login` completed (browser device flow)
- One brand-model slug from `clickraft brand-model list --json`

If the CLI is out of date, your agent will surface `E_*` errors with retry guidance — see [docs/ENVELOPE.md](https://github.com/clickraft/skills/blob/main/docs/ENVELOPE.md).
