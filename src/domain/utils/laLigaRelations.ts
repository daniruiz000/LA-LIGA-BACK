import { Team } from "../entities/team-entity";
import { User } from "../entities/user-entity";

export const laLigaRelations = async (): Promise<void> => {
  try {
    const players = await User.find({ rol: "PLAYER" });
    if (players.length === 0) {
      console.error("No hay players en la BBDD.");
      return;
    }

    const managers = await User.find({ rol: "MANAGER" });
    if (managers.length === 0) {
      console.error("No hay managers en la BBDD.");
      return;
    }

    const teams = await Team.find();
    if (teams.length === 0) {
      console.error("No hay teams en la BBDD.");
      return;
    }

    for (let i = 0; i < players.length; i++) {
      const playerData = players[i];
      const player = new User(playerData);
      player.team = teams[i].id;
      await player.save();
    }
    console.log("Creadas subjects correctamente");
    console.log("Relaciones de Colegio realizadas correctamente");
  } catch (error) {
    console.error(error);
  }
};
