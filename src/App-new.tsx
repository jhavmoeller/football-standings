import { useCallback, useMemo, useState } from "react";
import TeamLogo from "./TeamLogo";

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

type PersonWithScore = {
  person: string;
  score: {
    score: number;
    inTopTen: string[];
    correctPosition: string[];
  };
};

type RankGroup = {
  rank: number;
  points: number;
  persons: PersonWithScore[];
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
      const inTopTen: string[] = [];
      const correctPosition: string[] = [];
      prediction.forEach((team, index) => {
        if (topTen[index] && topTen[index].team.shortName === team) {
          correctPosition.push(team);
          return;
        }

        if (topTen.some((t) => t.team.shortName === team)) {
          inTopTen.push(team);
        }
      });
      return {
        score: inTopTen.length * 2 + correctPosition.length * 5,
        inTopTen,
        correctPosition,
      };
    },
    [topTen]
  );

  const ranking = useMemo(() => {
    const predictionsWithScores = predictions
      .map((p) => ({
        person: p.person,
        score: getScore(p.prediction),
      }))
      .sort((a, b) => b.score.score - a.score.score);

    return predictionsWithScores.reduce<RankGroup[]>((acc, curr, index) => {
      const prev = acc[acc.length - 1];

      if (prev && prev.points === curr.score.score) {
        // Same points → add person to existing group
        prev.persons.push(curr);
      } else {
        // New group → rank is index+1 (skips numbers if ties exist)
        acc.push({
          rank: index + 1,
          points: curr.score.score,
          persons: [curr],
        });
      }

      return acc;
    }, []);
  }, [getScore]);

  return (
    <div className="min-h-screen flex items-start justify-center p-8">
      <div className="w-full max-w-6xl">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold mb-4">
            Plex: Premier League Top 10 Predictions
          </h1>
          <p className="text-md text-gray-600">
            <ul className="list-disc list-inside">
              <li>
                5 point for{" "}
                <span className="bg-green-100">korrekt position</span>
              </li>
              <li>
                2 point for <span className="bg-yellow-100">korrekt hold</span>
              </li>
              <li>Præmier til Top 3 🏆</li>
              <li>
                Spillet slutter den 4. November, efter <strong>runde 10</strong>
                , og udsatte kampe herefter udgår
              </li>
            </ul>
          </p>
        </header>

        <main className="grid grid-cols-1 gap-6">
          <section className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-medium">Live score and predictions</h2>
            </div>

            <div className="p-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2 bg-gray-200">Live</th>
                    {predictions.map((p) => (
                      <th className="px-4 py-2" key={p.person}>
                        {p.person}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topTen &&
                    topTen.map((team, index) => (
                      <tr className="hover:bg-gray-50" key={team.team.id}>
                        <td className="px-4 py-2">{team.overall.position}</td>
                        <td className="px-4 py-2 text-center bg-gray-200 text-white">
                          <TeamLogo team={team.team.shortName} teams={table} />
                        </td>
                        {predictions.map((p) => (
                          <td className="px-4 py-2" key={p.person}>
                            {p.prediction[index] && (
                              <TeamLogo
                                team={p.prediction[index]}
                                teams={table}
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
          <aside className="bg-white shadow rounded-lg p-4">
            <h3 className="font-medium mb-3">Ranking</h3>
            <ol className="space-y-2">
              {ranking.map((group) => (
                <li
                  key={group.rank}
                  className="flex items-center justify-between p-2 rounded"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-semibold">
                      {group.rank}
                    </span>
                    <div>
                      <div className="font-xs">
                        {group.persons.map((p) => (
                          <>
                            <span key={p.person} className="font-medium mr-2">
                              {p.person} (
                              <span className="text-gray-500 bg-green-100 px-1 rounded-full">
                                {p.score.correctPosition.length}
                              </span>
                              <span className="text-gray-500">,</span>
                              <span className="text-gray-500 bg-yellow-100 px-1 rounded-full">
                                {p.score.inTopTen.length}
                              </span>
                              )
                            </span>
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-right">
                    {group.points} pts
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default App;
