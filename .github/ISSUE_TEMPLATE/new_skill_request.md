---
name: New skill request
about: Propose a new top-level skill (not an addition to an existing one)
title: "feat: new skill — "
labels: enhancement, new-skill
assignees: ""
---

## Proposed name

`<skill-name>`

<!-- kebab-case, must match the directory name. The plugin prefix is implicit (we live under `plugins/clickraft/skills/`). -->

## What it does

<!-- One paragraph. -->

## Use-when triggers

<!-- 6–12 phrases the user might say that should activate this skill. These end up in SKILL.md frontmatter as embedded prose. -->

- "..."
- "..."
- "..."

## Chain rules

- **Chain with:** <!-- which existing skills does this work alongside, if any -->
- **NOT for:** <!-- what the agent should NOT pick this skill for; point them at the right skill instead -->

## Why this is a separate skill, not an addition to an existing one

<!-- Critical. If it fits inside an existing skill, it should. -->

## Backing CLI command

<!-- e.g. `clickraft <noun> <verb>`. If the command doesn't exist yet in @clickraft/cli, link to the CLI issue/PR that adds it. -->

## Sketch of the SKILL.md

```yaml
---
version: 0.2.0
name: <skill-name>
description: |
  <one-paragraph elevator pitch>

  Use when: "...", "...", "..."
  NOT for: ... (use ... instead).
  Chain with: ... (or "none in Wave 1").
argument-hint: "[arg] [--flag <value>]"
allowed-tools: Bash(clickraft:*)
---
```
