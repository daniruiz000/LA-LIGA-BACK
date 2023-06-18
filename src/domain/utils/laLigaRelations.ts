import { userList } from "../../data";
import { Team } from "../entities/team-entity";
import { User } from "../entities/user-entity";

export const laLigaRelations = async (): Promise<void> => {
  try {
    const teams = await Team.find();
    if (teams.length === 0) {
      console.error("No hay teams en la BBDD.");
      return;
    }
    
// Asignar manager y jugadores a cada equipo
for (let i = 0; i < teams.length; i++) {
  const team = teams[i];

  // Asignar manager
  const managerIndex = i % userList.length; // Obtener el índice del manager en userList
  const manager = userList[managerIndex];
  team.manager = manager;

  // Asignar jugadores
  const startIndex = (i + 1) % userList.length; // Obtener el índice de inicio de los jugadores en userList
  for (let j = startIndex; j < startIndex + 5; j++) {
    const playerIndex = j % userList.length;
    const player = userList[playerIndex];
    team.players.push(player);
  }
    console.log("Creadas subjects correctamente");
    console.log("Relaciones de Colegio realizadas correctamente");
  } catch (error) {
    console.error(error);
  }
};
