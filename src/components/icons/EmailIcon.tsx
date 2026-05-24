export default function EmailIcon({ size = 20, color = "currentColor" }) {
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
      <rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M4.5 7.5L12 13.5L19.5 7.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.8 17.2L9.8 12.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19.2 17.2L14.2 12.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}