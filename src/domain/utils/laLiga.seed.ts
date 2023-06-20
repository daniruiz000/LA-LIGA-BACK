import { mongoConnect, mongoDisconnect } from "../repositories/mongo-repository"; // Importamos el archivo de conexión a la BBDD
import { generateLeague } from "./generateLeague";
import { resetTeams } from "./resetTeams";
import { resetUsers } from "./resetUsers";

const seedLaLiga = async (): Promise<void> => {
  try {
    console.log("                                              ")
    console.log("----------------------------------------------")
    console.log("---------------- SEED LALIGA -----------------")
    console.log("----------------------------------------------")
    console.log("                                              ")
    await mongoConnect();
    await resetTeams()
    await resetUsers()
    await generateLeague();
  } catch (error) {
    console.error(error);
  } finally {
    await mongoDisconnect();
    console.log("                                              ")
    console.log("----------------------------------------------")
    console.log("-------------- PROCESO TERMINADO -------------")
    console.log("----------------------------------------------")
    console.log("                                              ")
  }
};

void seedLaLiga();
