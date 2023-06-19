import { Request, Response, NextFunction } from "express";
import { matchOdm } from "../odm/match.odm";

export const getMatchs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const match = await matchOdm.getAllMatchs(page, limit);
    const totalElements = await matchOdm.getMatchCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: match,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getMatchByTeamId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    //   is auth
    const matchId = req.params.id;
    if (!req.user) {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const match = await matchOdm.getMatchById(matchId);
    if (!match) {
      res.status(404).json({ error: "No existe el equipo" });
      return;
    }
    res.json(match)
  } catch (error) {
    next(error);
  }
};

export const getMatchById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    //   is auth
    const matchId = req.params.id;
    if (!req.user) {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const match = await matchOdm.getMatchById(matchId);
    if (!match) {
      res.status(404).json({ error: "No existe el equipo" });
      return;
    }
    res.json(match)
  } catch (error) {
    next(error);
  }
};

export const createMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Sólo ADMIN
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const createdMatch = await matchOdm.createMatch(req.body);
    res.status(201).json(createdMatch);
  } catch (error) {
    next(error);
  }
};

export const deleteMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Sólo ADMIN
    const id = req.params.id;
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const matchDeleted = await matchOdm.deleteMatch(id);
    if (!matchDeleted) {
      res.status(404).json({ error: "No existe el equipo" });
      return;
    }
    res.json(matchDeleted);
  } catch (error) {
    next(error);
  }
};

export const updateMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    // Sólo ADMIN
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const matchToUpdate = await matchOdm.getMatchById(id);
    if (!matchToUpdate) {
      res.status(404).json({ error: "No existe el equipo" });
      return;
    }

    // Guardamos el equipo actualizandolo con los parametros que nos manden
    Object.assign(matchToUpdate, req.body);
    const matchToSend = await matchToUpdate.save()
    res.json(matchToSend);
  } catch (error) {
    next(error);
  }
};

export const matchService = {
  getMatchs,
  getMatchById,
  getMatchByTeamId,
  createMatch,
  deleteMatch,
  updateMatch,
};
