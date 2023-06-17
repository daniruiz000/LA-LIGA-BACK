import { mongoConnect, mongoDisconnect } from "../repositories/mongo-repository"; // Importamos el archivo de conexión a la BBDD
import { resetUsers } from "./resetUsers";

const seedFunction = async (): Promise<void> => {
  try {
    await mongoConnect();
    await resetUsers();
  } catch (error) {
    console.error(error);
  } finally {
    await mongoDisconnect();
  }
};

void seedFunction();
