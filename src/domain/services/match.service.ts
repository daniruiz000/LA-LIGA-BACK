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

export const getTeamById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    //  ADMIN
    const teamId = req.params.id;
    if (req.user.rol !== "ADMIN" || req.user.team !== teamId) {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const team = await matchOdm.getTeamById(teamId);
    if (!team) {
      res.status(404).json({ error: "No existe el equipo" });
      return;
    }
    res.json(team)
  } catch (error) {
    next(error);
  }
};

export const getTeamByName = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  const name = req.params.name;

  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }
    const team = await matchOdm.getTeamByName(name);
    if (!team) {
      res.status(404).json({ error: "No existe el equipo" });
    }
    res.json(team)
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Sólo ADMIN
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const createdTeam = await matchOdm.createTeam(req.body);
    res.status(201).json(createdTeam);
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Sólo ADMIN
    const id = req.params.id;
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const teamDeleted = await matchOdm.deleteTeam(id);
    if (!teamDeleted) {
      res.status(404).json({ error: "No existe el equipo" });
      return;
    }
    res.json(teamDeleted);
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    // Sólo ADMIN y MANAGER
    if (req.user.rol !== "ADMIN" && (req.user.rol !== "MANAGER" && req.user.team !== id)) {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const teamToUpdate = await matchOdm.getTeamById(id);
    if (!teamToUpdate) {
      res.status(404).json({ error: "No existe el equipo" });
      return;
    }

    // Guardamos el equipo actualizandolo con los parametros que nos manden
    Object.assign(teamToUpdate, req.body);
    const teamToSend = await teamToUpdate.save()
    res.json(teamToSend);
  } catch (error) {
    next(error);
  }
};

export const teamService = {
  getAllMatchs,
  getTeamById,
  getTeamByName,
  createTeam,
  deleteTeam,
  updateTeam,
};
