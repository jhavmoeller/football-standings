import { useMemo } from "react";
import { TableEntry } from "./App-new";

function TeamLogo({ team, teams }: { team: string; teams: TableEntry[] }) {
  const getLogo = (teamName: string) => {
    const teamId = teams.find((t) => t.team.shortName === teamName)?.team.id;
    if (!teamId) return "";
    return `https://resources.premierleague.com/premierleague25/badges-alt/${teamId}.png`;
  };

  const backgrondColor = useMemo(() => {
    if (team === "Liverpool") return "#E31F26";
    if (team === "Nott'm Forest") return "#E53233";
    if (team === "Spurs") return "#000A3C";
  }, [team]);

  return (
    <div className={`flex items-center justify-center`}>
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center"
        style={{ backgroundColor: backgrondColor }}
      >
        <img height={20} width={20} src={getLogo(team)} alt={team} />
      </div>
    </div>
  );
}
export default TeamLogo;
