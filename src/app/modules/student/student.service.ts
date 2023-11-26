import { Student } from './student.model';

const getAllStudentsFromDB = async () => {
  const result = await Student.find();

  return result;
};

const getStudentByIDFromDB = async (id: string) => {
  const result = await Student.findOne({ _id: id });

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ _id: id }, { isDeleted: true });

  return result;
};

export const studentServices = {
  getAllStudentsFromDB,
  getStudentByIDFromDB,
  deleteStudentFromDB,
};
