import { useCallback, useMemo, useState } from "react";

const url =
  "https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v5/competitions/8/seasons/2025/standings?live=false";

export type TableEntry = {
  overall: {
    position: number;
    points: number;
  };
  team: {
    id: number;
    shortName: string;
  };
};

const predictions = [
  {
    person: "Nico",
    prediction: [
      "Man City",
      "Man Utd",
      "Liverpool",
      "Spurs",
      "Arsenal",
      "Chelsea",
      "Aston Villa",
      "Newcastle",
      "Brighton",
      "Everton",
    ],
  },
  {
    person: "Emma",
    prediction: [
      "Liverpool",
      "Man City",
      "Arsenal",
      "Man Utd",
      "Chelsea",
      "Spurs",
      "Newcastle",
      "Aston Villa",
      "Brighton",
      "West Ham",
    ],
  },
  {
    person: "Anja",
    prediction: [
      "Liverpool",
      "Arsenal",
      "Man City",
      "Chelsea",
      "Aston Villa",
      "Newcastle",
      "Crystal Palace",
      "Brighton",
      "Bournemouth",
      "Brentford",
    ],
  },
  {
    person: "Peter",
    prediction: [
      "Man Utd",
      "Newcastle",
      "Arsenal",
      "Spurs",
      "Chelsea",
      "Man City",
      "Liverpool",
      "Fulham",
      "Brentford",
      "Aston Villa",
    ],
  },
  {
    person: "Simone",
    prediction: [
      "Chelsea",
      "Liverpool",
      "Arsenal",
      "Man City",
      "Newcastle",
      "Aston Villa",
      "Spurs",
      "Man Utd",
      "Brighton",
      "Bournemouth",
    ],
  },
  {
    person: "Maria",
    prediction: [
      "Liverpool",
      "Arsenal",
      "Man City",
      "Chelsea",
      "Newcastle",
      "Man Utd",
      "Aston Villa",
      "Brentford",
      "Spurs",
      "Brighton",
    ],
  },
  {
    person: "Johan",
    prediction: ["Arsenal", "Man City", "Liverpool", "Newcastle"],
  },
  {
    person: "Stella",
    prediction: [
      "Chelsea",
      "Liverpool",
      "Aston Villa",
      "Man City",
      "Arsenal",
      "Man Utd",
      "Newcastle",
      "Spurs",
      "Brighton",
      "Crystal Palace",
    ],
  },
  {
    person: "Emil",
    prediction: [
      "Liverpool",
      "Arsenal",
      "Chelsea",
      "Man City",
      "Man Utd",
      "Spurs",
      "Brighton",
      "Nott'm Forest",
      "Brentford",
      "Everton",
    ],
  },
  {
    person: "Stine",
    prediction: [
      "Chelsea",
      "Man Utd",
      "Burnley",
      "Spurs",
      "Newcastle",
      "Wolves",
      "Leeds",
      "Crystal Palace",
      "Brentford",
      "Liverpool",
    ],
  },
  {
    person: "Signe",
    prediction: [
      "Liverpool",
      "Arsenal",
      "Chelsea",
      "Man City",
      "Man Utd",
      "Spurs",
      "Nott'm Forest",
      "Newcastle",
      "Aston Villa",
      "Crystal Palace",
    ],
  },
];

function App() {
  const [table, setTable] = useState<TableEntry[]>([]);

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setTable(data.tables[0].entries);
    });

  const topTen = useMemo(() => {
    return table.slice(0, 10);
  }, [table]);

  const getScore = useCallback(
    (prediction: string[]) => {
      let score = 0;
      prediction.forEach((team, index) => {
        if (topTen.some((t) => t.team.shortName === team)) {
          score += 2;
        }

        if (topTen[index] && topTen[index].team.shortName === team) {
          score += 3;
        }
      });
      return score;
    },
    [topTen]
  );

  const ranking = useMemo(() => {
    return predictions
      .map((p) => ({
        person: p.person,
        score: getScore(p.prediction),
      }))
      .sort((a, b) => b.score - a.score);
  }, [getScore]);

  const getLogo = (teamName: string) => {
    const teamId = table.find((t) => t.team.shortName === teamName)?.team.id;
    if (!teamId) return "";
    return `https://resources.premierleague.com/premierleague25/badges-alt/${teamId}.png`;
  };

  return (
    <div className="flex">
      <table className="table-auto border-collapse border border-slate-400">
        <thead>
          <tr>
            <th>Position</th>
            <th>Live</th>
            {predictions.map((p) => (
              <th key={p.person}>{p.person}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topTen &&
            topTen.map((team, index) => (
              <tr key={team.team.id}>
                <td>{team.overall.position}</td>
                <td>
                  <img
                    height={32}
                    src={getLogo(team.team.shortName)}
                    alt={team.team.shortName}
                  />
                </td>
                {predictions.map((p) => (
                  <td key={p.person}>
                    <img
                      height={32}
                      src={getLogo(p.prediction[index])}
                      alt={p.prediction[index]}
                    />
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      <h2>Ranking</h2>
      <ol>
        {ranking
          .sort((a, b) => b.score - a.score)
          .map((r) => (
            <li key={r.person}>
              {r.person} - {r.score}
            </li>
          ))}
      </ol>
    </div>
  );
}

export default App;
