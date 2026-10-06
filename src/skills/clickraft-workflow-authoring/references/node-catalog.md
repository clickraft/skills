# Node catalog & writable-field model (reference)

**Verified:** 2026-05-29 against CLI `0.8.0` (staging).

This catalog is a snapshot for orientation. The **live, authoritative** source is the CLI —
node types drift as the product evolves, so query it, don't trust this list blindly:

```bash
clickraft nodes list --json                 # the current TYPE strings
clickraft nodes describe <type> --json       # ports (handleId/direction/dataType) + agentWritableFields
```

## The writable-field model (default-deny, key-level)

For each node you may set **only**:

- the two base fields **`label`** and **`hideHeader`** (writable on every node), plus
- the node's own **`agentWritableFields`** (from `nodes describe`).

Every other top-level key in `data` is rejected with a `FIELD_NOT_ALLOWED` diagnostic, and
that rejects the **entire batch** (the op pipeline is atomic). Two consequences:

- `nodes describe` lists only the per-node fields — remember `label`/`hideHeader` are *also*
  allowed (they aren't repeated there).
- Source/content fields that aren't in the allowlist are **user-set in the canvas**, not by
  the agent. The clearest case: the `image` node's `imageUrl` (`agentWritableFields: []`) —
  you build and wire the node, the user attaches the image.

## Node types (live `nodes list`, 16 types)

The `type` string is the wire identifier you put in `add_node.node.type`. **It is not the
source directory name** — never derive a type from a path. Known mismatches:

| Wire `type` (use this) | Source dir | Note |
|---|---|---|
| `imageGeneration` | `image-generator/` | dir name differs from type |
| `frame` | `group/` | the "group" node's wire type is `frame` |
| `shopifySource` | `shop-import/` | |
| `shopifyPublish` | `shop-publish/` | |

The 16 types returned by `nodes list` on 2026-05-29: `assistant`, `frame`, `image`,
`imageGeneration`, `list`, `musicGenerator`, `productSource`, `shopifyPublish`,
`shopifySource`, `soundEffects`, `sticker`, `stickyNote`, `textPrompt`, `ugcSource`,
`videoGeneration`, `voiceover`. (Re-run `nodes list` for the current set.)

## Verified detail for image-workflow nodes

From live `nodes describe` (handle ids are the values you put in an edge's
`from.output` / `to.input`):

### `image` — pure source (output only)
- Ports: `image-output` (output, `image`).
- `agentWritableFields`: `[]` → only `label`/`hideHeader` writable. **`imageUrl` is
  user-set in the canvas**, not by an agent.
- You cannot wire *into* this node — it has no input port.

### `textPrompt` — text source
- Ports: `text-output` (output, `text`).
- `agentWritableFields`: `prompt`, `backgroundColor`, `width`, `height`.
- Feed `text-output` into a generator's text input.

### `imageGeneration` — generation (text/image in → image out)
- Ports: `prompt-input` (input, `text`), `reference-images` (input, `image`),
  `image-output` (output, `image`).
- `agentWritableFields`: `prompt`, `model`, `aspectRatio`, `resolution`, `batchCount`.
- `batchCount` controls how many images one node produces (e.g. `5` for five ads).
- `model` takes a model slug — discover slugs with `clickraft models list --json`.

### `list` — collection / fan-in
- Ports: `images` (input, `image`), `texts` (input, `text[]`), `output-images`
  (output, `image`), `output-texts` (output, `text[]`).
- `agentWritableFields`: `accumulationMode`, `viewMode`, `width`, `height`.

## Wiring compatibility

Connect an **output** handle to an **input** handle with a matching `dataType`
(`text`→`text`, `image`→`image`). The server validates port direction and existence on
`apply`; a bad pairing fails the batch. When unsure of a node's ports or fields,
`nodes describe <type>` before you build.

## Grouping: nest a node inside a `frame`

The `frame` node is a container. To place a node inside one, add the child with `parentId` set
to the frame's id (the frame can already exist or be added by an earlier op in the same batch),
give the child its **absolute** canvas position (the server converts it to a frame-relative
offset), and set `expandParent: false`. Frames cannot be nested. Full contract + validation
errors: `references/op-schema.md` → "Node containment"; workflow pattern: `SKILL.md` →
"Grouping: put a node inside a frame".
