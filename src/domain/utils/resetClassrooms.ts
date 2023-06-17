import { classroomList } from "../../data";
import { classroomOdm } from "../odm/team.odm";

/* Borramos datos de la colección classrooms y creamos classrooms
 con los datos que suministramos en data.ts */

export const resetClassrooms = async (): Promise<void> => {
  try {
    await classroomOdm.deleteAllClassroom();
    console.log("Borrados classrooms");
    await classroomOdm.createClassroomsFromArray(classroomList)
    console.log("Creados classrooms correctamente");
  } catch (error) {
    console.error(error);
  }
};
