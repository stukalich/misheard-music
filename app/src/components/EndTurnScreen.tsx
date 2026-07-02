import type { Dispatch } from 'react';
import type { GameAction, GameState } from '../game/gameReducer';
import { displayTeamName } from '../game/gameReducer';
import { ScoreRow } from './ScoreRow';

interface EndTurnScreenProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function EndTurnScreen({ state, dispatch }: EndTurnScreenProps) {
  const won = state.scores[state.turnIndex] >= state.targetScore;
  const sign = state.turnScore >= 0 ? '+' : '';
  const pointsWord = Math.abs(state.turnScore) === 1 ? 'очко' : 'очков';

  return (
    <div className="mm-screen mm-screen--with-exit">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ScoreRow teamNames={state.teamNames} scores={state.scores} activeIndex={state.turnIndex} />
        <div className="mm-panel">
          <div className="mm-label">Время вышло</div>
          <div className="mm-title" style={{ fontSize: 19, margin: '8px 0 16px' }}>
            {displayTeamName(state.teamNames[state.turnIndex], state.turnIndex)}: {sign}
            {state.turnScore} {pointsWord}
          </div>
          <button
            className="mm-btn mm-btn--primary"
            style={{ width: '100%' }}
            onClick={() => dispatch({ type: 'CONTINUE_AFTER_TURN' })}
          >
            {won ? 'Смотреть результат' : 'Следующая команда'}
          </button>
        </div>
      </div>
    </div>
  );
}
