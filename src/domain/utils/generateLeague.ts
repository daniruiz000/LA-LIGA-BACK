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

    // Generar los partidos de la primera vuelta
    for (let round = 0; round < numRoundsPerFase; round++) {
      const roundStartDate = new Date(startDate.getTime() + round * 7 * 24 * 60 * 60 * 1000);

      // Generar los partidos de la ronda actual
      for (let matchIndex = 0; matchIndex < numTeams / 2; matchIndex++) {
        const localIndex = matchIndex;
        const visitorIndex = numTeams - 1 - matchIndex;
        const localTeam = teams[localIndex];
        const visitorTeam = teams[visitorIndex];

        const matchDate: Date = new Date(roundStartDate.getTime());

        // Crear el objeto del partido
        const match: IMatchCreate = {
          date: matchDate,
          localTeam,
          visitorTeam,
          played: false,
          round: round + 1, // Se incrementa en 1 para indicar la ronda actual
        };

        matches.push(match);
      }
    }

    // Generar los partidos de la segunda vuelta
    for (let round = numRoundsPerFase; round < 2 * numRoundsPerFase; round++) {
      const roundStartDate = new Date(startDate.getTime() + round * 7 * 24 * 60 * 60 * 1000);

      // Generar los partidos de la ronda actual
      for (let matchIndex = 0; matchIndex < numTeams / 2; matchIndex++) {
        const localIndex = numTeams - 1 - matchIndex;
        const visitorIndex = matchIndex;
        const localTeam = teams[visitorIndex];
        const visitorTeam = teams[localIndex];

        const matchDate: Date = new Date(roundStartDate.getTime());

        // Crear el objeto del partido
        const match: IMatchCreate = {
          date: matchDate,
          localTeam,
          visitorTeam,
          played: false,
          round: round + 1, // Se incrementa en 1 para indicar la ronda actual
        };

        matches.push(match);
      }
    }

    // Guardar los partidos en la base de datos
    await matchOdm.createMatchsFromArray(matches);

    console.log("Partidos generados correctamente");
    console.log({
      matches: matches.length,
      numRounds: numRoundsPerFase * 2,
      matchesPerRound: matches.length / (numRoundsPerFase * 2)
    });
    console.log("Liga generada correctamente");
  } catch (error) {
    console.error(error);
  }
};
