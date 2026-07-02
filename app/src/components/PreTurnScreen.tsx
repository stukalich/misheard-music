import type { Dispatch } from 'react';
import type { GameAction, GameState } from '../game/gameReducer';
import { displayTeamName } from '../game/gameReducer';
import { ScoreRow } from './ScoreRow';
import { ButtonArrowIcon } from './icons';

interface PreTurnScreenProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function PreTurnScreen({ state, dispatch }: PreTurnScreenProps) {
  return (
    <div className="mm-screen mm-screen--with-exit">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ScoreRow teamNames={state.teamNames} scores={state.scores} activeIndex={state.turnIndex} />
        <div className="mm-panel" style={{ textAlign: 'left' }}>
          <div className="mm-label">Ход команды</div>
          <div className="mm-title" style={{ fontSize: 22, margin: '8px 0 10px' }}>
            {displayTeamName(state.teamNames[state.turnIndex], state.turnIndex)}
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.5, margin: '0 0 16px', opacity: 0.65 }}>
            Игрок 1 читает ослышку ровным голосом, не подпевая. Игрок 2 угадывает вслух. Дальше — только жесты.
          </p>
          <button
            className="mm-btn mm-btn--primary"
            style={{ width: '100%' }}
            onClick={() => dispatch({ type: 'START_TURN' })}
          >
            <span>Начать ход ({state.roundTime} сек)</span>
            <ButtonArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
