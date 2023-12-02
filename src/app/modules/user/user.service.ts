import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentID } from './user.utils';

const createStudent = async (password: string, student: TStudent) => {
  // Find Academic Semester Information
  const admissionSemester = await AcademicSemester.findById(
    student.admissionSemester,
  );

  // Make user data
  const user: Partial<TUser> = {
    role: 'student',
    password: password || (config.default_password as string),
    id: await generateStudentID(admissionSemester),
  };

  // Crate a user
  const newUser = await User.create(user);

  // Make student data
  if (Object.keys(newUser).length) {
    student.id = newUser.id;
    student.user = newUser._id;
  }
  // Create a student
  const newStudent = await Student.create(student);

  return newStudent;
};

export const userServices = {
  createStudent,
};
