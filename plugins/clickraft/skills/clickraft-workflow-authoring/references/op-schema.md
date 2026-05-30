# Workflow mutation op schema (reference)

**Verified:** 2026-05-30 against CLI `0.8.0` (staging) and server source.
**Source of truth:** `clickraft/lib/agents/schemas/workflows.ts`
— **74 lines, md5 `9ad3839c2c98b8a260122e771a3653d9`**.
The exported write schema is `WorkflowMutateSchema`; the op union is `MutationOpSchema`.

> This file is a snapshot. If it drifts from the CLI's behavior, the server source wins —
> regenerate this doc from `clickraft/lib/agents/schemas/workflows.ts` (re-check the md5 and
> line count above). The op schema is **not** discoverable from `clickraft workflow apply
> --help`, which is why it is carried here.

## Batch envelope

`clickraft workflow apply <id>` sends `{ canvas_rev, operations }`:

- `operations` — the array key is **`operations`**, not `ops`. 1–100 ops, applied
  **atomically** (any failed op rejects the whole batch).
- `canvas_rev` — required. You normally don't write it: `--auto-rev` fetches the current rev
  and supplies it (and retries once on a 409). With `--from-file`, the file may be a bare
  ops array (rev supplied by `--auto-rev`/`--canvas-rev`) or an object
  `{ canvas_rev, operations }`.
- A freshly created workflow starts at `canvas_rev: 0`.

## The six ops

Discriminated union on `op` (snake_case literal). Verbatim from source (lines 20–67):

```ts
const MutationOpSchema = z.discriminatedUnion('op', [
  z.object({
    op: z.literal('add_node'),
    node: z.object({
      id: z.string(),
      type: z.string(),
      // Canonical React Flow shape — preferred.
      data: z.record(z.string(), z.unknown()).optional(),
      position: z.object({ x: z.number(), y: z.number() }).optional(),
      inputs: z.record(z.string(), z.unknown()).optional(),
      // Containment: place this node inside an existing frame. The agent sends an
      // ABSOLUTE position; the worker converts it to a provisional frame-relative
      // position at apply time (see workers/collaboration/src/agent-mutations.ts).
      parentId: z.string().optional(),
      expandParent: z.boolean().optional(),
      // DEPRECATED: agent-shape aliases. Normalized to canonical at the
      // worker boundary (see workers/collaboration/src/agent-normalize.ts).
      // Removal pending Step 1b.
      title: z.string().optional(),
      config: z.record(z.string(), z.unknown()).optional(),
      ui: z.object({ position: z.object({ x: z.number(), y: z.number() }).optional() }).optional(),
    }),
  }),
  z.object({
    op: z.literal('add_edge'),
    edge: z.object({
      id: z.string(),
      from: z.object({ node: z.string(), output: z.string() }),
      to: z.object({ node: z.string(), input: z.string() }),
    }),
  }),
  z.object({
    op: z.literal('update_node'),
    node_id: z.string(),
    patch: z.record(z.string(), z.unknown()),
  }),
  z.object({ op: z.literal('remove_node'), node_id: z.string() }),
  z.object({ op: z.literal('remove_edge'), edge_id: z.string() }),
  z.object({
    op: z.literal('update_meta'),
    patch: z.record(z.string(), z.unknown()),
  }),
]);

export const WorkflowMutateSchema = z.object({
  canvas_rev: z.number().int().nonnegative(),
  operations: z.array(MutationOpSchema).min(1).max(100),
});
```

| op | required | notes |
|---|---|---|
| `add_node` | `node.id`, `node.type` | optional `node.data`, `node.position{x,y}`, `node.inputs`; `node.parentId` + `node.expandParent` for frame containment (see "Node containment" below) |
| `add_edge` | `edge.id`, `edge.from{node,output}`, `edge.to{node,input}` | see edge shape below |
| `update_node` | `node_id`, `patch` | effective patch keys: `data`, `position` |
| `remove_node` | `node_id` | also removes its connected edges |
| `remove_edge` | `edge_id` | |
| `update_meta` | `patch` | effective patch keys: `name`, `description`, `tags`, `declared_params` |

### Casing

- `op` literals: snake_case (`add_node`, `add_edge`, `update_node`, `remove_node`,
  `remove_edge`, `update_meta`).
- Identifier keys: snake_case — `node_id`, `edge_id`, `canvas_rev`. The id of a *new* node
  or edge lives **inside** the nested object as `node.id` / `edge.id`.
- Nested keys: lowercase/camel — `id`, `type`, `data`, `position`, `inputs`, and inside an
  edge `from`/`to`/`node`/`output`/`input`.

### Canonical only — no deprecated aliases

`node.title`, `node.config`, `node.ui` are deprecated and slated for removal. Use the
canonical shape: a node label goes in `data.label`; position goes in `node.position`.
Sending a canonical key **and** its deprecated alias on the same op is rejected with
`CANONICAL_ALIAS_CONFLICT`. Send canonical only.

### Effective `patch` keys (anything else is ignored)

The Zod `patch` is `z.record(...)` (accepts any object), but the worker only acts on
specific keys:

- `update_node.patch` → `data` (object of writable fields) and `position` (`{x,y}`).
- `update_meta.patch` → `name`, `description`, `tags`, `declared_params`.

Other keys in a `patch` are silently ignored.

### Node containment (`parentId` / `expandParent`)

`parentId` and `expandParent` are optional fields on the **`node` object** of an `add_node`
op (not on the op itself). They place the new node inside a `frame`:

- **`parentId`** — the id of a node whose `type` is **`frame`**. The frame may already exist in
  the workflow, or be added by an earlier op in the **same batch** (the parent is resolved
  against intra-batch state, so frame in op N, child in op N+1 works).
- Put the child's **absolute** canvas position in `node.position`. The **server** converts it
  to a frame-relative offset (`childAbs − frameOrigin`) — do **not** compute the relative
  position yourself. Verified live: abs `(2120, 1590)` into a frame at `(2000, 1500)` was
  stored as relative `(120, 90)`.
- **`expandParent`** — set it to `false`. **Omit `extent`** entirely (do not send
  `extent: 'parent'`).
- **Frames cannot be nested** — a `frame` given a `parentId` is rejected.

Two diagnostics guard this (422 `E_WORKFLOW_VALIDATION_FAILED`, nothing applied):
`INVALID_PARENT_REF` and `NESTED_GROUP_FORBIDDEN` — see "Validation & authorization" below.

## Edge WRITE shape vs READ shape

`add_edge` uses the **write** shape (`from`/`to`). Every response that returns the graph
(`workflow get`, the `apply` response's `data.workflow`) uses the React Flow **read** shape.
They are different keys — verified empirically on staging:

| Concept     | WRITE (`add_edge`) | READ (`workflow get` / `apply` response) |
|-------------|--------------------|-------------------------------------------|
| edge id     | `edge.id`          | `id`                                      |
| source node | `from.node`        | `source`                                  |
| source port | `from.output`      | `sourceHandle`                            |
| target node | `to.node`          | `target`                                  |
| target port | `to.input`         | `targetHandle`                            |

Round-trip proof (live): writing
`{from:{node:"txt1",output:"text-output"}, to:{node:"gen1",input:"prompt-input"}}`
read back as
`{source:"txt1", sourceHandle:"text-output", target:"gen1", targetHandle:"prompt-input"}`.

**Never** paste a read edge into an `add_edge` op — the schema strips the unknown
`source/sourceHandle/...` keys, leaving an edge with empty endpoints. Translate read → write
first.

## Response shapes (mind the casing difference)

- `workflow create` → `data.id`, `data.canvas_rev` (0 for a new workflow).
- `workflow apply`  → `data.canvasRev` (**camelCase**), `data.applied` (op count),
  `data.workflow` (full graph, read-shape edges).
- `workflow get`    → `data.canvas_rev` (**snake_case**, top level), `data.nodes`,
  `data.edges` (read-shape).

## Validation & authorization (server-side, surfaced in the apply error)

A batch passes through normalize → authorize → validate. Failures come back as
`ok:false` with `error.code: "E_WORKFLOW_VALIDATION_FAILED"` and a
`error.details.diagnostics[]` array — read the diagnostics for the per-op cause:

- `FIELD_NOT_ALLOWED` — a `data.*` key not in the node's writable allowlist
  (`label`, `hideHeader`, plus the node's `agentWritableFields`). Path points at the op/field.
- `CANONICAL_ALIAS_CONFLICT` — canonical + deprecated alias on one op.
- `INVALID_PARENT_REF` — `node.parentId` references a missing node, or a node that is not a
  `frame`. Path points at `/operations/<i>/node/parentId`.
- `NESTED_GROUP_FORBIDDEN` — a `frame` parented to another `frame` (frames can't be nested).
- Port/graph validation — an edge endpoint that isn't a real output→input pair, or a
  missing node, fails here too.

There is **no** `clickraft workflow validate` command (the error hint that mentions it is
stale). The only server-side validation path is a real `workflow apply`; `--dry-run` is a
local payload print and does not validate.
