import { Match, IMatch, IMatchCreate } from "../entities/match-entity";
import { Document } from "mongoose";

const getAllMatchs = async (page: number, limit: number): Promise<IMatch[]> => {
  return await Match.find()
    .limit(limit)
    .skip((page - 1) * limit).populate(["localTeam", "visitorTeam"]);
};

const getMatchCount = async (): Promise<number> => {
  return await Match.countDocuments();
};

const getMatchById = async (id: string): Promise<Document<IMatch> | null> => {
  return await Match.findById(id).populate(["localTeam", "visitorTeam"]);
};

const getMatchsByTeamId = async (teamId: string): Promise<IMatch[]> => {
  return await Match.find({
    $or: [{ localTeam: teamId }, { visitorTeam: teamId }]
  }).populate(["localTeam", "visitorTeam"]);
};

const createMatch = async (matchData: IMatchCreate): Promise<Document<IMatch>> => {
  const match = new Match(matchData);
  const document: Document<IMatch> = await match.save() as any;

  return document;
};

const createMatchsFromArray = async (matchList: IMatchCreate[]): Promise<void> => {
  for (let i = 0; i < matchList.length; i++) {
    const match = matchList[i];
    await matchOdm.createMatch(match);
  }
};

const deleteMatch = async (id: string): Promise<Document<IMatch> | null> => {
  return await Match.findByIdAndDelete(id);
};

const deleteAllMatch = async (): Promise<boolean> => {
  return await Match.collection.drop()
};

const updateMatch = async (id: string, matchData: IMatchCreate): Promise<Document<IMatch> | null> => {
  return await Match.findByIdAndUpdate(id, matchData, { new: true, runValidators: true });
};

export const matchOdm = {
  getAllMatchs,
  getMatchCount,
  getMatchById,
  getMatchsByTeamId,
  createMatch,
  createMatchsFromArray,
  deleteMatch,
  deleteAllMatch,
  updateMatch,

};
