import type { Dispatch } from 'react';
import type { GameAction, GameState } from '../game/gameReducer';
import { TEAMS_MIN, TEAMS_MAX, ROUND_TIME_MIN, ROUND_TIME_MAX, ROUND_TIME_STEP, TARGET_SCORE_MIN, TARGET_SCORE_MAX, TARGET_SCORE_STEP, teamColor } from '../game/constants';
import { PencilIcon } from './icons';
import logo from '../assets/misheard-logo.png';

interface SetupScreenProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function SetupScreen({ state, dispatch }: SetupScreenProps) {
  const canContinue = state.decks.length > 0;

  return (
    <div className="mm-screen">
      <div style={{ textAlign: 'center', padding: '24px 0 18px' }}>
        <img src={logo} alt="Misheard" style={{ width: '100%', maxWidth: 260, height: 'auto', display: 'block', margin: '0 auto' }} />
        <div className="mm-label" style={{ marginTop: 10 }}>
          Настройка игры
        </div>
      </div>

      <div className="mm-panel" style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 14 }}>
        <div>
          <div className="mm-row-between">
            <span className="mm-label">Команд</span>
            <span className="mm-value">{state.teamsCount}</span>
          </div>
          <input
            type="range"
            min={TEAMS_MIN}
            max={TEAMS_MAX}
            step={1}
            value={state.teamsCount}
            style={{ marginTop: 8 }}
            onChange={(e) => dispatch({ type: 'SET_TEAMS_COUNT', count: Number(e.target.value) })}
          />
        </div>

        <div>
          <div className="mm-label" style={{ marginBottom: 7 }}>
            Названия команд
          </div>
          <div>
            {state.teamNames.map((name, i) => (
              <div className="mm-team-row" key={i}>
                <span className="mm-team-dot" style={{ background: teamColor(i) }} />
                <input
                  type="text"
                  value={name}
                  placeholder={`Команда ${i + 1}`}
                  maxLength={20}
                  onChange={(e) => dispatch({ type: 'SET_TEAM_NAME', index: i, name: e.target.value })}
                />
                <span className="mm-team-pencil">
                  <PencilIcon />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mm-row-between">
            <span className="mm-label">Время на ход</span>
            <span className="mm-value">{state.roundTime} сек</span>
          </div>
          <input
            type="range"
            min={ROUND_TIME_MIN}
            max={ROUND_TIME_MAX}
            step={ROUND_TIME_STEP}
            value={state.roundTime}
            style={{ marginTop: 8 }}
            onChange={(e) => dispatch({ type: 'SET_ROUND_TIME', value: Number(e.target.value) })}
          />
        </div>

        <div>
          <div className="mm-row-between">
            <span className="mm-label">Очков до победы</span>
            <span className="mm-value">{state.targetScore}</span>
          </div>
          <input
            type="range"
            min={TARGET_SCORE_MIN}
            max={TARGET_SCORE_MAX}
            step={TARGET_SCORE_STEP}
            value={state.targetScore}
            style={{ marginTop: 8 }}
            onChange={(e) => dispatch({ type: 'SET_TARGET_SCORE', value: Number(e.target.value) })}
          />
        </div>
      </div>

      <button
        className="mm-btn mm-btn--primary"
        style={{ width: '100%' }}
        disabled={!canContinue}
        onClick={() => dispatch({ type: 'GO_TO_DECKSELECT' })}
      >
        {canContinue ? 'Далее' : 'Загрузка…'}
      </button>
    </div>
  );
}
