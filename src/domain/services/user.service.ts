import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

import { generateToken } from "../utils/token";
import { userOdm } from "../odm/user.odm";

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    // ADMIN Y TEACHER
    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const users = await userOdm.getAllUsers(page, limit);
    const totalElements = await userOdm.getUserCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: users,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    //  ADMIN, TEACHER Y EL PROPIO USUARIO A SÍ MISMO
    const id = req.params.id;
    if (req.user.id !== id && req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const user = await userOdm.getUserById(id);
    if (!user) {
      res.status(404).json({ error: "No existe el usuario" });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Sólo ADMIN
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const createdUser = await userOdm.createUser(req.body);
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Sólo ADMIN
    const id = req.params.id;
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const userDeleted = await userOdm.deleteUser(id);
    if (!userDeleted) {
      res.status(404).json({ error: "No existe el usuario" });
      return;
    }
    res.json(userDeleted);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    // Sólo ADMIN
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const userToUpdate = await userOdm.getUserById(id);
    if (!userToUpdate) {
      res.status(404).json({ error: "No existe el usuario" });
      return;
    }

    // Guardamos el usuario actualizandolo con los parametros que nos manden
    Object.assign(userToUpdate, req.body);
    await userToUpdate.save();

    // Quitamos password del user que enviamos en la respuesta
    const userToSend: any = userToUpdate.toObject();
    delete userToSend.password;
    res.json(userToSend);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    // Todos los usuarios creados se puede logar con su password y su email
    if (!email || !password) {
      res.status(400).json({ error: "Se deben especificar los campos email y password" });
      return;
    }

    const user: any = await userOdm.getUserByEmailWithPassword(email);
    if (!user) {
      res.status(401).json({ error: "Email y/o contraseña incorrectos" });
      return;
    }
    // Comprueba la password
    const userPassword: string = user.password;
    const match = await bcrypt.compare(password, userPassword);
    if (!match) {
      res.status(401).json({ error: "Email y/o contraseña incorrectos" });
      return;
    }
    // Generamos token JWT
    const jwtToken = generateToken(user._id.toString(), user.email);

    const userToSend = user.toObject(user)
    delete userToSend.password

    res.status(200).json({
      token: jwtToken,
      user: userToSend,
    });
  } catch (error) {
    next(error);
  }
};

export const userService = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  login,
};
