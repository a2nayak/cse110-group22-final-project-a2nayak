
## Overview

Reference the [planning meeting](../../meetings/sprint_2/planning-meeting.md) document in order to understand what the game should generally look like.

## Alignment Questions

When answering questions, the main design decisions for this sprint will be prefixed with the $\circ$ symbol.

> Should the text interface be within the game environment or outside of it?

Due to the scope of this sprint, I want to say outside. If we do plan to eventually make it part of the game, then we probably want to make our text interface logic modular to allow it to be changed (something like an MVC architecture?).

$\circ$ The text interface will be separate from the game.

> What does the game environment need to have?

Add to this with whatever you think is necessary.

$\circ$ The current crop
$\circ$ Soil to grow the crops
$\circ$ A watering can

> Will our game be 2d or 2.5d?

Again, probably 2d due to scope. CSS does support (partial) 2.5d rendering, though.

$\circ$ Probably 2d.

> What art style are we using?

I'm leaning towards a vector style, since it works well with CSS (SVG) and vector graphics are easy to animate.
That said, I do see arguments for pixel, though.

$\circ$ TBD


## Specification Draft
> [!NOTE]
> The following content is subject to change. Edit it!

TODO: fill in stuff from the alignment questions + the basic structure of the game environment

## Future Ideas
- Have the text interface be part of the game.
- Have 2.5 rendering for a sense of depth.

