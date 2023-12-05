import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { facultyServices } from './faculty.service';

const getAllFaculties = catchAsync(async (req, res) => {
  const result = await facultyServices.getAllFaculties(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculties are retrieved successfully',
    data: result,
  });
});

const getFacultiesByID = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await facultyServices.getFacultyByID(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty retrieved successfully',
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculty } = req.body;

  const result = await facultyServices.updateFaculty(id, faculty);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is updated successfully',
    data: result,
  });
});

const deleteFacultyByID = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await facultyServices.deleteFacultyByID(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty deleted successfully',
    data: result,
  });
});

export const facultyControllers = {
  getAllFaculties,
  getFacultiesByID,
  updateFaculty,
  deleteFacultyByID,
};
