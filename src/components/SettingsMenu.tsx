"use client";

import { useEffect, useId, useState } from "react";
import {
  FOOTER_STYLES,
  Menu,
  getFooterStyle,
  initThemeMode,
  setFooterStyle,
  subscribeFooterStyle,
  subscribeThemeMode,
  toggleThemeMode,
  usePrefersReducedMotion,
  type FooterStyle,
  type ThemeMode,
} from "@noahwright/design";

const THEMES: Array<{ value: ThemeMode; label: string; hint: string }> = [
  { value: "light", label: "Light", hint: "Sun over the sea" },
  { value: "dark", label: "Dark", hint: "Moon and stars" },
];

const FOOTER_CHOICES: Record<FooterStyle, { label: string; hint: string }> = {
  auto: { label: "Auto", hint: "Best for this device" },
  static: { label: "Still", hint: "No animation at all" },
  flat: { label: "Reflection", hint: "Calm mirror, no ripples" },
  animated: { label: "Animated", hint: "Rippling water (WebGL)" },
};

function Option({
  label,
  hint,
  checked,
  disabled,
  onSelect,
}: {
  label: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      disabled={disabled}
      className="settings-option"
      onClick={onSelect}
    >
      <span className="settings-option__mark" aria-hidden="true">
        {checked ? "✓" : ""}
      </span>
      <span className="settings-option__text">
        <span className="settings-option__label">{label}</span>
        <span className="settings-option__hint">{hint}</span>
      </span>
    </button>
  );
}

/** Whether this browser can run the footer's WebGL ripple. Probed only while the menu is open. */
function useWebglAvailable(): boolean {
  const [available, setAvailable] = useState(true);
  useEffect(() => {
    try {
      const gl = document.createElement("canvas").getContext("webgl");
      setAvailable(!!gl);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setAvailable(false);
    }
  }, []);
  return available;
}

function ThemeGroup() {
  const titleId = useId();
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    setMode(initThemeMode());
    return subscribeThemeMode(setMode);
  }, []);

  return (
    <div role="group" aria-labelledby={titleId} className="settings-group">
      <div id={titleId} className="settings-group__title">
        Theme
      </div>
      {THEMES.map((theme) => (
        <Option
          key={theme.value}
          label={theme.label}
          hint={theme.hint}
          checked={mode === theme.value}
          onSelect={() => {
            if (mode !== theme.value) toggleThemeMode();
          }}
        />
      ))}
    </div>
  );
}

function FooterGroup() {
  const titleId = useId();
  const [style, setStyle] = useState<FooterStyle>("auto");
  const reducedMotion = usePrefersReducedMotion();
  const webgl = useWebglAvailable();

  useEffect(() => {
    setStyle(getFooterStyle());
    return subscribeFooterStyle(setStyle);
  }, []);

  return (
    <div role="group" aria-labelledby={titleId} className="settings-group">
      <div id={titleId} className="settings-group__title">
        Footer
      </div>
      {FOOTER_STYLES.map((value) => {
        const choice = FOOTER_CHOICES[value];
        const needsMotion = value === "flat" || value === "animated";
        const hint =
          value === "animated" && !webgl ? "Needs WebGL: shows the reflection here" : choice.hint;
        return (
          <Option
            key={value}
            label={choice.label}
            hint={hint}
            checked={style === value}
            disabled={reducedMotion && needsMotion}
            onSelect={() => setFooterStyle(value)}
          />
        );
      })}
      {reducedMotion ? (
        <p className="settings-note">Your device asks for reduced motion, so the footer stays still.</p>
      ) : null}
    </div>
  );
}

/**
 * The ⚙️ menu in the header: light or dark, and how animated the footer is. The footer choice is a
 * reader override (see `setFooterStyle` in the design package): it is remembered, applies to every
 * page at once, and beats the site's own choice, including the still footers on /resume and the 404.
 */
export default function SettingsMenu() {
  return (
    <div className="settings-menu">
      <Menu trigger="⚙️" label="Settings" align="right">
        <ThemeGroup />
        <FooterGroup />
      </Menu>
    </div>
  );
}
