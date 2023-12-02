import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicFacultyServices } from './academicFaculty.service';

const createAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const result = await academicFacultyServices.createAcademicFaculty(
      req.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Faculty created successfully',
      data: result,
    });
  },
);

const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await academicFacultyServices.getAllAcademicFaculties();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculties are retrieved successfully',
    data: result,
  });
});

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await academicFacultyServices.getSingleAcademicFaculty(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculty is retrieved successfully',
    data: result,
  });
});

const updateAcademicFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await academicFacultyServices.updateAcademicFaculty(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculty is updated successfully',
    data: result,
  });
});

export const academicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
