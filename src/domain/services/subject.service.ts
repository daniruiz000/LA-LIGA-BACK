import { Request, Response, NextFunction } from "express";
import { subjectOdm } from "../odm/subject.odm";

export const getSubjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    // ADMIN Y TEACHER
    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const subjects = await subjectOdm.getAllSubjects(page, limit);
    const totalElements = await subjectOdm.getSubjectCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: subjects,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getSubjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    //  ADMIN, TEACHER Y EL PROPIO USUARIO A SÍ MISMO
    const id = req.params.id;
    if (req.user.id !== id && req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const subject = await subjectOdm.getSubjectById(id);
    if (!subject) {
      res.status(404).json({ error: "No existe el usuario" });
      return;
    }
    res.json(subject);
  } catch (error) {
    next(error);
  }
};

// export const getSubjectByName = async (req: any, res: Response, next: NextFunction): Promise<void> => {
//   const name = req.params.name;

//   try {
//     if (req.subject.name !== name && req.subject.email !== "admin@gmail.com") {
//       res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
//       return;
//     }
//     const subject = await subjectOdm.getSubjectByName(name);
//     if (subject?.length) {
//       res.json(subject);
//     } else {
//       res.status(404).json([]);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const createSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Sólo ADMIN
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const createdSubject = await subjectOdm.createSubject(req.body);
    res.status(201).json(createdSubject);
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Sólo ADMIN
    const id = req.params.id;
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const subjectDeleted = await subjectOdm.deleteSubject(id);
    if (!subjectDeleted) {
      res.status(404).json({ error: "No existe el usuario" });
      return;
    }
    res.json(subjectDeleted);
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    // Sólo ADMIN
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const subjectToUpdate = await subjectOdm.getSubjectById(id);
    if (!subjectToUpdate) {
      res.status(404).json({ error: "No existe el usuario" });
      return;
    }

    // Guardamos el usuario actualizandolo con los parametros que nos manden
    Object.assign(subjectToUpdate, req.body);
    await subjectToUpdate.save();

    // Quitamos password del subject que enviamos en la respuesta
    const subjectToSend: any = subjectToUpdate.toObject();
    delete subjectToSend.password;
    res.json(subjectToSend);
  } catch (error) {
    next(error);
  }
};

export const subjectService = {
  getSubjects,
  getSubjectById,
  createSubject,
  deleteSubject,
  updateSubject,
};
