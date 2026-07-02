import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { Card as CardData } from '../types';
import { DRAG_THRESHOLD, SWIPE_THRESHOLD, CARD_FLY_DISTANCE, CARD_DRAG_CLAMP } from '../game/constants';

interface CardProps {
  cardSeq: number;
  card: CardData;
  flipped: boolean;
  hasRevealed: boolean;
  disabled: boolean;
  onFlip: () => void;
  onFeedback: (correct: boolean) => void;
  onAdvance: (correct: boolean) => void;
}

interface DragState {
  startX: number;
  dx: number;
  moved: boolean;
}

function faceContent(card: CardData, isMis: boolean) {
  if (isMis) {
    return (
      <>
        <div className="mm-face-label">КАК СЛЫШИТСЯ</div>
        <div className="mm-face-main">{card.mis}</div>
      </>
    );
  }
  if (card.title) {
    const showTitleLine = Boolean(card.real);
    return (
      <>
        <div className="mm-face-label">НА САМОМ ДЕЛЕ ЭТО</div>
        <div className="mm-face-main">{card.real ?? card.title}</div>
        <hr className="mm-rule" />
        <div className="mm-face-artist">{card.artist}</div>
        {showTitleLine && <div className="mm-face-title">{card.title}</div>}
      </>
    );
  }
  return (
    <>
      <div className="mm-face-label">НА САМОМ ДЕЛЕ ЭТО</div>
      <div className="mm-face-main">{card.real}</div>
    </>
  );
}

export function Card({ cardSeq, card, flipped, hasRevealed, disabled, onFlip, onFeedback, onAdvance }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    dragRef.current = { startX: e.clientX, dx: 0, moved: false };
    const el = cardRef.current;
    if (el) {
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      el.style.transition = 'none';
      el.classList.add('mm-card--pressing');
    }
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = cardRef.current;
    if (!drag || !el) return;
    drag.dx = e.clientX - drag.startX;
    if (Math.abs(drag.dx) > DRAG_THRESHOLD) drag.moved = true;
    if (hasRevealed) {
      const clamped = Math.max(-CARD_DRAG_CLAMP, Math.min(CARD_DRAG_CLAMP, drag.dx));
      el.style.transform = `translateX(${clamped}px) rotate(${clamped / 16}deg)`;
    }
  };

  const endDrag = () => {
    const drag = dragRef.current;
    const el = cardRef.current;
    if (!drag || !el) return;
    const { dx, moved } = drag;
    el.classList.remove('mm-card--pressing');
    el.style.transition = 'transform .2s var(--ease-spring)';

    if (hasRevealed && dx > SWIPE_THRESHOLD) {
      onFeedback(true);
      el.style.transform = `translateX(${CARD_FLY_DISTANCE}px) rotate(16deg)`;
      el.style.opacity = '0';
      window.setTimeout(() => onAdvance(true), 130);
    } else if (hasRevealed && dx < -SWIPE_THRESHOLD) {
      onFeedback(false);
      el.style.transform = `translateX(${-CARD_FLY_DISTANCE}px) rotate(-16deg)`;
      el.style.opacity = '0';
      window.setTimeout(() => onAdvance(false), 130);
    } else if (!moved) {
      onFlip();
    } else {
      el.style.transform = '';
    }
    dragRef.current = null;
  };

  return (
    <div className="mm-stack">
      <div className="mm-card-back mm-card-back--2" />
      <div className="mm-card-back mm-card-back--1" />
      <div
        key={cardSeq}
        ref={cardRef}
        className="mm-card"
        style={{ background: flipped ? 'var(--card-back)' : 'var(--ink)' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="mm-face" style={{ opacity: flipped ? 0 : 1 }}>
          {faceContent(card, true)}
        </div>
        <div className="mm-face" style={{ opacity: flipped ? 1 : 0 }}>
          {faceContent(card, false)}
        </div>
      </div>
    </div>
  );
}
