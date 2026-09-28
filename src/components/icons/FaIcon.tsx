import type { IconDefinition } from "@fortawesome/fontawesome-common-types";

/**
 * Renders a Font Awesome icon definition as a plain inline SVG, without the
 * Font Awesome React runtime or its global CSS. Decorative: the button or link
 * around it carries the accessible name.
 */
export default function FaIcon({
  icon,
  size = 20,
  color = "currentColor",
}: {
  icon: IconDefinition;
  size?: number;
  color?: string;
}) {
  const [width, height, , , pathData] = icon.icon;
  const paths = Array.isArray(pathData) ? pathData : [pathData];
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${width} ${height}`}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  );
}
