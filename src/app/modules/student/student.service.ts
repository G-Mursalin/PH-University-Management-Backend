import { Student } from './student.model';

const getAllStudents = async () => {
  const result = await Student.find();

  return result;
};

const getStudentByID = async (id: string) => {
  const result = await Student.findOne({ _id: id });

  return result;
};

const deleteUserByID = async (id: string) => {
  const result = await Student.updateOne({ _id: id }, { isDeleted: true });

  return result;
};

export const studentServices = {
  getAllStudents,
  getStudentByID,
  deleteUserByID,
};
