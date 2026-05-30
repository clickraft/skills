---
version: 0.4.2
name: clickraft-workflow-authoring
description: |
  Author a multi-node Clickraft workflow graph from a natural-language request. Creates a
  workflow, adds typed nodes, wires them with correctly shaped edges, and applies the batch
  with `clickraft workflow apply` under the canvas-rev concurrency protocol.

  Use when: "build a workflow", "create a workflow", "set up a pipeline/graph", "wire these
  nodes", "make a workflow that does X then Y", "automate this as a workflow", "add a node",
  "connect these nodes", "remove a node/edge", "edit my workflow graph", "add another
  generation step".

  NOT for: a single one-shot generation (use `generate-image`), running/executing an
  existing workflow to produce outputs, or editing an existing image. Pairs with
  `generate-image` for the single-shot case.
argument-hint: "[request] [--workflow-id <uuid>]"
allowed-tools: Bash(clickraft:*), Write
---

# Author a Clickraft workflow with the CLI

A workflow is a graph of **typed nodes** connected by **typed edges**. You build it by
applying a batch of mutation operations to a workflow's canvas. The op schema and the edge
shape you must emit are **not** in `--help` — they are carried here. Everything else (which
node types exist, their ports, their writable fields, which models exist) is **discoverable
from the CLI** — query it, never hardcode it.

## The method

1. **Discover** the building blocks (the CLI is the source of truth; see "Discovery").
2. **Decide** the topology. Default to acting; ask one labeled-options question only if
   genuinely ambiguous (see "When to ask").
3. **Create** an empty workflow: `clickraft workflow create --name "<name>" --json`.
   A fresh workflow starts at `canvas_rev: 0`.
4. **Build one op batch** — `add_node` for each node, `add_edge` for each connection,
   `update_node` to set fields. 1–100 ops per batch.
5. **Apply** with `--auto-rev`: `clickraft workflow apply <id> --from-file ops.json --auto-rev --json`.

Then report what you built and what the user must finish in the canvas (see "Source content").

## Discovery (always; do not hardcode)

```bash
clickraft nodes list --json                 # available node TYPE strings (+ port counts)
clickraft nodes describe <type> --json       # ports (handleId, direction, dataType) + agentWritableFields
clickraft models list --json                 # model slugs, modality, cost — for the `model` field
```

`nodes describe` is the contract for a node: it tells you the exact `handleId`s to use in
edges, the port directions, the port `dataType`s, and which `data.*` fields you may write.
Always describe a node type before you wire or configure it. The node `type` string is what
`nodes list` returns (e.g. `imageGeneration`) — never a directory name or a guess.

## The op batch (carried — absent from `--help`)

Six ops, discriminated by `op` (snake_case). Full field schema, casing rules, and the
verbatim source: **`references/op-schema.md`**. The shapes you will use most:

```jsonc
// add a node — canonical React Flow shape only
{ "op": "add_node", "node": {
    "id": "gen1", "type": "imageGeneration",
    "position": { "x": 460, "y": 160 },
    "data": { "aspectRatio": "4:5", "batchCount": 5 }   // only agentWritableFields (+ label/hideHeader)
}}

// connect two nodes — WRITE shape: from/to with node + port handle id
{ "op": "add_edge", "edge": {
    "id": "e1",
    "from": { "node": "txt1", "output": "text-output"  },   // SOURCE node id + its OUTPUT handleId
    "to":   { "node": "gen1", "input":  "prompt-input" }     // TARGET node id + its INPUT  handleId
}}

// change a field on an existing node
{ "op": "update_node", "node_id": "gen1", "patch": { "data": { "batchCount": 3 } } }

{ "op": "remove_node", "node_id": "gen1" }
{ "op": "remove_edge", "edge_id": "e1" }
{ "op": "update_meta", "patch": { "name": "New name", "description": "..." } }
```

Identifier casing: `node_id`, `edge_id`, `canvas_rev` are snake_case; the id inside an
`add_node`/`add_edge` lives at `node.id` / `edge.id`. **Canonical only** — never send the
deprecated `title` / `config` / `ui` aliases, and never send a canonical key and its alias
on the same op (→ `CANONICAL_ALIAS_CONFLICT`).

You can pass ops as a JSON array via `--from-file ops.json`, or one at a time with repeated
`--op '<json>'`. With `--auto-rev` the file is just the bare ops array (no `canvas_rev`).

## Wiring rule

Connect an **output** handle to a compatible **input** handle, matching `dataType`
(text→text, image→image). The handle ids come from `nodes describe`. Canonical example,
text into a generator:

```
textPrompt.text-output (output, text)  →  imageGeneration.prompt-input (input, text)
```

The generated image is then read off `imageGeneration.image-output`.

## Source nodes vs generation nodes

Some nodes are **pure sources** — output only, no input. The `image` node is one:
`nodes describe image` shows a single `image-output` port and **no input**. You cannot wire
*into* an `image` node. A **generation** node like `imageGeneration` takes inputs
(`prompt-input` text, `reference-images` image) and emits `image-output`. Check
`nodes describe` for direction before wiring; the server rejects an edge whose endpoints
aren't a real output→input pair. Direction **and** `dataType` are both enforced — a text
output can't feed an image input even where an input port exists.

## Source content (what you cannot set — be honest)

You may write only a node's `agentWritableFields` plus the two base fields `label` and
`hideHeader`. Anything else is rejected (see "Errors"). In particular, the `image` node's
`imageUrl` is **not** agent-writable (`agentWritableFields: []`). So when a user says "I'll
upload a reference image," you build the `image` source node and wire it, but **the user
attaches the actual image in the canvas** (the node's "Replace image" action). Build the
scaffold; tell the user to drop their image onto the Image node. Do not try to set
`imageUrl` — it fails the whole batch.

## canvas_rev flow

Every apply is preconditioned on the current `canvas_rev` (optimistic concurrency).

- Prefer **`--auto-rev`**: it fetches the current rev first and retries once on conflict.
- `apply` returns the new rev as **`data.canvasRev`** (camelCase) plus `data.applied`
  (op count) and `data.workflow` (the updated graph, with **read-shape** edges).
- `workflow get` returns the rev as **`data.canvas_rev`** (snake_case) at the top level,
  plus `data.nodes` and `data.edges`.
- On a `409` / `E_CANVAS_REV_MISMATCH` (a collaborator edited the canvas): re-fetch with
  `workflow get`, rebuild against the new state, retry. `--auto-rev` does this once for you.
- **`--dry-run` is LOCAL ONLY** — it prints the payload and exits without contacting the
  server. It does **not** validate ops. The only real validation is a live `apply`.

## Edge WRITE shape vs READ shape (the #1 trap)

What you **write** in `add_edge` and what you **read** back are different shapes. Never copy
a read edge into an op.

| Concept     | WRITE (`add_edge`) | READ (`workflow get`, `apply` response) |
|-------------|--------------------|------------------------------------------|
| source node | `from.node`        | `source`                                 |
| source port | `from.output`      | `sourceHandle`                           |
| target node | `to.node`          | `target`                                 |
| target port | `to.input`         | `targetHandle`                           |

So `from:{node:"txt1",output:"text-output"}, to:{node:"gen1",input:"prompt-input"}` reads
back as `{source:"txt1", sourceHandle:"text-output", target:"gen1", targetHandle:"prompt-input"}`.
If you need to recreate an edge you read from `workflow get`, **translate** it back to the
`from/to` write shape — pasting `source/sourceHandle/target/targetHandle` into an `add_edge`
produces an edge with empty endpoints. When copying an edge from a *different* workflow, also
mint a fresh `edge.id` and remap the node ids to this workflow's ids — the foreign
`id`/`source`/`target` values don't exist here.

## Worked example — "upload a reference image → 5 Instagram ads"

```bash
# 1) discover (confirm handles & writable fields)
clickraft nodes describe image --json
clickraft nodes describe textPrompt --json
clickraft nodes describe imageGeneration --json

# 2) create the workflow
clickraft workflow create --name "Instagram Ads — <topic>" --json
# → data.id, data.canvas_rev: 0
```

Write the batch to a scratch file `ops.json` (3 nodes + 2 edges); delete it after applying.
`batchCount: 5` is how one generation node produces five images; `4:5` is the default for IG
feed ads:

```json
[
  { "op": "add_node", "node": { "id": "ref",  "type": "image",
      "position": { "x": 0, "y": 0 } } },
  { "op": "add_node", "node": { "id": "copy", "type": "textPrompt",
      "position": { "x": 0, "y": 320 },
      "data": { "prompt": "<the ad concept: subject, scene, mood, lighting>" } } },
  { "op": "add_node", "node": { "id": "gen",  "type": "imageGeneration",
      "position": { "x": 460, "y": 160 },
      "data": { "aspectRatio": "4:5", "batchCount": 5 } } },
  { "op": "add_edge", "edge": { "id": "e_ref",
      "from": { "node": "ref",  "output": "image-output" },
      "to":   { "node": "gen",  "input":  "reference-images" } } },
  { "op": "add_edge", "edge": { "id": "e_copy",
      "from": { "node": "copy", "output": "text-output" },
      "to":   { "node": "gen",  "input":  "prompt-input" } } }
]
```

```bash
# 3) apply
clickraft workflow apply <id> --from-file ops.json --auto-rev --json
# → data.applied: 5, data.canvasRev: 1
```

Close by telling the user: *"Built the workflow — drop your reference image onto the Image
node in the canvas, then run it to get 5 ads."* (The reference image is user-attached; see
"Source content".)

**Variations:** prefer a `textPrompt` node feeding `prompt-input` as shown (the prompt
becomes a visible, reusable canvas node). For the minimal case you can skip the `textPrompt`
node and set `prompt` directly in the `imageGeneration` node's `data` (`prompt` is one of its
writable fields). For five *distinct* ad concepts (not five variations of one), use five
generators / five prompts instead of `batchCount: 5` — ask which the user means if unclear.

## When to ask

Default: act with sensible defaults. Ask one labeled-options question ONLY when:

- The request is genuinely ambiguous in a way a default can't resolve. For "N ads", the
  act-first default is `batchCount: N` (N variations of one concept) — build that; ask only
  if the user signals N *distinct* concepts (which needs N generators / N prompts).
- A required input is missing and undefaultable.
- The requested capability may not exist (then verify against `nodes list` first).

Never ask about node positions, aspect ratio, or batch count when intent is clear — pick a
sensible default and build; the user re-runs with changes if needed.

## Aspect ratio for ads

Default ad output to **`4:5`** (IG feed). Use `9:16` for stories/reels, `1:1` if the user
says "square". This intentionally differs from the `generate-image` skill, which maps
"Instagram post" → `1:1` — ads (4:5) and posts (1:1) are different intents.

## Unsupported requests — never invent nodes

If a request needs a capability no node provides, do not fabricate a node type. Check
`clickraft nodes list`, tell the user honestly that there's no node for it, and list what
*is* available. Build only from real, discovered node types.

## UX rules

1. Be concise. No raw JSON dumps, no node-id soup. Report what you built in plain language
   and surface the workflow id / canvas link.
2. Detect the user's language and reply in it. CLI flags stay English; translate prompt
   intent (scene, style, mood) to English in the `prompt` field.
3. Don't batch-ask. One question max, only when genuinely needed.
4. Build the whole graph in one `apply` batch when you can — it's atomic and one round-trip.

## Errors

Always pass `--json`. On failure, `ok: false` and the exit code is non-zero. **Read
`error.details.diagnostics[]` for the per-op cause** — the top-level `error.code` is a
summary; the actionable detail (which op, which field) is in the diagnostics array.

| Where | Code | What to do |
|---|---|---|
| `error.code` | `E_WORKFLOW_VALIDATION_FAILED` | A batch op failed authorize/validate. Read `error.details.diagnostics[]` for the offending op + reason; fix and re-apply. |
| `diagnostics[].code` | `FIELD_NOT_ALLOWED` | You set a `data.*` field that isn't writable on that node type (e.g. `image.imageUrl`). Remove it; that content is user-set in the canvas. |
| `diagnostics[].code` | `CANONICAL_ALIAS_CONFLICT` | You sent a deprecated alias (`title`/`config`/`ui`) alongside its canonical key. Send canonical only. |
| `diagnostics[].code` | `INVALID_PARENT_REF` | `node.parentId` points at a missing node, or one that isn't a `frame`. Point it at a real `frame` id. |
| `diagnostics[].code` | `NESTED_GROUP_FORBIDDEN` | You parented a `frame` to another `frame`. Frames can't be nested. |
| `error.code` | `E_CANVAS_REV_MISMATCH` (409) | The canvas changed under you. Re-`workflow get`, rebuild, retry. `--auto-rev` retries once automatically. |
| `error.code` | `E_INPUT_INVALID_FORMAT` | Applied without a canvas rev. Add `--auto-rev` (or `--canvas-rev <n>`); the CLI rejects a missing rev client-side before it reaches the server. |
| `error.code` | `E_AUTH_TOKEN_MISSING` / `E_AUTH_TOKEN_EXPIRED` | Tell the user to run `clickraft login`. |

The validation-error hint may say "Run `workflow validate`" — **there is no such command**;
ignore that hint and read the `diagnostics` array instead.

Full envelope + exit-code + error-code reference: [docs/ENVELOPE.md on GitHub](https://github.com/clickraft/skills/blob/main/docs/ENVELOPE.md).

## Grouping: put a node inside a frame

To place a node inside a `frame`, add the frame (or reference an existing frame id) and add the
child with `parentId` in the **same batch**. `parentId` and `expandParent` are optional fields
on the **`node` object**, not on the op:

```json
[
  { "op": "add_node", "node": { "id": "grp", "type": "frame",
      "position": { "x": 2000, "y": 1500 } } },
  { "op": "add_node", "node": { "id": "gen", "type": "imageGeneration",
      "position": { "x": 2120, "y": 1590 },
      "parentId": "grp", "expandParent": false,
      "data": { "aspectRatio": "4:5" } } }
]
```

Rules the server enforces:

- `parentId` is the id of a **`frame`** node — already in the workflow, or added by an earlier
  op in the same batch (as above).
- Send the child's **absolute** canvas position. The server converts absolute → relative for
  you (child − frame origin); **never compute the relative offset yourself**.
- Set `expandParent: false` and **omit `extent`**. Frames **cannot be nested**.

A `parentId` pointing at a missing or non-`frame` node fails the batch with `INVALID_PARENT_REF`;
a `frame` parented to a `frame` fails with `NESTED_GROUP_FORBIDDEN` (422, nothing applied — see
`references/op-schema.md`).

## Templates and grouping

- **Templates are metadata-only via the CLI.** `clickraft template get` returns name,
  description, thumbnail, and declared params — **no nodes, no edges, no structure** — and
  there is no "create from template". Do **not** read templates to learn topology; build
  topology directly from `nodes describe` (wire output→input where `dataType`s match).
- **Grouping is supported via `parentId`.** Add a `frame` node and parent children to it in
  the same batch — see "Grouping: put a node inside a frame" above.

## Reference files

- `references/op-schema.md` — the full six-op schema, verbatim from source, with casing
  rules and the edge write-vs-read mapping. Read it before constructing a batch.
- `references/node-catalog.md` — the node-type landscape, the wire-`type`-string gotchas,
  and the writable-field model. Points back at `nodes describe` for live detail.

## Compatibility

Requires `@clickraft/cli >= 0.6.0`. Behavior verified against CLI `0.8.0` on staging.
