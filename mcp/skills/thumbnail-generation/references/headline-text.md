# Headline text: clean render or baked in

Clickraft skills run only the Clickraft tools. There is no image editor, font renderer or
script runner available here, so this skill **cannot lay crisp type over a finished
render itself**. Say so plainly whenever text comes up; never imply an overlay was applied.

## The default: a clean render

Without an explicit text request, every render uses block 3's default line
(`No text, no readable UI labels, no watermark.`) and is delivered as is.

A text request means one of: the user gives a headline or string to show, says "add text"
or "with a caption", or asks by name for a framework that carries on-image text. Never
infer it from the topic, and never from a framework you picked yourself.

## When the user supplies a headline: offer two paths, once

Ask in one short message, in the user's language:

- **(a) Clean render, text added by you** (recommended). The image comes back with no text
  and with open space kept where the headline goes. They add the words in a design tool
  (Figma, Canva, Photoshop) using one of the five styles below, which you write out for
  them as art direction. Type set this way is perfectly sharp and can be edited later.
- **(b) Text baked into the image.** The model paints the headline as part of the render.
  You check the spelling character by character and re-render up to 2 times if it is
  wrong. Painted text can still come out slightly off, and it cannot be edited afterwards.

If the user already said which they want, do not ask.

### Path (a): what to send

1. Render with the default no-text line, and add to block 8:
   `Keep the <top | bottom | left | right> quarter of the frame calm and uncluttered, free of faces and key elements, as space for a headline added later.`
   Pick the free quarter from the concept: the side away from the face, usually the bottom
   or the side opposite the subject.
2. Deliver the image plus a short art-direction note: the headline (2 to 6 words, all caps
   unless the style says otherwise), where it goes, which style, and the style's spec from
   the list below. Offer the other four styles in one line.

### Path (b): how to bake and check

1. Keep the headline to 2 to 6 words. Use block 3's HEADLINE line with the text exactly as
   the user wrote it, in their language and script; do not translate or "fix" it.
2. Choose the free quarter the same way as path (a), but add this to block 8 instead:
   `Place the headline in the <top | bottom | left | right> quarter, clear of faces and key elements.`
3. After each render, look at the result's preview image and compare the painted text with
   the ordered string **character by character**: every letter, number, accent,
   punctuation mark and space, and nothing extra anywhere in the image. The preview is
   small (about 400 px wide), so this check works for large headline text only. Text too
   small to read there cannot be verified from the preview: say so plainly and ask the
   user to check it on the full image in the widget; never report it as checked.
4. A mismatch means a fresh render with the same prompt, at most 2 re-renders per variant.
5. Still wrong after that: say so plainly, show the best attempt, and offer path (a) with a
   clean render of the same concept (one more render, quoted first).

On-image elements from text-carrying frameworks (message bubble, review card, news band,
day badge, map label) follow path (b)'s check too, using the block 3 ON-IMAGE ELEMENT line.
Their words are usually small, so expect to tell the user they could not be verified from
the preview.

## The five headline styles (art direction for path a, and a style cue for path b)

For path (b), translate the chosen style into a few words for the `<style cue>` slot of the
HEADLINE line (for example "white with a thick black outline and a hard drop shadow"
for Bold White, the default).

Shared rules for every style:

- 2 to 6 words, a headline, not a sentence.
- Never over a face; place it in the free quarter.
- Big: cap height around 12 to 18 percent of the image height. When unsure, go bigger.
- Comfortable padding from the edges.
- Tight letter spacing (about -0.01 to -0.02 em) and tight line height (about 0.9) so the
  words lock together.
- An outline must sit **behind** the letter fill, not on top of it. In CSS that is
  `paint-order: stroke fill` with `-webkit-text-stroke`; in a design tool use an outside
  stroke. A centered stroke drawn on top eats into the letters and is the most common
  reason home-made thumbnail type looks thin.
- Build the file at the render's native pixel size, read from the full image they
  download from the widget (a 4K 16:9 render, for example, is 5504 x 3072), so sizes in
  percent stay correct.

### 1. Bold White (default)

- Font: Anton (a heavy condensed grotesk), all caps.
- Fill: white `#FFFFFF`.
- Outline: black, about 10 to 12 percent of the cap height, outside the letters, round
  joins.
- Shadow: a hard dark shadow straight down (about 35 percent black), plus a softer, wider
  blur below it (about 55 percent black).

### 2. Fire

- Font: Anton, all caps.
- Fill: vertical gradient from yellow `#FFE24B` at the top through orange `#FF9A1F` to red
  `#FF2E2E` at the bottom.
- Outline: very dark brown `#1A0A00`, same thickness as Bold White.
- Effects: a warm orange outer glow, plus a hard dark shadow down.

### 3. Neon Lime

- Font: Anton, all caps.
- Fill: acid lime `#D4FF3F`.
- Outline: near-black green `#0A1400`, slightly thinner than Bold White.
- Effects: a lime outer glow (about 70 percent opacity), plus a hard dark shadow down.

### 4. Clean Glass

- Font: Inter, weight 800, mixed or all caps.
- Fill: white, no outline.
- Behind each line: a dark frosted pill (charcoal at about 45 percent opacity, background
  blur around 16 px), padding about 0.12 em top and bottom and 0.5 em on the sides, corner
  radius about 0.2 em, a large soft shadow underneath.
- Suits calm, premium or tutorial videos.

### 5. Marker

- Font: Anton, all caps.
- Fill: near-black `#0A0A0A`, no outline.
- Behind each line: a solid lime `#D4FF3F` box hugging the words (small side padding), with
  a hard dark shadow straight down.

## Other fonts

If the user wants a different font, offer one from these families (all free on Google
Fonts) and keep the style's outline, shadow and spacing rules:

- Punchy alternatives to Anton: Bebas Neue, Oswald (600 to 700), Archivo Black.
- Bold workhorses: Montserrat Black, Poppins ExtraBold, Roboto Condensed Bold, Inter 800,
  Barlow Condensed ExtraBold.
- Soft or elegant looks: Playfair Display (700 to 900), Cormorant Garamond (600 to 700),
  DM Serif Display, Fraunces (600 to 900), and Sacramento as a script accent only.

Heavy condensed fonts take the full outline. Serifs and scripts clog under a thick outline:
use a thin one (3 to 6 percent of cap height) or none, and rely on a soft drop shadow. A
script font is only ever a small secondary line; it fails the small-size test as the main
word.

## Before you hand over text

- [ ] The headline is 2 to 6 words and matches the user's string exactly.
- [ ] It sits in a free quarter, not over a face, away from the edges.
- [ ] One style, one color scheme per headline.
- [ ] Path (a): the image is clean and the art-direction note is included.
- [ ] Path (b): the character-by-character check passed, or you said honestly that it did
      not, or that small text could not be verified from the preview.
