export default function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M7 16V10M12 16V7M17 16V13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="17" cy="7" r="2.5" fill="rgb(var(--accent))" />
    </svg>
  );
}
