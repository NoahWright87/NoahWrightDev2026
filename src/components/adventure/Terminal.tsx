"use client";

import { useEffect, useRef, useState } from "react";
import type { LogLine } from "./useAdventure";

interface TerminalProps {
  log: LogLine[];
  onSubmit: (input: string) => void;
  /** Accessible name for the input. */
  label?: string;
  autoFocus?: boolean;
  className?: string;
}

/**
 * A scrolling log and a prompt, with shell-style history on ↑/↓. Clicking
 * anywhere in the terminal focuses the prompt, like a real one.
 */
export default function Terminal({ log, onSubmit, label = "Command", autoFocus, className }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const command = input.trim();
    if (!command) return;
    onSubmit(command);
    setHistory((h) => (h[h.length - 1] === command ? h : [...h, command].slice(-100)));
    setCursor(null);
    setInput("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    if (!history.length) return;
    e.preventDefault();
    let next: number | null;
    if (e.key === "ArrowUp") next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
    else next = cursor === null || cursor >= history.length - 1 ? null : cursor + 1;
    setCursor(next);
    setInput(next === null ? "" : history[next]);
  }

  return (
    <div
      className={`adv-term ${className ?? ""}`}
      onClick={() => {
        // Don't steal a text selection someone is making in the log.
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      <div className="adv-term__log" ref={logRef} role="log" aria-live="polite" aria-label="Game output">
        {log.map((line) => (
          <p key={line.id} className={`adv-line adv-line--${line.kind}`}>
            {line.kind === "echo" ? <span aria-hidden="true">&gt; </span> : null}
            {line.text}
          </p>
        ))}
      </div>
      <form className="adv-term__prompt" onSubmit={submit}>
        <span className="adv-term__caret" aria-hidden="true">&gt;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setCursor(null);
          }}
          onKeyDown={onKeyDown}
          aria-label={label}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          autoFocus={autoFocus}
        />
      </form>
    </div>
  );
}
