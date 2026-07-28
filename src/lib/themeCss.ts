import type { Theme } from "@noahwright/design";

function toKebabCase(key: string): string {
  return key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function buildBlock(selector: string, theme: Theme): string {
  const entries = Object.entries(theme)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `--${toKebabCase(key)}:${value}`);
  return entries.length > 0 ? `${selector}{${entries.join(";")}}` : "";
}

export function buildThemeCss(theme: Theme, darkTheme?: Theme): string {
  return buildBlock(":root", theme) + (darkTheme ? buildBlock('[data-theme="dark"]', darkTheme) : "");
}
