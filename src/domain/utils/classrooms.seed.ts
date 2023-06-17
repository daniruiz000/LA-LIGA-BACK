import { mongoConnect, mongoDisconnect } from "../repositories/mongo-repository"; // Importamos el archivo de conexión a la BBDD
import { resetClassrooms } from "./resetClassrooms";

const seedFunction = async (): Promise<void> => {
  try {
    await mongoConnect();
    await resetClassrooms();
  } catch (error) {
    console.error(error);
  } finally {
    await mongoDisconnect();
  }
};

void seedFunction();
