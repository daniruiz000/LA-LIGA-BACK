import { IMatchCreate } from "../entities/match-entity";
import { Team } from "../entities/team-entity";
import { matchOdm } from "../odm/match.odm";

export const generateLeague = async (): Promise<void> => {
  try {
    const teams = await Team.find();
    if (teams.length === 0) {
      console.error("No hay equipos en la BBDD.");
      return;
    }
    await matchOdm.deleteAllMatch();
    console.log("Partidos borrados");

    const matches: IMatchCreate[] = [];
    const numTeams = teams.length;
    const numRoundsPerFase = numTeams - 1;
    const startDate = new Date();

    // Generar los enfrentamientos de la primera vuelta
    for (let round = 0; round < numRoundsPerFase; round++) {
      const roundMatches: IMatchCreate[] = [];

      // Generar los partidos de la ronda actual
      for (let i = 0; i < numTeams / 2; i++) {
        const home = (round + i) % numTeams;
        const away = (numTeams - 1 - i + round) % numTeams;

        if (home === away) {
          // Evitar el enfrentamiento contra sí mismo
          continue;
        }

        const localTeam = teams[home];
        const visitorTeam = teams[away];

        const matchDate: Date = new Date(startDate.getTime() + round * 7 * 24 * 60 * 60 * 1000);

        const match: IMatchCreate = {
          date: matchDate,
          localTeam,
          visitorTeam,
          played: false,
          round: round + 1, // Se incrementa en 1 para indicar la ronda actual
        };

        roundMatches.push(match);
      }

      matches.push(...roundMatches);
    }

    // Generar los enfrentamientos de la segunda vuelta
    for (let round = numRoundsPerFase - 1; round >= 0; round--) {
      const roundMatches: IMatchCreate[] = [];

      // Generar los partidos de la ronda actual
      for (let i = 0; i < numTeams / 2; i++) {
        const home = (numTeams - 1 - i + round) % numTeams;
        const away = (round + i) % numTeams;

        if (home === away) {
          // Evitar el enfrentamiento contra sí mismo
          continue;
        }

        const localTeam = teams[home];
        const visitorTeam = teams[away];

        const matchDate: Date = new Date(startDate.getTime() + round * 7 * 24 * 60 * 60 * 1000);

        const match: IMatchCreate = {
          date: matchDate,
          localTeam,
          visitorTeam,
          played: false,
          round: round + numRoundsPerFase + 1, // Se incrementa en 1 para indicar la ronda actual
        };

        roundMatches.push(match);
      }

      matches.push(...roundMatches);
    }

    // Guardar los partidos en la base de datos
    await matchOdm.createMatchsFromArray(matches);
    const matchSort = matches.sort((a, b) => a.round - b.round)
    for (let i = 0; i < matchSort.length; i++) {
      const match = matches[i];
      console.log(`Jornada ${match.round} Partido: ${match.localTeam.name}/ ${match.visitorTeam.name}`)
    }
    console.log("Partidos generados correctamente");
    console.log({
      matchesNum: matches.length,
      numRounds: numRoundsPerFase * 2,
      matchesPerRound: numTeams / 2,
    });
    console.log("Liga generada correctamente");
  } catch (error) {
    console.error(error);
  }
};
