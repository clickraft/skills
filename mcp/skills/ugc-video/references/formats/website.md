# Format: website

A creator stays on camera and talks about a website or app, continuously, in one shot.
The site itself is only ever the user's **real screenshots** — never generated, restyled
or invented UI. No board.

## Gate

Run this format only when the user supplies real screenshots (mobile screenshots of the
pages they want shown, ideally 3–8: hero, features, dashboard or editor, pricing,
reviews). This skill cannot capture a site. Without screenshots, offer: send
screenshots, or make a talking-head version that names the site without showing it.
Never fill gaps with search results or invented pages, and never ask the user to record
their screen.

## Intake extras

- Site name and URL (for the script), screenshots, creator photo or gender, duration,
  audience, approved claims, language.
- Which screen version (below): **A** (default) or **B**.

## Script

Hook → what the site solves → result or action. The first body phrase names the site;
later phrases follow the screenshot order; the closer has no screenshot. Budgets from the
website column of the monologue reference, about 2.4–2.7 words per second with varied
pace. Spoken, contractions, payload word at the end of each phrase.

## Clip

One continuous talking-head shot (the one-shot structure in the clip reference) on
`seedance-2.5-r2v` (`task: 'reference'`) with the creator as `@Image1`: medium shot, creator
about two thirds of the frame, head centred, phone propped on a couch or desk, natural
light, US accent, phone-mic audio with matching room ambience, no music. Hands stay out
of the bottom ~15 % (caption space for the user's editor).

Every clip prompt carries: "No website, app interface, browser or screen content
anywhere in the shot; any phone or laptop screen is turned away or dark." Before
submitting, reject a prompt that mentions cuts, slots, boards, a product object, or a
rendered screen.

A physical product appears only if a real product image exists: add it as `@Image2` and
let the creator hold it only in the final phrase; otherwise end with a neutral gesture.

## Showing the screenshots

- **A — overlay in your editor (default, real pixels).** Deliver the clip plus an overlay
  plan: for each screenshot, the phrase it belongs to and its rough start time (from the
  word order and pace), shown ~1.2–1.5 s as a card centred slightly above middle, about
  three quarters of the width, none during the first 1–2 s or the closer, the bottom
  15 % kept clear. The user places them; this skill has no compositing.
- **B — in-clip inserts (opt-in only, with a warning).** Pass up to 4 screenshots as
  extra references and write hard-cut inserts of each screen filling the frame for
  about a second. Tell the user before spending that the engine redraws the screens, so
  small text and layout may come out wrong, and they must check every insert before
  posting. Never use B by default.

Delivery states which version was made, and that site visuals come only from their
screenshots.
