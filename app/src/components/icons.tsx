export function ExitIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M10 2 L4 8 L10 14"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3" y="2" width="3.2" height="12" rx="1" fill="currentColor" />
      <rect x="9.8" y="2" width="3.2" height="12" rx="1" fill="currentColor" />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M11 2 L14 5 L5 14 L2 14 L2 11 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3 8.5 L6.5 12 L13 4.5"
        stroke="currentColor"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SwipeArrowIcon({ color, flip }: { color: string; flip?: boolean }) {
  return (
    <svg
      width="30"
      height="24"
      viewBox="0 0 70 56"
      aria-hidden="true"
      style={{ display: 'block', transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path d="M8 48 C 20 20, 40 10, 58 10" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path
        d="M44 4 L60 10 L52 26"
        stroke={color}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
