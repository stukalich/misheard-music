export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Card {
  mis: string;
  /** Song decks: real artist. Absent for idiom/phrase decks. */
  artist?: string;
  /** Song decks: real title. Absent for idiom/phrase decks. */
  title?: string;
  /** Idiom/phrase decks: the real expression. Also used by the "lines" song variant. */
  real?: string;
  difficulty?: Difficulty;
}

export interface CardsDeckFile {
  batch?: string;
  count?: number;
  note?: string;
  cards: Card[];
}

export interface DeckMeta {
  id: string;
  title: string;
  description: string;
  file: string;
  color: string;
}

export interface DecksManifest {
  decks: DeckMeta[];
}

export type Screen = 'setup' | 'deckselect' | 'preturn' | 'turn' | 'endturn' | 'win';
