// En un fichero de definición no se exporta ni importa nada
// Este fichero dice a TS que las Request de Express van a contener una propiedad usuario.
enum CUSTOM_ROL {
  PLAYER = "PLAYER",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN"
}

declare namespace Express {
  export interface Request {
    user: {
      rol: CUSTOM_ROL;
      id: string;
      team?: string;
    };
  }
}
