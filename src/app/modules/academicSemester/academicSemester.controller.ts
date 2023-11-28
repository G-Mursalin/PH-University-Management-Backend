import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { academicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.createAcademicSemester(
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic semester is created successfully',
    data: result,
  });
});

const getAllAcademicSemesters = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getAllAcademicSemesters();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic semesters fetched successfully',
    data: result,
  });
});

const getAcademicSemesterById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await academicSemesterServices.getAcademicSemesterById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic semester fetched successfully',
    data: result,
  });
});
const updateAcademicSemester = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await academicSemesterServices.updateAcademicSemester(
    id,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic semester fetched successfully',
    data: result,
  });
});

export const academicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getAcademicSemesterById,
  updateAcademicSemester,
};
