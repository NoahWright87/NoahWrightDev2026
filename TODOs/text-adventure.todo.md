# Text Adventure

## Goal
A hand-written, old-school text adventure as an easter egg: the console points curious visitors to a semi-hidden `/adventure` page, and a public `/adventure/editor` shows how it is built.

## Decisions (Oct 2026, with Noah)
- **Noah writes the content.** Claude builds the engine, the editor and the page, never the story, rooms or dialogue. Only a tiny, obviously-placeholder test world ships in code.
- **Old-school and cheap.** A hand-written verb/noun parser with synonyms. No LLM, no embeddings, no model downloads. (Discussed and parked: a tiny embedding model as a "did you mean" fallback, an opt-in in-browser LLM, and an author-time synonym helper in the editor.)
- **Played on `/adventure`, not in the console.** The console greeting links to it. The page can be richer than a terminal (map, inventory and so on), so it isn't limited to what a console can do. It stays semi-hidden: out of the nav (but indexed; see below).
- **The world is areas of grid tiles joined by teleporters.** Each area is its own 2D grid, and neighbouring tiles connect with compass exits. A teleporter links a tile to a tile in any area, which covers going into a building, stairs, and elevators (one room with several destinations behind interactions).
- **The editor is public** at `/adventure/editor`, since showing how it is built is part of the portfolio. Visitors can tinker, but nothing they do touches the real game.
- **Spoilers are allowed but tucked away.** The editor opens a small example world by default. The site's real world is one of a few built-in worlds in a "Load" menu, next to uploading a file.
- **Both pages are indexed.** It's an easter egg, not a secret. They're out of the nav, but nothing blocks search engines, and they can go in the sitemap.
- **Publishing is export → commit.** No server write and no dev-only "save to repo" button.
- **"Save to local"** stores the world in localStorage so it can be playtested. Visitors can build their own this way, and it's how Noah tests his before committing.

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
- **Built-in worlds** live as JSON files fetched on demand, so the real world isn't bundled into the editor:
  - `example`: small, and loaded by default.
  - `site`: the real game.
  - `blank`: an empty starting point.
- **`/adventure`**: the game, a terminal-style log and input with command history (↑/↓) and a reveal-as-you-go map. Inventory and map panels are extras beyond what a terminal can do. Works on phones.
  - It plays the site world by default. When a locally saved world exists, it offers to play that one instead (e.g. `/adventure?world=local`), with a clear "you're playing your own world" banner.
- **`/adventure/editor`**, public:
  - **Map view:** pick an area; click an empty cell to add a tile; click an edge to cycle open → wall → locked; drag items and characters onto tiles. Badges mark contents, locks, teleporters and missing text. Teleporters show as linked markers that jump to the other end.
  - **Tile inspector:** tabs for Description, Exits, Contents, Rules. Rules are edited as form rows, not code.
  - **Libraries:** items, characters and flags, each showing where it is used.
  - **Playtest pane:** the real engine; start from any tile; live inventory and flags.
  - **Checks:** unreachable tiles, a lock whose key can't be obtained, flags set but never read (or read but never set), missing descriptions, duplicate aliases in one tile, teleporters pointing at missing tiles.
  - **Load menu:** the built-in worlds (example, site, blank) and "Upload a file…". Uploaded JSON is validated and its format version checked before it replaces the current world, with a confirm if there are unsaved changes.
  - **Save to local** writes the world to localStorage. There is one saved slot to start, and both the playtest pane and `/adventure?world=local` play it. Unsaved edits also autosave as a draft, so a refresh doesn't lose work.
  - **Export** downloads the JSON. Noah publishes by committing it as the `site` world.
- Console greeting gets a line pointing to `/adventure`.

## Scope Out
- Any LLM or ML (see Decisions).
- Server-side saving, accounts, or sharing visitor-made worlds.
- Writing the actual adventure content.
- Sound and images, for now.

## Open Questions
- Who writes the `example` world? It's content, so by default Noah does. Until then, Claude ships a deliberately dry, tiny one that only demonstrates the mechanics (a locked door, a key, a teleporter, one character).
- Should there be one local save slot, or several named ones? Start with one.

## Dependencies
None. This sits beside the existing easter eggs in `src/components/EasterEggs.tsx`.

## Tasks
- [x] World types, format version and a tiny placeholder test world
- [x] Parser (with unit-style checks for synonyms, directions, `it`, filler words)
- [x] Engine: movement, edges, teleporters, items, characters, rules, flags, save/restore
- [x] `/adventure` page: log, input, history, map, inventory
- [x] Editor map view: areas, tiles, edges, teleporters, placement
- [x] Editor tile inspector and rules forms
- [x] Editor libraries (items, characters, flags) with "used in"
- [x] Editor playtest pane
- [x] Editor checks
- [x] Built-in worlds (example, site, blank) as on-demand JSON
- [x] Editor Load menu (built-ins + upload with validation), Save to local, draft autosave, Export
- [x] `/adventure?world=local` plays the saved world, with a banner
- [x] Add both pages to the sitemap
- [x] Console greeting links to `/adventure`
- [x] Add `/adventure` and the editor to MEMORY.md
- [ ] **Noah:** write the real `example.json` (the current one is a dry placeholder that only demonstrates mechanics)
- [ ] **Noah:** write `site.json` (currently a one-room "Coming soon")
- [ ] Maybe: drag items/characters onto map tiles (placement is through the room's Contents tab for now, which also works on phones)
- [ ] Maybe: several named local save slots (one slot for now)

## Verification
- Every engine rule type is exercised by the placeholder world in a playtest.
- The editor round-trips: export → upload gives an identical world.
- Save to local → `/adventure?world=local` plays the edited world. A malformed upload is rejected with a readable error and leaves the current world untouched.
- Both pages work at 390px and 1280px in light and dark.
- `npm run lint` and `npm run build` pass.

## Done When
Noah can build and playtest a world in the public editor, commit its JSON, and play it on `/adventure` from the console link.
