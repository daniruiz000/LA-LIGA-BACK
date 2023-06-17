import { User } from "../entities/user-entity"
import { verifyToken } from "../utils/token";

import {
  Request,
  Response,
  NextFunction,
} from "express";

export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    const decodedInfo = verifyToken(token);
    const user = await User.findOne({ email: decodedInfo.email }).select("+password");
    if (!user) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    req.user = { id: user.id, rol: user.rol as unknown as CUSTOM_ROL };
    next();
  } catch (error) {
    res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
  }
};
