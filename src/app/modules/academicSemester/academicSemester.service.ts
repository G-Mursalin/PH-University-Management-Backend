import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemester = async (payLoad: TAcademicSemester) => {
  // Check semester code is valid
  if (academicSemesterNameCodeMapper[payLoad.name] != payLoad.code) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemester.create(payLoad);

  return result;
};

export const academicSemesterServices = { createAcademicSemester };
