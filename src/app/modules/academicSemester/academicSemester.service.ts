import AppError from '../../errors/AppError';
import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemester = async (payLoad: TAcademicSemester) => {
  // Check semester code is valid
  if (academicSemesterNameCodeMapper[payLoad.name] != payLoad.code) {
    throw new AppError(400, 'Invalid Semester Code');
  }

  const result = await AcademicSemester.create(payLoad);

  return result;
};

const getAllAcademicSemesters = async () => {
  const result = await AcademicSemester.find();

  return result;
};
const getAcademicSemesterById = async (id: string) => {
  const result = await AcademicSemester.findById(id);

  return result;
};
const updateAcademicSemester = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

export const academicSemesterServices = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getAcademicSemesterById,
  updateAcademicSemester,
};
