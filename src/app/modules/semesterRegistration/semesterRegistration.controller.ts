import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { semesterRegistrationServices } from './semesterRegistration.service';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

const createSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await semesterRegistrationServices.createSemesterRegistration(
                req.body,
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Semester Registration completed successfully',
            data: result,
        });
    },
);

const getAllSemesterRegistrations = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await semesterRegistrationServices.getAllSemesterRegistrations(
                req.query,
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Semester Registrations retrieved successfully!',
            data: result,
        });
    },
);

const getSemesterRegistrationByID = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result =
            await semesterRegistrationServices.getSemesterRegistrationByID(id);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Semester Registration retrieved successfully!',
            data: result,
        });
    },
);

const updateSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result =
            await semesterRegistrationServices.updateSemesterRegistration(
                id,
                req.body,
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Semester Registration updated successfully!',
            data: result,
        });
    },
);

const deleteSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result =
            await semesterRegistrationServices.deleteSemesterRegistration(id);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Semester Registration deleted successfully!',
            data: result,
        });
    },
);

export const semesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSemesterRegistrationByID,
    updateSemesterRegistration,
    deleteSemesterRegistration,
};
