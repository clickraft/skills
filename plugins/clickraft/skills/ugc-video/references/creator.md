# Creator lock — one identity for the whole run

Every format except `product` has one on-camera creator. Lock it before the board and
reuse the same image as a reference in every board and clip. Never regenerate it
mid-run, and never swap it for a text description.

## Three sources, in priority order

1. **User photo** — only after the safety gate establishes the user may use this adult's
   likeness. Use it unchanged as the creator reference (local path or URL).
2. **Brand model** — a trained identity in the account. Resolve it with
   `clickraft brand-model list --json` (`data[].id`, `data[].name`). Render one portrait
   in the same selfie style as below with the bare `--brand-model <uuid>` on
   `nano-banana-pro` (the server uses the model's primary image), and use that
   portrait's `data.resultUrl` as the creator reference. Add a pose (`<uuid>:<pose>`)
   only if the user asks for an angle, and check it first with the free
   `generate estimate`: a pose works only if that model has an image of that angle
   stored (shared system models reject every pose), and a missing one returns
   `E_BRAND_MODEL_POSE_NOT_FOUND` — then drop the pose.
3. **Generated creator** — one portrait from the prompt rules below:

```bash
clickraft generate create --json --no-wait --model-slug nano-banana-pro \
  --resolution 2K --aspect-ratio 3:4 --prompt "<creator prompt>"
clickraft generate wait <jobId> --json --timeout 90 --output ./clickraft-output/
```

Open the saved portrait with Read. Write down the traits you chose (age band, hair,
build, outfit) — that note is the continuity contract for later prompts. Regenerate
once if the face is waxy, the hands are wrong, a product or prop is in hand, or it reads
as a studio photo instead of a phone selfie.

## Rules for a generated creator

**Adults only.** Age band 21+. If the brief asks for a minor or leaves adult status
unclear, stop and return to the safety gate; never quietly age a request up.

**No product in the portrait.** Describe only the person and the room. Nothing held,
nothing in hand — the product joins at the board stage. A worn accessory is fine.

**Attractive, real-looking.** Every prompt states, in natural prose, a model-grade
attractive face, balanced symmetrical features, a well-proportioned figure and real skin
texture with visible pores. A bare face is not bad skin.

**User details win.** Any trait the user named (hair, look, outfit, setting, mood) is
used as given and its roll below is skipped.

### Product-led casting (before the rolls)

Leave room for the product to do its job — undo in the default look what the product
changes:

| Product | Casting lock |
|---|---|
| Skincare, cosmetics, beauty devices | bare face, no makeup (even for a makeup product) |
| Haircare | hair worn down, natural texture, untouched — no buns, braids, ponytails or updos |
| Teeth / smile | natural teeth visible in a real laugh |
| Sleep / energy | faint, honest under-eye tiredness, still attractive |
| Fitness / supplements | believable body, a light post-workout flush allowed |
| Fashion, accessories, jewellery | no lock — full styling expected |

### Variety rolls

Pick eight fresh numbers 0–99 per creator and map each through `pool[n % size]`. This
breaks the habit of always choosing the "safe" option. Never reuse a set within one
session.

| Roll | Axis | Pool |
|---|---|---|
| 1 | Age band | early 20s · mid 20s · late 20s · early 30s |
| 2 | Hair colour | honey blonde · ash blonde · chestnut · espresso · soft brown · jet black · deep auburn · copper · platinum · balayage · face-framing highlights · vivid green · vivid pink · pastel lavender |
| 3 | Hair cut | shoulder-length waves · long and straight · long soft waves · curtain bangs · chin bob · pixie · shag/wolf cut · slick claw-clip · messy low bun · half-up · twin braids · high ponytail · locs · buzz cut |
| 4 | Build | athletic · soft · average · petite · tall |
| 5 | Distinctive feature | none · freckles · small nose stud · dimples · tooth gap · beauty mark |
| 6 | Makeup | bare · natural · mascara only · soft brown smoky eye · winged liner · one coloured liner accent · brushed-up brows · blush across the cheeks · glossy lips |
| 7 | Face read | fair northern European · Mediterranean · East Asian · South Asian · Latin American · mixed · Middle Eastern · Eastern European |
| 8 | Style register | oversized streetwear · preppy · Y2K · quiet luxury · coastal minimal · sporty · sharp blazer · soft boho · leather and denim · clean minimal |

Render the face read through visible features and skin tone; do not write the label
word into the prompt unless the user supplied it. Never add glitter, shimmer or sparkle
to any makeup. If the style register clashes with the product (a jersey with a luxury
perfume), shift that roll by one, once. With a previous creator in the session, the new
one must differ on at least two of age, hair colour, hair cut and build.

**One loud element.** Exactly one feature carries the frame, taken from the rolls in
this order: vivid hair colour → statement cut (buzz, braids, shag, locs) → tooth gap →
otherwise one statement accessory from the style register. Describe it richly; keep
everything else quiet. If a woman's picks combine a cropped cut, a bare face and a
shapeless top (any two of the three), add soft feminine facial features to the face
description and do not make the hair the loud element.

**Outfit.** Choose clothes that fit the room and the tier: luxury reads silk, cashmere,
fine leather, real gold or silver; premium reads good cotton and considered finishing;
drugstore reads everyday cotton and simple chains. Pair a fitted piece with a loose one,
keep one metal family, add one lived-in detail (a sleeve pushed up, a strand of hair
loose). Big fictional prints only; small logos garble. Default rooms by category:
bathroom for skin and hair care, vanity or bedroom for cosmetics and fragrance, kitchen
for food and drink, home gym or kitchen for supplements, bedroom or dressing room for
fashion, desk for tech, living room for home goods, driveway for cars; cosy living room
otherwise. The outfit shares at least one tone with the room's palette.

**Coverage, always.** Write positively: tops closed at the collarbone, shirts buttoned to
the second button, knits with a crew or modest scoop neck, robes tied at the waist with
both lapels overlapping. A tank or camisole only under a closed shirt, cardigan or
jacket. If the user asks for bare skin, add clothing that fits the scene instead.

**Light.** Cool, neutral daylight from a named direction (window left, overcast sky).
Never golden hour, sunset or an amber cast unless the user asks; never studio strobes.

**Camera.** A front-camera phone selfie held at arm's length: head and shoulders fill the
frame, a slight tilt, a little off-centre, caught mid-moment, background naturally
softer but readable, phone grain and pores kept. Not an editorial portrait, not a
studio shot, no fisheye. The face carries the energy — a half-smile mid-thought, a laugh
just breaking, eyebrows up mid-sentence — while the body stays in a calm, ordinary pose.
No hands thrust at the lens, no jumps, no mirror selfies.

## Prompt shape

One paragraph, in this order: age band and gender, the mid-moment expression, hair
colour and cut (the loud element described richly), build, the attractiveness and
skin-texture floor, the specific room with materials and furniture; the light and how it
falls on the face; the outfit with its coverage wording and a calm body pose; the
background details; the room palette in one clause; the arm's-length front-camera
selfie framing; a closing line that it is an authentic phone selfie with real skin and
no retouching, not an editorial or magazine image.
