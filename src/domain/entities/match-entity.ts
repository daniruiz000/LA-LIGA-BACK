/**
 * @swagger
 * components:
 *   schemas:
 *     MatchCreate:
 *       type: object
 *       required:
 *         - date
 *         - localTeam
 *         - visitorTeam
 *         - played
 *         - round
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha del partido.
 *         localTeam:
 *           $ref: '#/components/schemas/Team'
 *           description: Equipo local.
 *         visitorTeam:
 *           $ref: '#/components/schemas/Team'
 *           description: Equipo visitante.
 *         goalsLocal:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: Goles del equipo local.
 *         goalsVisitor:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: Goles del equipo visitante.
 *         played:
 *           type: boolean
 *           description: Indica si el partido ha sido jugado.
 *         round:
 *           type: number
 *           description: Número de la ronda.
 *           minimum: 1
 *       example:
 *         date: "2023-06-18T18:00:00Z"
 *         localTeam:
 *           _id: 60c84e71ebeb8f001ff60999
 *           name: Equipo A
 *           initials: EQA
 *           image: https://example.com/teamA.png
 *         visitorTeam:
 *           _id: 60c84e71ebeb8f001ff60998
 *           name: Equipo B
 *           initials: EQB
 *           image: https://example.com/teamB.png
 *         goalsLocal: []
 *         goalsVisitor: []
 *         played: false
 *         round: 1
 *     Match:
 *       allOf:
 *         - $ref: '#/components/schemas/MatchCreate'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: ID del partido.
 *           example:
 *             _id: 60c84e71ebeb8f001ff60997
 *             date: "2023-06-18T18:00:00Z"
 *             localTeam:
 *               _id: 60c84e71ebeb8f001ff60999
 *               name: Equipo A
 *               initials: EQA
 *               image: https://example.com/teamA.png
 *             visitorTeam:
 *               _id: 60c84e71ebeb8f001ff60998
 *               name: Equipo B
 *               initials: EQB
 *               image: https://example.com/teamB.png
 *             goalsLocal: []
 *             goalsVisitor: []
 *             played: false
 *             round: 1
 */

import mongoose, { Schema, Document } from "mongoose";
import { ITeam, Team } from "./team-entity";
import { IUser, User } from "./user-entity";

export interface IMatchCreate {
  date: Date;
  localTeam: ITeam;
  visitorTeam: ITeam;
  goalsLocal?: IUser[];
  goalsVisitor?: IUser[];
  played: boolean;
  round: number;
}

export interface IMatch extends IMatchCreate, Document {}

const matchSchema = new Schema<IMatchCreate>(
  {
    date: {
      type: Date,
      required: true,
    },
    localTeam: {
      type: Schema.Types.ObjectId,
      ref: Team,
      required: true,
    },
    visitorTeam: {
      type: Schema.Types.ObjectId,
      ref: Team,
      required: true,
    },
    goalsLocal: [
      {
        type: Schema.Types.ObjectId,
        ref: User,
      },
    ],
    goalsVisitor: [
      {
        type: Schema.Types.ObjectId,
        ref: User,
      },
    ],
    played: {
      type: Boolean,
      default: false,
    },
    round: {
      type: Number,
      min: [1, "Minimo primera jornada"],
    },
  },
  { timestamps: true }
);

export const Match = mongoose.model<IMatch>("Match", matchSchema);
