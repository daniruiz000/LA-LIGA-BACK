import { subjectList } from "../../data";
import { Classroom } from "../entities/classroom-entity";
import { Subject } from "../entities/subject-entity";
import { User } from "../entities/user-entity";

export const colegioRelations = async (): Promise<void> => {
  try {
    const teachers = await User.find({ rol: "TEACHER" });
    if (teachers.length === 0) {
      console.error("No hay teachers en la BBDD.");
      return;
    }

    const classrooms = await Classroom.find();
    if (classrooms.length === 0) {
      console.error("No hay classrooms en la BBDD.");
      return;
    }

    for (let i = 0; i < 2; i++) {
      const subjectData = subjectList[i];
      const subject = new Subject(subjectData);
      subject.teacher = teachers[i].id;
      subject.classroom = classrooms[i].id;
      await subject.save();
    }
    console.log("Creadas subjects correctamente");
    console.log("Relaciones de Colegio realizadas correctamente");
  } catch (error) {
    console.error(error);
  }
};
