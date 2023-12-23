import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { enrolledCourseServices } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const { offeredCourse } = req.body;
    const result = await enrolledCourseServices.createEnrolledCourse(
        userId,
        offeredCourse,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Student enrolled successfully',
        data: result,
    });
});

export const enrolledCourseControllers = { createEnrolledCourse };
