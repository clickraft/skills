# Install for agents

A 5-step runbook for AI coding agents to install Clickraft Skills autonomously. Follow these steps in order; stop and surface to the user only at step 5.

## 1. Detect host

| Agent | Install directory |
|---|---|
| Claude Code | `~/.claude/skills/` |
| Cursor | `~/.cursor/plugins/` |
| Codex | `~/.codex/plugins/` |
| Other | `~/.<agent>/skills/` |

If the host is unknown, default to `npx skills add clickraft/skills` — it writes to the right location for whichever agent is invoking it.

## 2. Verify CLI

```bash
clickraft --version
```

Must report `>= 0.1.2`. If the command is missing or out of date, go to step 3.

## 3. Install CLI if missing

```bash
npm install -g @clickraft/cli
```

## 4. Authenticate

```bash
clickraft login
```

This launches an interactive browser device flow. The user completes the OAuth handshake; the CLI stores a 90-day token. To confirm:

```bash
clickraft tokens list
```

## 5. Confirm + starter prompts

Tell the user install is complete and offer three starter prompts they can try:

- "Generate a hero image of a coffee mug on a wooden table"
- "Make a product photo of these sneakers on a white background"
- "Generate an image using my brand model"

Do NOT explain internals (skill file paths, JSON envelopes, error codes). Just confirm install + give starter prompts. The envelope and error-code reference live at [docs/ENVELOPE.md](./docs/ENVELOPE.md) for when an agent hits a failure path.
