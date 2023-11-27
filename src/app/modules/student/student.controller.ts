import httpStatus from 'http-status';
import { studentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await studentServices.getAllStudents();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Students are retrieved successfully',
    data: result,
  });
});

const getStudentByID = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await studentServices.getStudentByID(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Student retrieved successfully',
    data: result,
  });
});

const deleteUserByID = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await studentServices.deleteUserByID(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Students deleted successfully',
    data: result,
  });
});

export const studentControllers = {
  getAllStudents,
  getStudentByID,
  deleteUserByID,
};
