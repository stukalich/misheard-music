import type { Card, DeckMeta, Screen } from '../types';
import { shuffle } from '../data/loadCards';
import { TEAMS_DEFAULT, ROUND_TIME_DEFAULT, TARGET_SCORE_DEFAULT, defaultTeamName } from './constants';

export interface GameState {
  screen: Screen;

  // settings, persist across "play again"
  teamsCount: number;
  roundTime: number;
  targetScore: number;
  teamNames: string[];

  // deck selection
  decks: DeckMeta[];
  selectedDeckId: string | null;

  // deck
  allCards: Card[];
  deck: Card[];
  deckPos: number;

  // match progress
  scores: number[];
  turnIndex: number;

  // current turn
  currentCard: Card | null;
  /** Increments on every card draw; used as a React remount key for the card element. */
  cardSeq: number;
  turnScore: number;
  timeLeft: number;
  paused: boolean;
  exitModalOpen: boolean;
  flipped: boolean;
  hasRevealed: boolean;
}

export type GameAction =
  | { type: 'DECKS_LOADED'; decks: DeckMeta[] }
  | { type: 'CARDS_LOADED'; deckId: string; cards: Card[] }
  | { type: 'SET_TEAMS_COUNT'; count: number }
  | { type: 'SET_TEAM_NAME'; index: number; name: string }
  | { type: 'SET_ROUND_TIME'; value: number }
  | { type: 'SET_TARGET_SCORE'; value: number }
  | { type: 'GO_TO_DECKSELECT' }
  | { type: 'SELECT_DECK'; deckId: string }
  | { type: 'BACK_TO_SETUP' }
  | { type: 'START_GAME' }
  | { type: 'START_TURN' }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'OPEN_EXIT_MODAL' }
  | { type: 'CANCEL_EXIT' }
  | { type: 'CONFIRM_EXIT' }
  | { type: 'FLIP_CARD' }
  | { type: 'ANSWER'; correct: boolean }
  | { type: 'CONTINUE_AFTER_TURN' }
  | { type: 'PLAY_AGAIN' };

function resizeTeamNames(names: string[], count: number): string[] {
  const next = names.slice(0, count);
  while (next.length < count) next.push(defaultTeamName(next.length));
  return next;
}

export function displayTeamName(name: string, index: number): string {
  return name.trim() || defaultTeamName(index);
}

export function initialGameState(): GameState {
  return {
    screen: 'setup',
    teamsCount: TEAMS_DEFAULT,
    roundTime: ROUND_TIME_DEFAULT,
    targetScore: TARGET_SCORE_DEFAULT,
    teamNames: resizeTeamNames([], TEAMS_DEFAULT),
    decks: [],
    selectedDeckId: null,
    allCards: [],
    deck: [],
    deckPos: 0,
    scores: [],
    turnIndex: 0,
    currentCard: null,
    cardSeq: 0,
    turnScore: 0,
    timeLeft: 0,
    paused: false,
    exitModalOpen: false,
    flipped: false,
    hasRevealed: false,
  };
}

function drawNextCard(state: GameState): Pick<GameState, 'deck' | 'deckPos' | 'currentCard' | 'cardSeq'> {
  let deck = state.deck;
  let deckPos = state.deckPos;
  if (deckPos >= deck.length) {
    deck = shuffle(state.allCards);
    deckPos = 0;
  }
  const currentCard = deck[deckPos];
  return { deck, deckPos: deckPos + 1, currentCard, cardSeq: state.cardSeq + 1 };
}

/** Fields carried over when returning to Setup (exit / play again) — settings and already-fetched deck data. */
function carryOverSettings(state: GameState) {
  return {
    decks: state.decks,
    selectedDeckId: state.selectedDeckId,
    allCards: state.allCards,
    teamsCount: state.teamsCount,
    roundTime: state.roundTime,
    targetScore: state.targetScore,
    teamNames: state.teamNames,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'DECKS_LOADED':
      return {
        ...state,
        decks: action.decks,
        selectedDeckId: state.selectedDeckId ?? action.decks[0]?.id ?? null,
      };

    case 'CARDS_LOADED':
      if (action.deckId !== state.selectedDeckId) return state;
      return { ...state, allCards: action.cards };

    case 'SET_TEAMS_COUNT': {
      const teamsCount = action.count;
      return { ...state, teamsCount, teamNames: resizeTeamNames(state.teamNames, teamsCount) };
    }

    case 'SET_TEAM_NAME': {
      const teamNames = state.teamNames.slice();
      teamNames[action.index] = action.name;
      return { ...state, teamNames };
    }

    case 'SET_ROUND_TIME':
      return { ...state, roundTime: action.value };

    case 'SET_TARGET_SCORE':
      return { ...state, targetScore: action.value };

    case 'GO_TO_DECKSELECT':
      return { ...state, screen: 'deckselect' };

    case 'SELECT_DECK':
      if (action.deckId === state.selectedDeckId) return state;
      return { ...state, selectedDeckId: action.deckId, allCards: [] };

    case 'BACK_TO_SETUP':
      return { ...state, screen: 'setup' };

    case 'START_GAME':
      return {
        ...state,
        teamNames: resizeTeamNames(state.teamNames, state.teamsCount),
        scores: Array(state.teamsCount).fill(0),
        turnIndex: 0,
        deck: shuffle(state.allCards),
        deckPos: 0,
        screen: 'preturn',
      };

    case 'START_TURN': {
      const drawn = drawNextCard(state);
      return {
        ...state,
        ...drawn,
        turnScore: 0,
        timeLeft: state.roundTime,
        paused: false,
        flipped: false,
        hasRevealed: false,
        screen: 'turn',
      };
    }

    case 'TICK': {
      if (state.screen !== 'turn' || state.paused || state.exitModalOpen) return state;
      const timeLeft = Math.max(0, state.timeLeft - 1);
      if (timeLeft > 0) return { ...state, timeLeft };

      const scores = state.scores.slice();
      scores[state.turnIndex] = Math.max(0, scores[state.turnIndex] + state.turnScore);
      return { ...state, timeLeft: 0, scores, screen: 'endturn' };
    }

    case 'PAUSE':
      return state.screen === 'turn' && !state.paused ? { ...state, paused: true } : state;

    case 'RESUME':
      return state.paused ? { ...state, paused: false } : state;

    case 'OPEN_EXIT_MODAL':
      return state.screen === 'setup' || state.screen === 'deckselect' ? state : { ...state, exitModalOpen: true };

    case 'CANCEL_EXIT':
      return { ...state, exitModalOpen: false };

    case 'CONFIRM_EXIT':
      return {
        ...initialGameState(),
        ...carryOverSettings(state),
      };

    case 'FLIP_CARD':
      if (state.screen !== 'turn' || state.paused || state.exitModalOpen) return state;
      return { ...state, flipped: !state.flipped, hasRevealed: true };

    case 'ANSWER': {
      if (state.screen !== 'turn' || !state.hasRevealed || state.paused || state.exitModalOpen) return state;
      if (state.timeLeft <= 0) return state;
      const turnScore = state.turnScore + (action.correct ? 1 : -1);
      const drawn = drawNextCard({ ...state, turnScore });
      return {
        ...state,
        ...drawn,
        turnScore,
        flipped: false,
        hasRevealed: false,
      };
    }

    case 'CONTINUE_AFTER_TURN': {
      if (state.scores[state.turnIndex] >= state.targetScore) {
        return { ...state, screen: 'win' };
      }
      return { ...state, turnIndex: (state.turnIndex + 1) % state.teamsCount, screen: 'preturn' };
    }

    case 'PLAY_AGAIN':
      return {
        ...initialGameState(),
        ...carryOverSettings(state),
      };

    default:
      return state;
  }
}
