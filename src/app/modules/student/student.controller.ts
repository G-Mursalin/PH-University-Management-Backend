import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { studentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await studentServices.getAllStudentsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Students are retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentByID = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await studentServices.getStudentByIDFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Student retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserByID = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await studentServices.deleteStudentFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Students deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const studentControllers = {
  getAllStudents,
  getStudentByID,
  deleteUserByID,
};
