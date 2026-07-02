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

export function StopwatchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 1.5 H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M8 1.5 V3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="9" r="5.6" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M8 6 V9 L10.2 10.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrophyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M5 2 H11 V6.5 C11 8.4 9.65 10 8 10 C6.35 10 5 8.4 5 6.5 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="none"
        strokeLinejoin="round"
      />
      <path d="M5 3 H3.2 C3.2 5 4.2 6 5 6.2" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M11 3 H12.8 C12.8 5 11.8 6 11 6.2" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M8 10 V12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M5.5 14 H10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M6.3 12.5 H9.7 L9.4 14 H6.6 Z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

export function SoundWaveIcon({ flip }: { flip?: boolean }) {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      aria-hidden="true"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path d="M1 6 H4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 2 V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <path d="M10.5 0.5 V11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
      <path d="M14 3 V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.25" />
    </svg>
  );
}

export function ButtonArrowIcon() {
  return (
    <svg width="34" height="16" viewBox="0 0 34 16" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M1 5.5 L6 5.5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.85" transform="rotate(-24 3 5.5)" />
      <path d="M1 9.5 L7 9.5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.55" transform="rotate(-24 3 9.5)" />
      <path d="M13 8 H29" stroke="var(--coral)" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M23 2.5 L29.5 8 L23 13.5"
        stroke="var(--coral)"
        strokeWidth="2.4"
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
