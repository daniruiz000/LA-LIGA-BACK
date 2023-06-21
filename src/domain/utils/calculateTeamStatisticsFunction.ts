import { IMatchCreate } from "../entities/match-entity";
import { ITeamsStatistics } from "../entities/team-entity";

export const calculateTeamStatisticsFunction = async (matches: IMatchCreate[]): Promise<ITeamsStatistics[]> => {
  const teams: Record<string, ITeamsStatistics> = {};

  matches.forEach((match) => {
    const localTeamId = match.localTeam._id;
    const visitorTeamId = match.visitorTeam._id;

    if (!teams[localTeamId]) {
      teams[localTeamId] = {
        id: localTeamId,
        name: match.localTeam.name,
        initials: match.localTeam.initials,
        image: match.localTeam.image,
        matchesPlayed: 0,
        matchesWon: 0,
        matchesLost: 0,
        matchesDrawn: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      };
    }

    if (!teams[visitorTeamId]) {
      teams[visitorTeamId] = {
        id: visitorTeamId,
        name: match.visitorTeam.name,
        initials: match.visitorTeam.initials,
        image: match.visitorTeam.image,
        matchesPlayed: 0,
        matchesWon: 0,
        matchesLost: 0,
        matchesDrawn: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      };
    }

    const localTeam = teams[localTeamId];
    const visitorTeam = teams[visitorTeamId];

    localTeam.matchesPlayed++;
    localTeam.goalsFor += match.goalsLocal ? match.goalsLocal.length : 0;
    localTeam.goalsAgainst += match.goalsVisitor ? match.goalsVisitor.length : 0;

    visitorTeam.matchesPlayed++;
    visitorTeam.goalsFor += match.goalsVisitor ? match.goalsVisitor.length : 0;
    visitorTeam.goalsAgainst += match.goalsLocal ? match.goalsLocal.length : 0;

    if (match.played) {
      if (match.goalsLocal && match.goalsVisitor) {
        if (match.goalsLocal.length > match.goalsVisitor.length) {
          localTeam.points += 3;
          localTeam.matchesWon++;
          visitorTeam.matchesLost++;
        } else if (match.goalsLocal.length < match.goalsVisitor.length) {
          visitorTeam.points += 3;
          visitorTeam.matchesWon++;
          localTeam.matchesLost++;
        } else {
          localTeam.points++;
          localTeam.matchesDrawn++;
          visitorTeam.points++;
          visitorTeam.matchesDrawn++;
        }
      } else {
        localTeam.points++;
        localTeam.matchesDrawn++;
        visitorTeam.points++;
        visitorTeam.matchesDrawn++;
      }
    }
  });

  const teamStatistics = Object.values(teams);

  return teamStatistics;
};
