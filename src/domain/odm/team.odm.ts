import { Team, ITeam, ITeamCreate } from "../entities/team-entity";
import { Document } from "mongoose";

const getAllTeam = async (page: number, limit: number): Promise<ITeam[]> => {
  return await Team.find()
    .limit(limit)
    .skip((page - 1) * limit);
};

const getTeamCount = async (): Promise<number> => {
  return await Team.countDocuments();
};

const getTeamById = async (id: string): Promise<Document<ITeam> | null> => {
  return await Team.findById(id);
};

const getTeamByName = async (name: string): Promise<Document<ITeam>[]> => {
  return await Team.find({ name: new RegExp("^" + name.toLowerCase(), "i") })
};

const createTeam = async (teamData: ITeamCreate): Promise<Document<ITeam>> => {
  const team = new Team(teamData);
  const document: Document<ITeam> = await team.save() as any;

  return document;
};

const createTeamFromArray = async (teamList: ITeamCreate[]): Promise<void> => {
  for (let i = 0; i < teamList.length; i++) {
    const team = teamList[i];
    await teamOdm.createTeam(team);
  }
};

const deleteTeam = async (id: string): Promise<Document<ITeam> | null> => {
  return await Team.findByIdAndDelete(id);
};

const deleteAllTeam = async (): Promise<boolean> => {
  return await Team.collection.drop()
};

const updateTeam = async (id: string, teamData: ITeamCreate): Promise<Document<ITeam> | null> => {
  return await Team.findByIdAndUpdate(id, teamData, { new: true, runValidators: true });
};

export const teamOdm = {
  getAllTeam,
  getTeamCount,
  getTeamById,
  getTeamByName,
  createTeam,
  createTeamFromArray,
  deleteTeam,
  deleteAllTeam,
  updateTeam,
};