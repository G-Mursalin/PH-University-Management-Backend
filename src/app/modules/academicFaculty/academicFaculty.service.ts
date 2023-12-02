import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';

const createAcademicFaculty = async (payLoad: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payLoad);

  return result;
};

const getAllAcademicFaculties = async () => {
  const result = await AcademicFaculty.find();
  return result;
};

const getSingleAcademicFaculty = async (id: string) => {
  const result = await AcademicFaculty.findById(id);
  return result;
};

const updateAcademicFaculty = async (
  id: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    validator: true,
  });
  return result;
};

export const academicFacultyServices = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
