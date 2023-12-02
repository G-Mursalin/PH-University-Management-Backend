/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentID } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createStudent = async (password: string, student: TStudent) => {
  // Find Academic Semester Information
  const admissionSemester = await AcademicSemester.findById(
    student.admissionSemester,
  );

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Make user data
    const user: Partial<TUser> = {
      role: 'student',
      password: password || (config.default_password as string),
      id: await generateStudentID(admissionSemester),
    };

    // Crate a user (Transaction 1)
    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to create user');
    }

    // Make student data
    student.id = newUser[0].id;
    student.user = newUser[0]._id;
    // console.log(student);
    // Create a student (Transaction 2)
    const newStudent = await Student.create([student], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent[0];
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || 'Fail to create student',
    );
  }
};

export const userServices = {
  createStudent,
};
