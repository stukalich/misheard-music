export const TEAM_COLORS = ['#E24C4C', '#E0A72F', '#1FA97A', '#6B4CE0', '#D6316C', '#2F8FE0'];

export const TEAMS_MIN = 2;
export const TEAMS_MAX = 8;
export const TEAMS_DEFAULT = 3;

export const ROUND_TIME_MIN = 20;
export const ROUND_TIME_MAX = 90;
export const ROUND_TIME_STEP = 5;
export const ROUND_TIME_DEFAULT = 45;

export const TARGET_SCORE_MIN = 10;
export const TARGET_SCORE_MAX = 50;
export const TARGET_SCORE_STEP = 5;
export const TARGET_SCORE_DEFAULT = 20;

export const LOW_TIME_THRESHOLD = 10;

export const DRAG_THRESHOLD = 6;
export const SWIPE_THRESHOLD = 90;
export const CARD_FLY_DISTANCE = 260;
export const CARD_DRAG_CLAMP = 160;

export function teamColor(index: number): string {
  return TEAM_COLORS[index % TEAM_COLORS.length];
}

export function defaultTeamName(index: number): string {
  return `Команда ${index + 1}`;
}
