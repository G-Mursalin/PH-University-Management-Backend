import { TStudent } from './student.interface';
import { Student } from './student.model';

const createStudentToDB = async (student: TStudent) => {
  // Static method
  if (await Student.isUserExists(student.id)) {
    throw new Error('User Already Exists');
  }
  // Build in Static Method
  const result = await Student.create(student);

  //Build in Instance Method
  //   const data = new Student(student);

  //   if (await data.isUserExists(student.id)) {
  //     throw new Error('User Already Exists');
  //   }

  //   const result = await data.save();

  return result;
};

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
  createStudentToDB,
  getAllStudentsFromDB,
  getStudentByIDFromDB,
  deleteStudentFromDB,
};
