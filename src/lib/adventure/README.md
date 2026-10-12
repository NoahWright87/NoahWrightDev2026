# Text adventure

The engine behind `/adventure`, and the format the editor at `/adventure/editor` reads and writes.

## Files

| File | What it does |
|---|---|
| `types.ts` | The world format, with comments. Start here. |
| `parser.ts` | Turns typed text into a verb and nouns: synonyms, filler words, directions. |
| `engine.ts` | `newGame(world)` and `step(world, state, input)`, both pure. |
| `world.ts` | Tile and edge keys, stock replies (`DEFAULT_MESSAGES`), and a blank world. |
| `validate.ts` | Structure checks for JSON from outside (uploads, localStorage), plus format migration. |
| `checks.ts` | Authoring warnings: unreachable rooms, unknown items, flags nothing sets, and so on. |
| `usages.ts` | "Where is this used?" for the editor. |
| `storage.ts` | Built-in worlds, local saves, drafts, progress, export. |

The worlds themselves are JSON in `public/adventure/worlds/`:

- `site.json` is the one `/adventure` plays.
- `example.json` is what the editor opens by default.
- `blank.json` is an empty starting point.

## How a turn works

1. Meta commands: `again`, `restart`, `help`.
2. **Teleporters** on the current tile, matched by whole command ("up", "enter shed"). A leading "go" is ignored.
3. **Rules**, checked first on the tile, then items in reach, then characters in the room. The first rule whose verb, noun and conditions all match runs. Because rules come before the built-ins, a rule can override `take`, `look` and so on.
4. **Built-in verbs:** look, go, take, drop, examine, inventory, talk, ask, wait. Generic verbs like use, open and push answer "Nothing happens."

## Publishing the site's adventure

1. Build it in the editor and playtest it there.
2. Use **Save to local**, then **Play saved** to try it on the real page (`/adventure?world=local`).
3. **Export** it, replace `public/adventure/worlds/site.json` with the exported file, then commit.

Players' saved progress is ignored automatically if the world's rooms or items change underneath it.

## Changing the format

Bump `FORMAT_VERSION` in `types.ts`. Then teach `migrateWorld` in `validate.ts` to upgrade the older format, so saves and exported files people already have keep loading.

## Tests

`npm run test:unit` runs the parser and engine tests in `tests/unit/`. Among other things, they play the example world from start to finish.
