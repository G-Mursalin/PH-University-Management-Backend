import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { offeredCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
    const result = await offeredCourseServices.createOfferedCourse(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Course is created successfully !',
        data: result,
    });
});

const getAllOfferedCourses = catchAsync(async (req: Request, res: Response) => {
    const { result, meta } = await offeredCourseServices.getAllOfferedCourses(
        req.query,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OfferedCourses retrieved successfully !',
        meta,
        data: result,
    });
});

const getMyOfferedCourses = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;

    const { result, meta } = await offeredCourseServices.getMyOfferedCourses(
        userId,
        req.query,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My offeredCourses retrieved successfully !',
        meta,
        data: result,
    });
});

const getOfferedCourseById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await offeredCourseServices.getOfferedCourseById(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OfferedCourse fetched successfully',
        data: result,
    });
});

const updateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await offeredCourseServices.updateOfferedCourse(
        id,
        req.body,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OfferedCourse updated successfully',
        data: result,
    });
});

const deleteOfferedCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await offeredCourseServices.deleteOfferedCourse(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OfferedCourse deleted successfully',
        data: result,
    });
});

export const offeredCourseControllers = {
    createOfferedCourse,
    getAllOfferedCourses,
    getMyOfferedCourses,
    getOfferedCourseById,
    updateOfferedCourse,
    deleteOfferedCourse,
};
