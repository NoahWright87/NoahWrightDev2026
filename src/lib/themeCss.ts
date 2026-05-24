import type { Theme } from "@noahwright/design";

function toKebabCase(key: string): string {
  return key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export function buildThemeCss(theme: Theme): string {
  const entries = Object.entries(theme)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `--${toKebabCase(key)}:${value}`);

  return entries.length > 0 ? `:root{${entries.join(";")};}` : "";
}
