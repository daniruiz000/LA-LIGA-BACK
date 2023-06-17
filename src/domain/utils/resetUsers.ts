import { userList } from "../../data";
import { userOdm } from "../odm/user.odm";

/* Borramos datos de la colección users y creamos users
 con los datos que suministramos en data.ts */

export const resetUsers = async (): Promise<void> => {
  try {
    await userOdm.deleteAllUser();
    console.log("Borrados users");
    await userOdm.createUsersFromArray(userList)
    console.log("Creados users correctamente");
  } catch (error) {
    console.error(error);
  }
};
