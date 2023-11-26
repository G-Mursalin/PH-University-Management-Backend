import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { userServices } from './user.service';
import sendResponse from '../../utils/sendResponse';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student } = req.body;

    const result = await userServices.createStudent(password, student);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Student is created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const userControllers = {
  createStudent,
};
