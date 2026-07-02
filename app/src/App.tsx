import { useEffect, useReducer } from 'react';
import { gameReducer, initialGameState } from './game/gameReducer';
import { loadDeckManifest, loadDeckCards } from './data/loadCards';
import { SetupScreen } from './components/SetupScreen';
import { DeckSelectScreen } from './components/DeckSelectScreen';
import { PreTurnScreen } from './components/PreTurnScreen';
import { TurnScreen } from './components/TurnScreen';
import { EndTurnScreen } from './components/EndTurnScreen';
import { WinScreen } from './components/WinScreen';
import { PauseOverlay } from './components/PauseOverlay';
import { ExitOverlay } from './components/ExitOverlay';
import { ExitIcon } from './components/icons';

function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initialGameState);

  useEffect(() => {
    let cancelled = false;
    loadDeckManifest()
      .then((decks) => {
        if (!cancelled) dispatch({ type: 'DECKS_LOADED', decks });
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!state.selectedDeckId) return;
    const deck = state.decks.find((d) => d.id === state.selectedDeckId);
    if (!deck) return;
    let cancelled = false;
    const deckId = state.selectedDeckId;
    loadDeckCards(deck.file)
      .then((cards) => {
        if (!cancelled) dispatch({ type: 'CARDS_LOADED', deckId, cards });
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      cancelled = true;
    };
  }, [state.selectedDeckId, state.decks]);

  useEffect(() => {
    if (state.screen !== 'turn' || state.paused || state.exitModalOpen) return;
    const id = window.setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => window.clearInterval(id);
  }, [state.screen, state.paused, state.exitModalOpen]);

  const showExit = state.screen !== 'setup';
  const handleExitClick = () => {
    if (state.screen === 'deckselect') {
      dispatch({ type: 'BACK_TO_SETUP' });
    } else {
      dispatch({ type: 'OPEN_EXIT_MODAL' });
    }
  };

  return (
    <div className="mm-app-shell">
      {showExit && (
        <button className="mm-exit-btn" aria-label="Назад" onClick={handleExitClick}>
          <ExitIcon />
        </button>
      )}

      {state.screen === 'setup' && <SetupScreen state={state} dispatch={dispatch} />}
      {state.screen === 'deckselect' && <DeckSelectScreen state={state} dispatch={dispatch} />}
      {state.screen === 'preturn' && <PreTurnScreen state={state} dispatch={dispatch} />}
      {state.screen === 'turn' && <TurnScreen state={state} dispatch={dispatch} />}
      {state.screen === 'endturn' && <EndTurnScreen state={state} dispatch={dispatch} />}
      {state.screen === 'win' && <WinScreen state={state} dispatch={dispatch} />}

      {state.paused && !state.exitModalOpen && <PauseOverlay onResume={() => dispatch({ type: 'RESUME' })} />}
      {state.exitModalOpen && (
        <ExitOverlay
          onCancel={() => dispatch({ type: 'CANCEL_EXIT' })}
          onConfirm={() => dispatch({ type: 'CONFIRM_EXIT' })}
        />
      )}
    </div>
  );
}

export default App;
