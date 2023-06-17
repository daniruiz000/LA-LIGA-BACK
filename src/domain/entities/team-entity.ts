/**
 * @swagger
 * components:
 *  schemas:
 *    Team:
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

const Schema = mongoose.Schema;

export interface ITeamCreate {
  name: string;
  initials: string;
  image?: string;
}

export type ITeam = ITeamCreate & Document

const teamSchema = new Schema<ITeamCreate>(
  {
    name: {
      type: String,
      trim: true,
      minLength: [5, "Al menos cinco letras para el nombre"],
      maxLength: [30, "Nombre demasiado largo, máximo de 30 caracteres"],
      required: true
    },
    initials: {
      type: String,
      trim: true,
      minLength: [3, "Debe ser un Alias compuesto por 3 letras"],
      maxLength: [3, "Debe ser un Alias compuesto por 3 letras"],
      required: true
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un classroom valide contra el Schema que hemos creado para ver si es valido.
export const Team = mongoose.model<ITeamCreate>("Team", teamSchema);
