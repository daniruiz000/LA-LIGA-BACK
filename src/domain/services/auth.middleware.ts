import { User } from "../entities/user-entity"
import { verifyToken } from "../utils/token";

import {
  Request,
  Response,
  NextFunction,
} from "express";

export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<null> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    const decodedInfo = verifyToken(token);
    const user = await User.findOne({ email: decodedInfo.email }).select("+password").populate("team");
    if (!user) {
      throw new Error("No tienes autorización para realizar esta operación");
    }
    req.user = user;
    next();

    return null;
  } catch (error) {
    res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    return null;
  }
};

module.exports = { isAuth };
