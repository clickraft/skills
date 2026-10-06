# Generated replacement people

Use this only for a **human** role the user wants recast but has no image for. Never for
products, animals, creatures, objects, backgrounds, removals, attribute edits or text.
Never for a child or teen role — that needs a user-supplied adult reference or the
user's explicit agreement to recast the role as an adult.

The portrait becomes an ordinary `@ImageN` reference in the edit. It is a full-body,
clean-background image so the edit engine reads the whole look — face, hair, outfit,
shoes — without competing scenery.

## Call

One call per missing person, each its own request:

```bash
clickraft generate create --json --no-wait \
  --model-slug nano-banana-pro --resolution 2K --aspect-ratio 3:4 \
  --prompt "<portrait paragraph>"
clickraft generate wait <jobId> --json --timeout 90 --output ./clickraft-output/
```

Budget about 2 minutes per portrait, including queue time; a wait that returns
`E_TIMEOUT` is re-run on the same jobId, never re-created.

No reference images, no brand model — the person is described in words only. If the
user has a trained brand model they want to use instead, that is a user-supplied
identity: render it with the bare `--brand-model <uuid>` (the server uses the model's
primary image) in the same studio framing and skip the contrast plan. Add a pose
(`<uuid>:<pose>`) only if the user asks for an angle, and check it first with the free
`generate estimate`: a pose works only if that model has an image of that angle stored
(shared system models reject every pose), and a missing one returns
`E_BRAND_MODEL_POSE_NOT_FOUND` — then drop the pose.

## Contrast plan (before writing)

Each generated person must read as clearly someone else than the source person they
replace — otherwise the edit engine blends them. From the user's description of the
source person, decide two positive traits for the replacement:

1. **Overall casting look** — a visibly different apparent heritage/complexion
   presentation, described through concrete visible features and skin tone. These are
   fictional casting notes, not claims about anyone's identity.
2. **Hairstyle** — different length, texture and shape.

Write both as what the replacement IS ("deep brown skin, close-cropped black coils"),
never as "different from" or "unlike the original". Do not force a different body type
or face shape; build and stature appear only if the user gave them. If the user's
source description is too thin to plan either trait, ask for it once — never guess.

Several generated people in one run must also differ clearly from each other.

## Portrait paragraph

Write one fluent paragraph of about 140–190 words — prose, not tags, no brackets, no
slash options. Order:

1. **Subject.** A full-length, eye-level, front-facing portrait of exactly one adult
   (state an age of 20 or older), with the two contrast traits, skin tone, the face
   quality floor (very attractive — say "strikingly beautiful", "strikingly handsome" or
   "conventionally attractive" to match the requested presentation — balanced,
   symmetrical features, a well-proportioned figure, real skin texture), relaxed upright
   stance, calm expression, eyes to camera. Resolve the presentation (woman, man) from
   the request or the source mapping; never default it.
2. **Outfit.** One complete, current, stylish outfit from top to shoes in opaque,
   well-cut fabrics, plus at most two understated accessories. Whole outfit and both feet
   in frame.
3. **Backdrop.** Alone on a seamless matte-white studio sweep where floor meets wall
   without a seam; centred figure, generous empty space, no props, furniture, text or
   logos.
4. **Light and colour.** Soft, even, high-key studio light with a gentle contact shadow,
   no harsh contrast, no blown highlights; a restrained palette led by the outfit.
5. **Capture.** High-resolution professional camera, deep focus, sharp from head to
   shoes, low noise, wide dynamic range; natural skin detail, correct anatomy, natural
   hands, no heavy retouching, no distortion, a clean contemporary fashion-catalogue feel.

Vary pose detail, outfit silhouette, accessories and accent colours between people,
while keeping the same studio standard. No real person's name, no photographer,
publication or brand names anywhere in the paragraph.

## Inspect, retry, approve

- Open each saved portrait with Read. Reject and regenerate that one person once if
  either contrast trait is missing or vague, if the person looks like the source
  description, if two generated people look alike, or if the image fails the quality
  floor (unattractive, waxy, extra fingers, cropped feet, busy background).
- Never show a failed candidate for approval.
- Show the passing portraits to the user and ask for approval **before** any video
  spend. On a rejection, regenerate only the named people, or stop if asked.
- After approval, keep for each person: its `data.resultUrl` (the `--reference-image`
  value), its slot and version, and the two approved traits for the prompt declaration.

A failed person after two attempts fails every version that depends on it; say which.
