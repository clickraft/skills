# Thumbnail frameworks: deciding what to show

The house prompt in [prompt-blocks.md](prompt-blocks.md) decides how a thumbnail is
rendered. This file decides what it shows. Pick the framework (or a blend of two) in step 2
of the pipeline, before writing a single prompt block.

## The one principle: open a question

A thumbnail earns the click when it makes the viewer ask something the video answers.
"What happened to him?", "Is that really 100 of them?", "Which one wins?". A picture that
explains everything at a glance gives the viewer no reason to press play.

Before you write a prompt:

1. Sketch **at least five** concepts that draw on different frameworks below.
2. Score each one: does it open a gap, does it read in under a second, does it still read
   at about 120 px wide, is it honest about the video?
3. Carry the strongest one forward. A blend of two frameworks is often stronger than one
   (a posed portrait over a map route, a size contrast inside a landscape), as long as it
   adds tension without adding clutter.

You do not show the user all five sketches unless they ask. Mention the chosen idea in one
line when you deliver.

## The honesty rule

Exaggerate the feeling, never the facts. A thumbnail may push the emotion, the scale or the
drama of something that is really in the video, but it may not promise something the video
does not contain. This matters most for frameworks with readable text on the image (a fake
message, a news ticker, a day counter): keep those words short and true to the video.

## Text-carrying frameworks need an explicit ask

Frameworks 2, 7, 10 and 15 normally carry a small piece of readable text on the image (a
message bubble, a day badge, a map label, a news ticker). Bake that text **only** when the
user asked for that framework or gave you the words. If you picked one of them yourself
while brainstorming, render it without the text, or ask once. Any such element uses the
ON-IMAGE ELEMENT line in block 3 and stays brand-neutral: no real app, platform or broadcaster
names or logos.

## The 16 frameworks

| # | Framework | The idea | How to build it with the prompt blocks |
|---|---|---|---|
| 1 | Before / After | One subject in two states, as far apart as possible | Split frame, before/after mode (two halves) |
| 2 | Social message | A message, DM or review card that hints at the story | Block 5: a generic message bubble or review card beside the subject; its words through the block 3 ON-IMAGE ELEMENT line; no real platform styling |
| 3 | Three steps | Start, turning point, end of a journey | Split frame, three vertical panels, one beat per panel; a small step number or day badge only on an explicit ask |
| 4 | Real video frame | A striking real moment from the video itself | Not a generation. Ask the user to export the frame from their footage. If they want a generated version, build a posed action shot that matches the frame, using it as a <cli>`--reference-image`</cli><mcp>`referenceImages` entry (uploaded with `upload_widget`)</mcp> only when it is their own footage and they ask for that |
| 5 | Posed portrait | A large, expressive person and almost nothing else | The default: block 4 subject filling most of the frame, identity lock, lighting rig, a strong expression, a quiet background |
| 6 | Posed action | One intriguing action caught mid-moment | Block 2 scene brief describes the single action; block 8 keeps the frame uncluttered |
| 7 | Day highlight | A big day counter that implies a long challenge | Any framework plus a large day badge through the block 3 ON-IMAGE ELEMENT line; choose a day near the end of the arc (the last fifth) |
| 8 | Graphic / chart | A simple familiar graphic: a curve, a bar, a gauge | Replace block 1 with a clean graphic brief; drop the photoreal wording, block 10 and the glossy grade |
| 9 | Landscape | The place is the star | Block 7 location leads; keep one small figure on a third for scale; lighting rig optional |
| 10 | Map / aerial | A map or aerial view with a route or a marked point | Block 1 frames a map or aerial shot; block 5 adds the highlighted route, circle or arrow; a label only through the block 3 ON-IMAGE ELEMENT line |
| 11 | Product | The product is the answer to the title's question | The product is the subject, sharp and heroic; its own printed label may stay; with a catalog item add <cli>`--product`</cli><mcp>it in `products`</mcp> |
| 12 | Headline text | Words that continue or answer the title | Delivered by the headline path in [headline-text.md](headline-text.md): a clean render for overlay, or text baked in on request |
| 13 | Repetition | A huge quantity of one object | Block 5 fills the frame with one repeated object, still countable at a glance; add one person or context item for scale |
| 14 | Size contrast | Something giant next to something tiny | Block 8 builds an extreme scale gap between the two story elements |
| 15 | News ticker | A breaking-news style lower band | A generic news band through the block 3 ON-IMAGE ELEMENT line with one short true line; no real channel branding |
| 16 | Amplified moment | A real moment with one element pushed further | Posed action plus one oversized element in block 5; keep it believable, because overdoing it costs trust |

Frameworks 1, 5 and 12 are the everyday defaults. Every framework is realized through the
same 11 prompt blocks; never invent a separate prompt format for one.

## Quick quality checklist

Whatever the framework, the finished thumbnail should have:

- one obvious focal point;
- a question the viewer wants answered;
- strong contrast and a hero that still reads at about 120 px wide;
- a clear emotion or a clear intrigue on any face;
- nothing in the frame that does not help the idea;
- nothing that misrepresents the video;
- an idea that lands in under a second in a busy feed.
