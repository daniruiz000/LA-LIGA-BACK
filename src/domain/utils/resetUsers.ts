import { userList } from "../../data";
import { Team } from "../entities/team-entity";
import { ROL, IUserCreate } from "../entities/user-entity";
import { userOdm } from "../odm/user.odm";

export const resetUsers = async (): Promise<void> => {
  try {
    await userOdm.deleteAllUsers();
    console.log("Usuarios borrados");

    const admins = userList.filter(user => user.rol === ROL.ADMIN);
    const managers = userList.filter(user => user.rol === ROL.MANAGER);
    const players = userList.filter(user => user.rol === ROL.PLAYER);
    const teams = await Team.find();

    for (let i = 0; i < admins.length; i++) {
      const admin: IUserCreate = admins[i];
      admin.team = teams[i % teams.length].id;
      await userOdm.createUser(admin);
    }

    for (let i = 0; i < players.length; i++) {
      const player: IUserCreate = players[i];
      player.team = teams[i % teams.length].id;
      await userOdm.createUser(player);
    }

    for (let i = 0; i < managers.length; i++) {
      const manager: IUserCreate = managers[i];
      manager.team = teams[i % teams.length].id;
      await userOdm.createUser(manager);
    }

    console.log("Relaciones entre colecciones creadas correctamente");

    console.log("Usuarios creados correctamente");
  } catch (error) {
    console.error(error);
  }
};
