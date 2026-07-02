import type { Card, CardsDeckFile, DecksManifest, DeckMeta } from '../types';

const DATA_BASE = `${import.meta.env.BASE_URL}data/decks/`;

export async function loadDeckManifest(): Promise<DeckMeta[]> {
  const res = await fetch(`${DATA_BASE}manifest.json`);
  if (!res.ok) {
    throw new Error(`Не удалось загрузить список колод: ${res.status}`);
  }
  const data: DecksManifest = await res.json();
  if (!Array.isArray(data.decks) || data.decks.length === 0) {
    throw new Error('Список колод пуст');
  }
  return data.decks;
}

export async function loadDeckCards(file: string): Promise<Card[]> {
  const res = await fetch(`${DATA_BASE}${file}`);
  if (!res.ok) {
    throw new Error(`Не удалось загрузить колоду карточек: ${res.status}`);
  }
  const data: CardsDeckFile = await res.json();
  if (!Array.isArray(data.cards) || data.cards.length === 0) {
    throw new Error('Колода карточек пуста');
  }
  return data.cards;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
