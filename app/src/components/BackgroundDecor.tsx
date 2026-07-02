function Sparkle({ className }: { className: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BackgroundDecor() {
  return (
    <div className="mm-decor" aria-hidden="true">
      <svg className="mm-decor-arcs" width="140" height="140" viewBox="0 0 140 140">
        <circle cx="10" cy="10" r="40" stroke="#f3b8c4" strokeWidth="6" fill="none" opacity="0.55" />
        <circle cx="10" cy="10" r="65" stroke="#f3b8c4" strokeWidth="6" fill="none" opacity="0.35" />
        <circle cx="10" cy="10" r="90" stroke="#f3b8c4" strokeWidth="6" fill="none" opacity="0.2" />
      </svg>
      <div className="mm-decor-blob mm-decor-blob--tr" />
      <div className="mm-decor-blob mm-decor-blob--bl" />
      <Sparkle className="mm-decor-sparkle mm-decor-sparkle--1" />
      <Sparkle className="mm-decor-sparkle mm-decor-sparkle--2" />
      <span className="mm-decor-dot mm-decor-dot--1" />
      <span className="mm-decor-dot mm-decor-dot--2" />
      <span className="mm-decor-dot mm-decor-dot--3" />
      <span className="mm-decor-dot mm-decor-dot--4" />
    </div>
  );
}
