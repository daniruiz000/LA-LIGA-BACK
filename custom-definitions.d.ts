// En un fichero de definición no se exporta ni importa nada
// Este fichero dice a TS que las Request de Express van a contener una propiedad usuario.

declare namespace Express {
  export interface Request {
    user: {
      firstName: string;
      lastName: string;
      rol: ROL;
      id?: string;
      team?: string;
      image?: string;
    };
  }
}
