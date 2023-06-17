/**
 * @swagger
 * components:
 *  schemas:
 *    Classroom:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          minLength: 5
 *          maxLength: 30
 *          description: Nombre del autor
 */

import mongoose, { Document } from "mongoose";
import { IUser } from "./user-entity";
import { ISubject } from "./subject-entity";

const Schema = mongoose.Schema;

export interface IClassroomCreate {
  name: string;
  students?: IUser[];
  subjects?: ISubject[];
}

export type IClassroom = IClassroomCreate & Document

const classroomSchema = new Schema<IClassroomCreate>(
  {
    name: {
      type: String,
      trim: true,
      minLength: [5, "Al menos cinco letras para el nombre"],
      maxLength: [30, "Nombre demasiado largo, máximo de 30 caracteres"],
      required: true
    },
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un classroom valide contra el Schema que hemos creado para ver si es valido.
export const Classroom = mongoose.model<IClassroomCreate>("Classroom", classroomSchema);
