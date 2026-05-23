export default function LinkedInIcon({ size = 20, color = "currentColor" }) {
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
      <rect x="3" y="3" width="18" height="18" rx="4" fill={color} opacity="0.12" />
      <rect x="4.8" y="4.8" width="14.4" height="14.4" rx="3.2" stroke={color} strokeWidth="1.6" />
      <path d="M8.1 10.2V16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8.1" cy="7.9" r="1" fill={color} />
      <path d="M11.3 16V12.9C11.3 11.7 12 10.9 13.1 10.9C14.2 10.9 14.8 11.6 14.8 12.8V16" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.8 13.2C14.8 11.8 15.5 10.9 16.7 10.9C17.9 10.9 18.4 11.7 18.4 12.9V16" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}