## What

<!-- One-sentence description of what this PR changes. -->

## Why

<!-- The problem this PR solves or the capability it adds. -->

## Changes

<!-- Bullet list of concrete changes. -->

-
-

## Type

- [ ] `feat` — new skill or new behavior in an existing skill
- [ ] `fix` — bug in an existing skill or manifest
- [ ] `docs` — README, INSTALL, CHANGELOG, contributing docs
- [ ] `refactor` — re-shuffle without behavior change
- [ ] `chore` — version bumps, housekeeping
- [ ] `ci` — workflow / tooling changes

## Testing

<!-- How did you verify this works? Did you run the CLI commands in the SKILL.md? Did you trigger the skill from at least one agent? -->

## PR checklist

- [ ] Frontmatter is valid (`name` matches dir; `version` present; description has `Use when:` and `NOT for:`; ≤ 1024 chars).
- [ ] Versions sync across VERSION, every SKILL.md, every `plugin.json`, every `marketplace.json`, `compatibility.json`.
- [ ] Every skill folder is reachable from at least one `marketplace.json`.
- [ ] Every `references/X.md` link resolves. No orphan `references/` files.
- [ ] No `../` parent-dir references in any SKILL.md or `references/` file.
- [ ] UX rules weren't loosened (or the PR description explains why).
- [ ] Every `clickraft …` example was run locally against the pinned CLI version.
- [ ] CHANGELOG.md updated if behavior changed.

## Breaking changes

<!-- Any behavior the agent will do differently after this PR ships. If none, write "None". -->
