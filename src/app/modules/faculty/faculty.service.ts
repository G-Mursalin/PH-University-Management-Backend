import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { Faculty } from './faculty.model';
import { facultySearchableFields } from './faculty.constant';
import { TFaculty } from './faculty.interface';

const getAllFaculties = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate('academicFaculty').populate('academicDepartment'),
    query,
  )
    .search(facultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  return result;
};

const getFacultyByID = async (id: string) => {
  const result = await Faculty.findOne({ id })
    .populate('academicFaculty')
    .populate('academicDepartment');

  return result;
};

const updateFaculty = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteFacultyByID = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedStudent = await Faculty.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(400, 'Fail to delete faculty');
    }
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(400, 'Fail to delete user');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const facultyServices = {
  getAllFaculties,
  getFacultyByID,
  updateFaculty,
  deleteFacultyByID,
};
