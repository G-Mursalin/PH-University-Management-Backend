import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { enrolledCourseServices } from './enrolledCourse.service';

// Create Enrolled Course
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

// Update Enrolled Course Marks
const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
    const facultyId = req.user.userId;
    const result = await enrolledCourseServices.updateEnrolledCourseMarks(
        facultyId,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Marks is updated successfully',
        data: result,
    });
});

// Get All My Enrolled Course
const getMyEnrolledCourses = catchAsync(async (req, res) => {
    const studentId = req.user.userId;

    const result = await enrolledCourseServices.getMyEnrolledCourses(
        studentId,
        req.query,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Enrolled courses are fetched successfully',
        meta: result.meta,
        data: result.result,
    });
});

export const enrolledCourseControllers = {
    createEnrolledCourse,
    updateEnrolledCourseMarks,
    getMyEnrolledCourses,
};
