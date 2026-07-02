import { useEffect, useRef, useState, type Dispatch } from 'react';
import type { GameAction, GameState } from '../game/gameReducer';
import { displayTeamName } from '../game/gameReducer';
import { teamColor, LOW_TIME_THRESHOLD } from '../game/constants';
import { PauseIcon, SwipeArrowIcon } from './icons';
import { Card } from './Card';

interface TurnScreenProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function TurnScreen({ state, dispatch }: TurnScreenProps) {
  const [vignette, setVignette] = useState<'correct' | 'wrong' | null>(null);
  const vignetteTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (vignetteTimeout.current !== null) window.clearTimeout(vignetteTimeout.current);
    };
  }, []);

  if (!state.currentCard) return null;

  const flashVignette = (correct: boolean) => {
    setVignette(correct ? 'correct' : 'wrong');
    if (vignetteTimeout.current !== null) window.clearTimeout(vignetteTimeout.current);
    vignetteTimeout.current = window.setTimeout(() => setVignette(null), 300);
  };

  const handleAdvance = (correct: boolean) => dispatch({ type: 'ANSWER', correct });

  const color = teamColor(state.turnIndex);
  const pct = Math.max(0, (state.timeLeft / state.roundTime) * 100);
  const isLow = state.timeLeft > 0 && state.timeLeft <= LOW_TIME_THRESHOLD;

  return (
    <div className="mm-screen mm-screen--turn">
      <div className="mm-topbar">
        <span className="mm-team-pill" style={{ background: color }} title={displayTeamName(state.teamNames[state.turnIndex], state.turnIndex)}>
          {displayTeamName(state.teamNames[state.turnIndex], state.turnIndex)}
        </span>
        <button className="mm-icon-btn" aria-label="Пауза" onClick={() => dispatch({ type: 'PAUSE' })}>
          <PauseIcon />
        </button>
      </div>

      <div className="mm-timer-wrap">
        <div className={`mm-timer-num${isLow ? ' mm-low-time' : ''}`}>{state.timeLeft}</div>
        <div className="mm-timer-track">
          <div
            className="mm-timer-fill"
            style={{ width: `${pct}%`, backgroundColor: isLow ? 'var(--wrong)' : color }}
          />
        </div>
        <div className="mm-turn-score">
          Очки хода: {state.turnScore >= 0 ? '+' : ''}
          {state.turnScore}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 18px' }}>
        <Card
          cardSeq={state.cardSeq}
          card={state.currentCard}
          flipped={state.flipped}
          hasRevealed={state.hasRevealed}
          disabled={state.paused || state.exitModalOpen}
          onFlip={() => dispatch({ type: 'FLIP_CARD' })}
          onFeedback={flashVignette}
          onAdvance={handleAdvance}
        />

        <div className="mm-legend-zone">
          <p className="mm-legend-hint" style={{ margin: 0, opacity: state.hasRevealed ? 0 : 1 }}>
            Тапни карточку, чтобы увидеть ответ
          </p>
          <div
            className="mm-legend"
            style={{ opacity: state.hasRevealed ? 1 : 0, pointerEvents: state.hasRevealed ? 'auto' : 'none' }}
          >
            <p className="mm-legend-hint">Нажми ещё раз, чтобы перевернуть обратно</p>
            <div className="mm-legend-row">
              <div className="mm-legend-side">
                <SwipeArrowIcon color="var(--ink)" flip />
                <button
                  className="mm-icon-badge"
                  style={{ background: 'var(--wrong)' }}
                  disabled={!state.hasRevealed}
                  onClick={() => {
                    flashVignette(false);
                    handleAdvance(false);
                  }}
                >
                  ✗
                </button>
              </div>
              <div className="mm-legend-side">
                <button
                  className="mm-icon-badge"
                  style={{ background: 'var(--correct)' }}
                  disabled={!state.hasRevealed}
                  onClick={() => {
                    flashVignette(true);
                    handleAdvance(true);
                  }}
                >
                  ✓
                </button>
                <SwipeArrowIcon color="var(--ink)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mm-vignette"
        style={{
          opacity: vignette ? 1 : 0,
          background: vignette
            ? `radial-gradient(ellipse at center, transparent 40%, var(--${vignette === 'correct' ? 'correct' : 'wrong'}) 170%)`
            : undefined,
        }}
      />
    </div>
  );
}
