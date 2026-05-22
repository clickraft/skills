# Clickraft Skills

Skills for AI coding agents — teach Claude Code, Cursor, Codex, and other agents how to use the [Clickraft CLI](https://github.com/clickraft/cli) to generate images, manage assets, and author visual workflows.

## Install for your agent

### Claude Code

```bash
/plugin install clickraft/skills
```

Or via the marketplace UI: search "Clickraft" in the plugins directory.

### Cursor

```bash
cursor plugin add clickraft/skills
```

### Codex

```bash
codex plugin install clickraft/skills
```

### Other agents

This repo follows the standard markdown SKILL.md format. Most agent ecosystems can consume it via:

```bash
npx skills add clickraft/skills
```

## What's included

| Skill | What it teaches the agent |
|---|---|
| `plugins/clickraft/skills/generate-image/SKILL.md` | How to call `clickraft generate create` with a model slug and prompt, with async-vs-sync behavior and error handling |

More skills land as we learn what agents need most.

## Requirements

- Clickraft CLI version 0.1.0 or later (see [`compatibility.json`](./compatibility.json))
- Install the CLI: `npm install -g @clickraft/cli`
- Authenticate: `clickraft login`

## Updates

The CLI checks once per 24 hours for new tags on this repo. When updates are available, it prints a notice to stderr. Run `clickraft skills update` to install.

## License

MIT — see [LICENSE](./LICENSE)
