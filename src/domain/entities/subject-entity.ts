/**
 * @swagger
 * components:
 *  schemas:
 *    Subject:
 *      type: object
 *      required:
 *        - email
 *        - password
 *        - firstName
 *        - lastName
 *        - children
 *        - rol
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *          description: Email del subject
 *        password:
 *          type: string
 *          minLength: 8
 *          description: Contraseña del subject
 *        firstName:
 *          type: string
 *          minLength: 3
 *          maxLength: 22
 *          description: Nombre del subject
 *        lastName:
 *          type: string
 *          minLength: 3
 *          maxLength: 22
 *          description: Nombre del subject
 *        children:
 *          type: [{type: Schema.Types.ObjectId, ref: "Subject"}]
 *          description: Hijos del subject
 *        rol:
 *          type: String
 *          enum: ROL
 *          description: Rol del subject
 */

import mongoose, { Document } from "mongoose";

import { Classroom, IClassroom } from "./classroom-entity";
import { IUser, User } from "./user-entity";

const Schema = mongoose.Schema;

export interface ISubjectCreate {
  name: string;
  classroom: IClassroom;
  teacher: IUser;
}

const subjectSchema = new Schema<ISubjectCreate>(
  {
    name: {
      type: String,
      trim: true,
      minLength: [5, "Al menos cinco letras para el nombre"],
      maxLength: [40, "Nombre demasiado largo, máximo de 40 caracteres"],
      required: true
    },
    classroom: {
      type: Schema.Types.ObjectId,
      ref: Classroom,
      required: true
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true
    },

  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos tipos para SUBJECTS
export type ISubject = ISubjectCreate & Document
// Creamos un modelo para que siempre que creamos un subject valide contra el Schema que hemos creado para ver si es valido.
export const Subject = mongoose.model<ISubjectCreate>("Subject", subjectSchema);
