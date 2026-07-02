interface PauseOverlayProps {
  onResume: () => void;
}

export function PauseOverlay({ onResume }: PauseOverlayProps) {
  return (
    <div className="mm-overlay">
      <div className="mm-overlay-title">Пауза</div>
      <button className="mm-btn mm-btn--inverse" onClick={onResume}>
        Продолжить
      </button>
    </div>
  );
}
