import { Request, Response, NextFunction } from "express";

import { classroomOdm } from "../odm/classroom.odm";
import { userOdm } from "../odm/user.odm";
import { subjectOdm } from "../odm/subject.odm";

export const getClassrooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    // ADMIN Y TEACHER
    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const classrooms = await classroomOdm.getAllClassrooms(page, limit);
    const totalElements = await classroomOdm.getClassroomCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: classrooms,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getClassroomById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    //  ADMIN, TEACHER Y EL PROPIO USUARIO A SÍ MISMO
    const id = req.params.id;
    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const classroom = await classroomOdm.getClassroomById(id);
    if (!classroom) {
      res.status(404).json({ error: "No existe la classroom" });
      return;
    }

    const temporalClassroom = classroom.toObject()
    const students = await userOdm.getStudentsByClassroomId(classroom.id)
    const subjects = await subjectOdm.getSubjectsByClassroomId(classroom.id)

    temporalClassroom.students = students
    temporalClassroom.subjects = subjects

    res.json(temporalClassroom);
  } catch (error) {
    next(error);
  }
};

export const getClassroomByName = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  const name = req.params.name;

  try {
    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }
    const classroom = await classroomOdm.getClassroomByName(name);
    if (!classroom) {
      res.status(404).json({ error: "No existe la classroom" });
      return;
    }
    // TO DO RELLENAR DATOS DE ASIGNATURAS
    res.json(classroom);
  } catch (error) {
    next(error);
  }
};

export const createClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Sólo ADMIN
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const createdClassroom = await classroomOdm.createClassroom(req.body);
    res.status(201).json(createdClassroom);
  } catch (error) {
    next(error);
  }
};

export const deleteClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Sólo ADMIN
    const id = req.params.id;
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const classroomDeleted = await classroomOdm.deleteClassroom(id);
    if (!classroomDeleted) {
      res.status(404).json({ error: "No existe la classroom" });
      return;
    }
    res.json(classroomDeleted);
  } catch (error) {
    next(error);
  }
};

export const updateClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    // Sólo ADMIN
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const classroomToUpdate = await classroomOdm.getClassroomById(id);
    if (!classroomToUpdate) {
      res.status(404).json({ error: "No existe la classroom" });
      return;
    }

    // Guardamos la classroom actualizandolo con los parametros que nos manden
    Object.assign(classroomToUpdate, req.body);
    const classroomToSend = await classroomToUpdate.save()
    res.json(classroomToSend);
  } catch (error) {
    next(error);
  }
};

export const classroomService = {
  getClassrooms,
  getClassroomById,
  getClassroomByName,
  createClassroom,
  deleteClassroom,
  updateClassroom,
};
