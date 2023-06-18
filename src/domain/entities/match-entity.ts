/**
 * @swagger
 * components:
 *  schemas:
 *    Match:
 *      type: object
 *      required:
 *        - email
 *        - password
 *        - firstName
 *        - lastName
 *        - players
 *        - rol
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *          description: Email del Match
 *        password:
 *          type: string
 *          minLength: 8
 *          description: Contraseña del Match
 *        firstName:
 *          type: string
 *          minLength: 3
 *          maxLength: 22
 *          description: Nombre del Match
 *        lastName:
 *          type: string
 *          minLength: 3
 *          maxLength: 22
 *          description: Nombre del Match
 *        team:
 *          type: [{type: Schema.Types.ObjectId, ref: "Match"}]
 *          description: Hijos del Match
 *        rol:
 *          type: String
 *          enum: ROL
 *          description: Rol del Match
 */

import mongoose, { Document } from "mongoose";

import { ITeam, Team } from "./team-entity";
import { IUser, User } from "./user-entity";

const Schema = mongoose.Schema;

export interface IMatchCreate {
  date: Date;
  localTeam: ITeam;
  visitorTeam: ITeam;
  goalsLocal?: IUser[];
  goalsVisitor?: IUser[];
  played: boolean;
  round: number;
}

const MatchSchema = new Schema<IMatchCreate>(
  {
    date: {
      type: Date,
      required: true
    },
    localTeam: {
      type: Schema.Types.ObjectId,
      ref: Team,
      required: true
    },
    visitorTeam: {
      type: Schema.Types.ObjectId,
      ref: Team,
      required: true
    },
    goalsLocal: [
      {
        type: Schema.Types.ObjectId,
        ref: User
      }
    ],
    goalsVisitor: [
      {
        type: Schema.Types.ObjectId,
        ref: User
      }
    ],
    played: {
      type: Boolean,
      default: false
    },
    round: {
      type: Number,
      min: [1, "Minimo primera jornada"],
    }
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos tipos para match
export type IMatch = IMatchCreate & Document
// Creamos un modelo para que siempre que creamos un Match valide contra el Schema que hemos creado para ver si es valido.
export const Match = mongoose.model<IMatchCreate>("Match", MatchSchema);
