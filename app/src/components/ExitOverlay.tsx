interface ExitOverlayProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function ExitOverlay({ onCancel, onConfirm }: ExitOverlayProps) {
  return (
    <div className="mm-overlay mm-overlay--exit">
      <div className="mm-overlay-title">Выйти в меню?</div>
      <div className="mm-overlay-sub">Текущая игра и весь счёт будут потеряны</div>
      <div className="mm-overlay-actions">
        <button className="mm-btn mm-btn--ghost-inverse" style={{ flex: 1 }} onClick={onCancel}>
          Отмена
        </button>
        <button className="mm-btn mm-btn--danger" style={{ flex: 1 }} onClick={onConfirm}>
          Выйти
        </button>
      </div>
    </div>
  );
}
