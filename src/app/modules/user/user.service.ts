import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';

import { User } from './user.model';

const createStudent = async (password: string, student: TStudent) => {
  // Make user data
  const user: Partial<TUser> = {
    role: 'student',
    password: password || (config.default_password as string),
    id: crypto.randomUUID(),
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
