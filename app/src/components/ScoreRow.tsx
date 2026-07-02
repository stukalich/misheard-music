import { displayTeamName } from '../game/gameReducer';

interface ScoreRowProps {
  teamNames: string[];
  scores: number[];
  activeIndex: number;
}

export function ScoreRow({ teamNames, scores, activeIndex }: ScoreRowProps) {
  return (
    <div className="mm-score-row">
      {scores.map((s, i) => (
        <div
          key={i}
          className={`mm-chip${i === activeIndex ? ' mm-chip--active' : ''}`}
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <div className="mm-chip-name" style={{ opacity: i === activeIndex ? 0.85 : 0.5 }}>
            {displayTeamName(teamNames[i], i)}
          </div>
          <div className="mm-chip-score">{s}</div>
        </div>
      ))}
    </div>
  );
}
