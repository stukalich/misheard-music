import type { Dispatch } from 'react';
import type { GameAction, GameState } from '../game/gameReducer';
import { CheckIcon } from './icons';

interface DeckSelectScreenProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function DeckSelectScreen({ state, dispatch }: DeckSelectScreenProps) {
  const canStart = state.allCards.length > 0;

  return (
    <div className="mm-screen mm-screen--with-exit">
      <div style={{ textAlign: 'left', padding: '0 0 18px' }}>
        <div className="mm-title" style={{ fontSize: 22 }}>
          Выбери колоду
        </div>
        <div className="mm-label" style={{ marginTop: 8 }}>
          Можно сменить в следующей игре
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {state.decks.map((deck) => {
          const active = deck.id === state.selectedDeckId;
          return (
            <button
              key={deck.id}
              type="button"
              className={`mm-deck-option${active ? ' mm-deck-option--active' : ''}`}
              onClick={() => dispatch({ type: 'SELECT_DECK', deckId: deck.id })}
            >
              <span className="mm-deck-dot" style={{ background: deck.color }} />
              <span style={{ flex: 1 }}>
                <span className="mm-deck-title">{deck.title}</span>
                <span className="mm-deck-desc">{deck.description}</span>
              </span>
              {active && (
                <span className="mm-deck-check">
                  <CheckIcon />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        className="mm-btn mm-btn--primary"
        style={{ width: '100%' }}
        disabled={!canStart}
        onClick={() => dispatch({ type: 'START_GAME' })}
      >
        {canStart ? 'Начать игру' : 'Загрузка колоды…'}
      </button>
    </div>
  );
}
