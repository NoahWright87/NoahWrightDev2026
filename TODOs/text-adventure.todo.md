# Text Adventure

## Goal
A hand-written, old-school text adventure as an easter egg: the console points curious visitors to a semi-hidden `/adventure` page, and a public `/adventure/editor` shows how it is built.

## Decisions (Oct 2026, with Noah)
- **Noah writes the content.** Claude builds the engine, the editor and the page, never the story, rooms or dialogue. Only a tiny, obviously-placeholder test world ships in code.
- **Old-school and cheap.** A hand-written verb/noun parser with synonyms. No LLM, no embeddings, no model downloads. (Discussed and parked: a tiny embedding model as a "did you mean" fallback, an opt-in in-browser LLM, and an author-time synonym helper in the editor.)
- **Played on `/adventure`, not in the console.** The console greeting links to it. The page can be richer than a terminal (map, inventory and so on), so it isn't limited to what a console can do. It stays semi-hidden: out of the nav and the sitemap.
- **The world is areas of grid tiles joined by teleporters.** Each area is its own 2D grid, and neighbouring tiles connect with compass exits. A teleporter links a tile to a tile in any area, which covers going into a building, stairs, and elevators (one room with several destinations behind interactions).
- **The editor is public** at `/adventure/editor`, since showing how it is built is part of the portfolio. Visitors can tinker, but nothing they do touches the real game.

## Scope In
- **Engine** (`src/lib/adventure/`): pure TS with no React, shared by the game page and the editor's playtest.
  - Types and a world-format version.
  - Parser: verb + noun, filler words dropped, synonyms and aliases, `n/e/s/w/u/d`, `it` meaning the last noun mentioned, `again`/`g`.
  - Built-in verbs: look, examine, go, take, drop, inventory, use, open, talk/ask about, help.
  - Rules: match → conditions → effects → text.
  - Save/restore game state (localStorage, wrapped in try/catch).
- **World format** (`src/lib/adventure/world.json` or similar):
  - **Areas**, each a grid of tiles keyed `"x,y"`.
  - **Tiles:** name, description, conditional description lines, placed items and characters, `onEnter`.
  - **Edges** between neighbouring tiles: open (default), wall, or locked (item or flag, with a custom message).
  - **Teleporters:** source tile, verb/label ("enter shop", "go up", "press 3"), target area + tile, optional conditions.
  - **Items:** aliases, description, portable or not, rules.
  - **Characters:** aliases, description, dialogue topics with conditions, rules.
  - **Flags:** declared with a name and a note.
- **`/adventure`**: the game, a terminal-style log and input with command history (↑/↓) and a reveal-as-you-go map. Inventory and map panels are extras beyond what a terminal can do. Works on phones.
- **`/adventure/editor`**, public:
  - **Map view:** pick an area; click an empty cell to add a tile; click an edge to cycle open → wall → locked; drag items and characters onto tiles. Badges mark contents, locks, teleporters and missing text. Teleporters show as linked markers that jump to the other end.
  - **Tile inspector:** tabs for Description, Exits, Contents, Rules. Rules are edited as form rows, not code.
  - **Libraries:** items, characters and flags, each showing where it is used.
  - **Playtest pane:** the real engine; start from any tile; live inventory and flags.
  - **Checks:** unreachable tiles, a lock whose key can't be obtained, flags set but never read (or read but never set), missing descriptions, duplicate aliases in one tile, teleporters pointing at missing tiles.
  - **Persistence:** drafts autosave to localStorage, and JSON can be imported and exported. Noah publishes by exporting and committing the file; there is no server write.
- Console greeting gets a line pointing to `/adventure`.

## Scope Out
- Any LLM or ML (see Decisions).
- Server-side saving, accounts, or sharing visitor-made worlds.
- Writing the actual adventure content.
- Sound and images, for now.

## Open Questions
- Should the public editor open the real world (spoilers for anyone who finds it) or a sample world, with the real one a click away?
- `/adventure` metadata: `noindex`, or just leave it out of the sitemap and nav?
- Is a dev-only "save to repo" button worth it, or is export → commit enough?

## Dependencies
None. This sits beside the existing easter eggs in `src/components/EasterEggs.tsx`.

## Tasks
- [ ] World types, format version and a tiny placeholder test world
- [ ] Parser (with unit-style checks for synonyms, directions, `it`, filler words)
- [ ] Engine: movement, edges, teleporters, items, characters, rules, flags, save/restore
- [ ] `/adventure` page: log, input, history, map, inventory
- [ ] Editor map view: areas, tiles, edges, teleporters, placement
- [ ] Editor tile inspector and rules forms
- [ ] Editor libraries (items, characters, flags) with "used in"
- [ ] Editor playtest pane
- [ ] Editor checks
- [ ] Editor localStorage drafts + import/export
- [ ] Console greeting links to `/adventure`
- [ ] Add `/adventure` and the editor to MEMORY.md

## Verification
- Every engine rule type is exercised by the placeholder world in a playtest.
- The editor round-trips: export → import gives an identical world.
- Both pages work at 390px and 1280px in light and dark.
- `npm run lint` and `npm run build` pass.

## Done When
Noah can build and playtest a world in the public editor, commit its JSON, and play it on `/adventure` from the console link.
