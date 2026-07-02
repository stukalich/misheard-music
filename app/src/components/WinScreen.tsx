import type { Dispatch } from 'react';
import type { GameAction, GameState } from '../game/gameReducer';
import { displayTeamName } from '../game/gameReducer';
import { ScoreRow } from './ScoreRow';

interface WinScreenProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function WinScreen({ state, dispatch }: WinScreenProps) {
  const maxScore = Math.max(...state.scores);
  const winners = state.scores
    .map((s, i) => ({ s, i }))
    .filter((x) => x.s === maxScore);
  const title =
    winners.length > 1
      ? `Ничья: ${winners.map((w) => displayTeamName(state.teamNames[w.i], w.i)).join(', ')}`
      : `Победила «${displayTeamName(state.teamNames[winners[0].i], winners[0].i)}»`;

  return (
    <div className="mm-screen mm-screen--with-exit">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="mm-label">Игра окончена</div>
        <div className="mm-title" style={{ fontSize: 22, margin: '8px 0 16px', lineHeight: 1.25 }}>
          {title}
        </div>
        <ScoreRow teamNames={state.teamNames} scores={state.scores} activeIndex={-1} />
        <button
          className="mm-btn mm-btn--ghost"
          style={{ width: '100%' }}
          onClick={() => dispatch({ type: 'PLAY_AGAIN' })}
        >
          Играть заново
        </button>
      </div>
    </div>
  );
}
