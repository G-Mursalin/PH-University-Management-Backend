import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastUserId = async (role: string) => {
  const lastUser = await User.findOne(
    {
      role: role,
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastUser?.id ? lastUser.id : undefined;
};

// Generate Student ID
export const generateStudentID = async (payload: TAcademicSemester) => {
  let currentId = (0).toString();

  const lastStudentId = await findLastUserId('student');

  const lastStudentYear = lastStudentId?.substring(0, 4);

  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);

  const currentYear = payload.year;

  const currentSemesterCode = payload.code;

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};

// Generate Faculty ID
export const generateFacultyID = async () => {
  const lastFacultyId = (await findLastUserId('faculty'))?.split('-')[1] || 0;

  const incrementId =
    'F-' + (Number(lastFacultyId) + 1).toString().padStart(4, '0');

  return incrementId;
};
// Generate Faculty ID
export const generateAdminID = async () => {
  const lastAdminId = (await findLastUserId('admin'))?.split('-')[1] || 0;

  const incrementId =
    'A-' + (Number(lastAdminId) + 1).toString().padStart(4, '0');

  return incrementId;
};
