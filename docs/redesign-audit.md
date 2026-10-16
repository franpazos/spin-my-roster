# Redesign baseline audit

Captured before the redesign (commit `420653d`) at 390 × 844, 768 × 1024 and
1440 × 900, playing two picks (QB from ARI, DEF from CLE).

## Hierarchy

- The three columns (roster, reel, instructions) have the same visual weight,
  so the reel, the core of the game, does not stand out.
- Every panel uses the same zinc card with gray uppercase titles, so the app
  reads like a dashboard template rather than a game.
- Emerald is the only accent. It marks progress, filled slots, the hint, the
  reel frame and the main button, so nothing feels primary.
- The header is a generic "S" tile with a subtitle and gives no game status.

## Responsive

- Mobile and tablet stack roster → reel → selection. The SPIN button sits
  below the fold at 390 × 844, and the player list ends up at the very bottom.
- Columns use `h-[calc(100vh-120px)]` plus `min-h-[400px]`, so the roster list
  scrolls inside a tiny box on mobile (only four slots are visible).
- After picking a player on mobile, the user has to scroll back up to spin.

## Weak states

- After a player is staged, the right panel goes back to "Ready to Play?",
  which hides the pending pick there.
- Spinning shows a bouncing 🎰 emoji in an otherwise empty panel.
- The spin animation is a random shuffle every 80 ms with `animate-pulse`. The
  intended slowdown never happens because the interval delay is computed once.
- A locked team after reload uses a different layout from the live reel.
- Player loading is one spinner, errors have no retry, and the empty state is
  generic.
- Completion is a trophy plus three equal buttons, with no roster summary and
  no "new game" action. Sharing feedback uses `alert()`.

## Inconsistent components

- Two different position-picker styles (roster rows and pill buttons).
- Text sizes include a non-existent `text-md` class.
- Filled, staged and active slots differ mainly by emerald opacity, so state
  relies on color alone.
- `styles/globals.css` is an unused second token system; the layout imports
  `app/globals.css`.
- Three Google fonts (Inter, Geist Mono, Source Serif 4) are loaded with all
  weights, but only Inter is used.

## Code issues found

- `SelectionPanel` calls `useRef` inside the `COMPLETE` branch (conditional
  hook).
- `ReelPanel` builds `availableTeams` on every render, and the reel effect
  depends on it, so any re-render during a spin can restart the animation.

## Console

- No errors or warnings. Only debug `console.log` calls (`[v0] Teams data`,
  `[v0] Roster response`, `Head coach response`).

## Tooling

- `npm run lint` fails with `eslint: command not found`: the script exists but
  ESLint is not a dependency. Left as is (out of scope).
