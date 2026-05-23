export default function ResumeIcon({ size = 20, color = "currentColor" }) {
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
      <path
        d="M8 3.75A2.25 2.25 0 0 0 5.75 6v12A2.25 2.25 0 0 0 8 20.25h8A2.25 2.25 0 0 0 18.25 18V8.5L13.75 3.75H8Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 3.75V7a1 1 0 0 0 1 1h3.25"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 11.5h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 14.5h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}