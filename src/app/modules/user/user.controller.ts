import httpStatus from 'http-status';
import { userServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;

  const result = await userServices.createStudent(password, student);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Student is created successfully',
    data: result,
  });
});

export const userControllers = {
  createStudent,
};
