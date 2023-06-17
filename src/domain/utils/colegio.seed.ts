import { colegioRelations } from "./colegioRelations";
import { mongoConnect, mongoDisconnect } from "../repositories/mongo-repository"; // Importamos el archivo de conexión a la BBDD
import { resetClassrooms } from "./resetClassrooms";
import { resetUsers } from "./resetUsers";

const seedFunction = async (): Promise<void> => {
  try {
    console.log("                                              ")
    console.log("----------------------------------------------")
    console.log("---------------- SEED COLEGIO ----------------")
    console.log("----------------------------------------------")
    console.log("                                              ")
    await mongoConnect()
    await resetUsers();
    await resetClassrooms();
    await colegioRelations()
  } catch (error) {
    console.error(error);
  } finally {
    await mongoDisconnect();
    console.log("                                              ")
    console.log("----------------------------------------------")
    console.log("---------------- PROCESO TERMINADO ----------------")
    console.log("----------------------------------------------")
    console.log("                                              ")
  }
};

void seedFunction();
