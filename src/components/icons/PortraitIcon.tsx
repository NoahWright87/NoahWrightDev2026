export default function PortraitIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="8.5" r="3.5" stroke={color} strokeWidth="1.8" />
      <path
        d="M4.75 19.25c1.1-3.4 4-5.25 7.25-5.25s6.15 1.85 7.25 5.25"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
