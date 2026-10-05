---
version: 0.5.1
name: production-recipe
description: |
  Build a production Recipe with the Clickraft CLI: a reusable catalog-shoot style
  (product and model slots, the photos to take, styling, scene) that Clickraft applies to
  many products. Reads the schema and the catalog, writes the Recipe as JSON, creates a
  draft, has Clickraft plan the photos, and hands the user the link where they approve
  the images and save it.

  Use when: "build me a Recipe", "create a Recipe in this style", "a shoot style for my
  catalog", "product-page photos for every product", "front, back and detail shots",
  "PDP style", "make a Recipe like my summer one", "change my Recipe draft", "plan the
  photos". Use it whenever the user wants one repeatable look for many products, even if
  they never say "Recipe".

  NOT for: a single one-off image (use `generate-image`), a workflow graph (use
  `clickraft-workflow-authoring`), or making the Recipe's images and running a
  production — those happen in Clickraft after the hand-over.
argument-hint: "[style brief] [--draft <uuid>]"
allowed-tools: Bash(clickraft:*), Write, Read
---

# Build a production Recipe with the Clickraft CLI

A **Recipe** is a reusable shoot style: which product and model **slots** a look has, the
**photos** to take (front, back, detail…), the styling, the scene and the aspect ratio.
Once saved in Clickraft, it is applied to many products in a production.

The division of work is fixed:

- **You** write the Recipe as JSON, create a **draft**, and have Clickraft plan its photos.
- **The user** opens the draft's link in Clickraft, approves the sample images, saves the
  Recipe, and continues to Products there. No command approves images or saves a Recipe,
  and none makes images or runs a production. Do not promise any of that from the CLI.

So every run of this skill ends with the draft's `webUrl` in your reply.

## The method

1. **Read the contract**: `clickraft recipe schema --json`. Everything you need is in
   `data`: `schemas.recipe` (JSON Schema), `rules` (what the schema cannot express),
   `vocabulary` (views, aspect ratios, this organization's `facets`, `products` and
   `models` with their ids) and `example` (a valid recipe). Never hardcode ids or facet
   values; take them from here.
2. **Look at what exists** when the user refers to it ("like my summer Recipe"):
   `clickraft recipe list --json`, then `clickraft recipe get <id> --json` and start from
   its `data.recipe`.
3. **Write the request file** (Write tool): `{ "recipe": {...}, "bindings": {...} }`.
   Start from `data.example.recipe` or the Recipe you read, and change it to the brief.
   Field guide and worked examples: [references/recipe-format.md](references/recipe-format.md).
4. **Create the draft**: `clickraft recipe draft create --file recipe.json --idempotency-key <key> --json`.
   Creating calls no model and charges nothing. Keep `data.id` and `data.webUrl`. Every
   write returns the draft's new `data.revision`, and a plan counts as a write: always
   pass the latest revision to the next command.
5. **Fix any refusal and create again**. A refused create stores nothing (see "Errors").
6. **Plan the photos** when the hero product and the model are bound:
   `clickraft recipe draft plan <id> --revision <n> --idempotency-key <key> --json`.
   This uses the organization's **Utility Units** (its AI allowance), not credits. Do not
   ask first; say it in the reply that reports the plan. It usually takes seconds and can
   take a few minutes.
   Give the command a long timeout (up to 5 minutes) or run it in the background; do not
   let a short tool timeout kill it.
7. **Report and hand over**: a short summary of the Recipe (photos, styling, scene), each
   planned photo's framing from `data.plan.shots[]`, the example product and model you
   bound, then the link, in the user's language: "Open it in Clickraft to approve the
   images and save the Recipe: `<webUrl>`".

## Bindings: the example the images are made with

`bindings` maps every slot key to an id, or `null`. They are only the example used for
the Recipe's sample images: the user can change them in Clickraft, and picks the real
products later, in the production.

- **Take ids only from `vocabulary.products` and `vocabulary.models`.** That is exactly
  what the server accepts. Do not bind an id found with `product list`: it also returns
  products the Recipe catalog leaves out (such as `sourceType: "system"` copies), and the
  server refuses those.
- **Products: decide, do not ask.** Match the brief against `vocabulary.products[].title`
  and bind the best fit. When several fit equally ("my linen shirts"), pick one: any of
  them is a valid example. Say which one you picked.
- **The model: ask unless you know.** `vocabulary.models[]` has only a `name` and an
  `imageUrl`, so you cannot see who fits the brief, and a name says nothing reliable about
  a person. Bind the model the user named, or the one in `exampleBindings` of a Recipe
  they pointed you to. Otherwise ask one question before creating: 3–4 names, plus
  "choose in Clickraft" (which leaves `model` as `null`).
- If you send `bindings`, include every slot key. Omit `bindings` and every slot starts
  `null`. One product cannot fill two slots.
- Planning needs the hero **and** the model bound. If either is `null`, skip step 6 and
  hand over the link: the user binds them in Clickraft, and planning starts there.

Leave every slot's `constraint` as `null` unless the user asks to limit a slot to a kind
of product **and** some `vocabulary.products[].facetValues` carry that value. Many
catalogs are untagged (`facetValues: {}`), and a constrained slot then accepts no product
at all.

## Changing an existing draft

1. `clickraft recipe draft get <id> --json` for the current `data.revision`. Never reuse
   a revision from earlier in the conversation; the user may have edited the draft in the
   browser since.
2. Write a file with only what changes: any of `recipe`, `bindings`, `runChoices`. The
   revision goes on the command line, never in the file:
   `clickraft recipe draft update <id> --revision <n> --file change.json --idempotency-key <key> --json`.
3. On `E_RECIPE_DRAFT_CONFLICT` (exit 7), read the draft again and re-apply your change
   to the new version. The person's edits win; never overwrite them blindly.

A change to what a photo shows (a binding, the scene, a photo's description) makes the
plan `stale`. Re-plan before handing over. A rename keeps the plan `current`.

To redo one photo's plan from the user's feedback:
`clickraft recipe draft plan <id> --revision <n> --shot <key> --feedback "<what to change>" --json`.
Re-plan only when the user asks for a change. Do not re-plan in a loop to polish.

## Idempotency keys: retry without doing it twice

Pass `--idempotency-key` on create, update and plan, with one fresh value per intended
change (for example `recipe-<slug>-create-1`). If the command fails without an answer
(timeout, network error, or a message saying the request may still have completed),
**re-run it with the same key**: you get the original result instead of a second draft or
a second plan. Use a new key only for a new, different change. The CLI never retries a
plan on its own; that decision is yours.

## UX rules

1. Be concise. No JSON dumps or raw ids beyond the draft link. Summarize the Recipe in a
   few lines.
2. Reply in the user's language. Write every recipe field in English except `name`,
   because Clickraft's photo director reads them. The `name` may follow the user's
   language.
3. Describe looks in visible terms: light, background, pose, framing, crop. Do not name
   brands the user does not sell.
4. Default to acting. A draft is free: create it, show it, adjust it. Ask only for a
   genuinely missing choice (see "Bindings").

## Response envelope

Draft commands (`create`, `get`, `update`, `plan`) return the draft in `data`:

| Field | Meaning |
| --- | --- |
| `id`, `revision` | The draft and the revision every change must name |
| `recipe`, `bindings`, `runChoices` | What the draft holds now |
| `plan.status` | `none`, `current` or `stale` |
| `plan.shots[]` | `key`, `view`, `summary`, `framing` per planned photo; `summary` and `framing` may be `null`. The prompts stay on the server. |
| `images.status`, `images.frames[]` | Sample images, made in Clickraft after the hand-over |
| `openQuestions[]` | Questions from a draft started in the browser |
| `webUrl` | The link the user opens to approve and save |

`recipe list` returns `data.items[]` (`id`, `name`, `version`, `shots[]`).
`recipe get` adds `recipe`, `exampleBindings`, `webUrl` (continue to Products with it)
and `editUrl` (the draft it was saved from). A draft appears in `recipe list` only after
the user saves it.

## Errors

| `error.code` | What to do |
| --- | --- |
| `E_INPUT_INVALID_FORMAT` | The file breaks the schema. `error.details.issues[]` gives `path` and `message` per field: fix those fields and create again. |
| `E_RECIPE_INVALID` | Valid JSON that does not fit this organization (unknown facet or value, a product or model not in the catalog, a slot rule, or planning without a bound hero and model). The message names the rule. Fix it from `recipe schema`. |
| `E_RECIPE_DRAFT_CONFLICT` | The draft changed since you read it. Get it again and re-apply (see above). |
| `E_IDEMPOTENCY_IN_PROGRESS` | The same request is still running (often a plan). Wait a minute, then `recipe draft get` (`plan.status` becomes `current`) or re-run with the same key. |
| `E_PLAN_FEATURE_LOCKED` | The account's subscription lacks API access, or its Utility-Unit allowance for planning is used up. Tell the user. Do not retry. |
| `E_AUTH_TOKEN_SCOPE_INSUFFICIENT` | The token predates the Recipe scopes. Tell the user to run `clickraft login --force-reauth`. |
| `E_NOT_FOUND` "Recipes are not enabled on this deployment yet" | The feature is off on this server. Tell the user and stop. |
| `E_NOT_FOUND` otherwise | Wrong id. Drafts and Recipes are visible only to the user who created them. |
| `E_RATE_LIMITED` | Wait `error.retry_after_ms` and retry once with the same key. |

Exit codes: 0 success, 1 server or runtime, 2 your input, 3 not logged in, 4 permission or subscription, 5 rate limit, 6 network, 7 conflict.

## Compatibility

Needs a `@clickraft/cli` release that ships the `recipe` commands (after 0.17.0). Check
with `clickraft recipe --help`. If the CLI answers `Unknown command`, tell the user to
update it (`npm install -g @clickraft/cli@latest`), then `clickraft login --force-reauth`
so the token carries the `recipes:read` and `recipes:write` scopes.
