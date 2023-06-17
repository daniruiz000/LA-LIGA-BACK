import { Classroom, IClassroom, IClassroomCreate } from "../entities/classroom-entity";
import { Document } from "mongoose";

const getAllClassrooms = async (page: number, limit: number): Promise<IClassroom[]> => {
  return await Classroom.find()
    .limit(limit)
    .skip((page - 1) * limit);
};

const getClassroomCount = async (): Promise<number> => {
  return await Classroom.countDocuments();
};

const getClassroomById = async (id: string): Promise<Document<IClassroom> | null> => {
  return await Classroom.findById(id);
};

const getClassroomByName = async (name: string): Promise<Document<IClassroom>[]> => {
  return await Classroom.find({ name: new RegExp("^" + name.toLowerCase(), "i") })
};

const createClassroom = async (classroomData: IClassroomCreate): Promise<Document<IClassroom>> => {
  const classroom = new Classroom(classroomData);
  const document: Document<IClassroom> = await classroom.save() as any;

  return document;
};

const createClassroomsFromArray = async (classroomList: IClassroomCreate[]): Promise<void> => {
  for (let i = 0; i < classroomList.length; i++) {
    const classroom = classroomList[i];
    await classroomOdm.createClassroom(classroom);
  }
};

const deleteClassroom = async (id: string): Promise<Document<IClassroom> | null> => {
  return await Classroom.findByIdAndDelete(id);
};

const deleteAllClassroom = async (): Promise<boolean> => {
  return await Classroom.collection.drop()
};

const updateClassroom = async (id: string, classroomData: IClassroomCreate): Promise<Document<IClassroom> | null> => {
  return await Classroom.findByIdAndUpdate(id, classroomData, { new: true, runValidators: true });
};

export const classroomOdm = {
  getAllClassrooms,
  getClassroomCount,
  getClassroomById,
  getClassroomByName,
  createClassroom,
  createClassroomsFromArray,
  deleteClassroom,
  deleteAllClassroom,
  updateClassroom,
};
