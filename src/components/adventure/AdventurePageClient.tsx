"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Heading, Text } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import { fetchBuiltInWorld, loadSavedWorld, SITE_WORLD } from "@/lib/adventure/storage";
import type { World } from "@/lib/adventure/types";
import MiniMap from "./MiniMap";
import Terminal from "./Terminal";
import { useAdventure } from "./useAdventure";
import "./adventure.css";

type Source = { kind: "site" } | { kind: "local" };

/**
 * /adventure plays the site's world. /adventure?world=local plays whatever was
 * saved from the editor with "Save to local", with a banner saying so.
 */
export default function AdventurePageClient() {
  const [source, setSource] = useState<Source | null>(null);
  const [world, setWorld] = useState<World | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const wantsLocal = new URLSearchParams(window.location.search).get("world") === "local";
    if (wantsLocal) {
      const saved = loadSavedWorld();
      if (saved) {
        setSource({ kind: "local" });
        setWorld(saved);
        return;
      }
      setError("There's no locally saved world in this browser, so here's the real one. Use \"Save to local\" in the editor first.");
    }
    setSource({ kind: "site" });
    fetchBuiltInWorld(SITE_WORLD)
      .then(setWorld)
      .catch((e: Error) => setError(e.message));
  }, []);

  const progressKey = source ? (source.kind === "local" ? "local" : SITE_WORLD) : undefined;
  const { state, log, submit } = useAdventure(world, progressKey);
  const carried = state
    ? Object.keys(state.items).filter((id) => state.items[id] === "inventory")
    : [];

  return (
    <SiteShell>
      <div className="adv-page">
        <header className="adv-page__header">
          <Heading level={1}>Adventure</Heading>
          <Text tone="muted">
            A small text adventure. Type what you want to do; &ldquo;help&rdquo; lists the basics.{" "}
            <NextLink href="/adventure/editor">See how it&rsquo;s built</NextLink>.
          </Text>
        </header>

        {source?.kind === "local" ? (
          <p className="adv-banner" role="status">
            You&rsquo;re playing <strong>your own world</strong>
            {world ? <> (&ldquo;{world.title}&rdquo;)</> : null}, saved in this browser.{" "}
            <a href="/adventure">Play the real one</a> · <NextLink href="/adventure/editor">Back to the editor</NextLink>
          </p>
        ) : null}
        {error ? (
          <p className="adv-banner adv-banner--error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="adv-game">
          <Terminal log={log} onSubmit={submit} autoFocus label="What do you do?" className="adv-game__term" />
          <aside className="adv-game__side" aria-label="Map and inventory">
            {world && state ? <MiniMap world={world} state={state} /> : null}
            <section className="adv-inventory">
              <h2>Carrying</h2>
              {carried.length ? (
                <ul>
                  {carried.map((id) => (
                    <li key={id}>
                      <button type="button" onClick={() => submit(`examine ${world?.items[id]?.name ?? id}`)}>
                        {world?.items[id]?.name ?? id}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nothing.</p>
              )}
            </section>
            {state ? <p className="adv-turns">Turns: {state.turns}</p> : null}
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}
