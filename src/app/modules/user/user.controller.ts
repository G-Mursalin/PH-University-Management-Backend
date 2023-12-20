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

const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty } = req.body;

    const result = await userServices.createFaculty(password, faculty);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Faculty is created successfully',
        data: result,
    });
});

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin } = req.body;

    const result = await userServices.createAdmin(password, admin);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Admin is created successfully',
        data: result,
    });
});

const getMe = catchAsync(async (req, res) => {
    const { userId, role } = req.user;

    const result = await userServices.getMe(userId, role);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User is retrieved successfully',
        data: result,
    });
});

const changeStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await userServices.changeStatus(id, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Status is updated successfully',
        data: result,
    });
});

export const userControllers = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    changeStatus,
};
