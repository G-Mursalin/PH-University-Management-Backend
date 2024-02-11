import express from 'express';
import { enrolledCourseControllers } from './enrolledCourse.controller';
import validateRequest from '../../middlewares/validateRequest';
import { enrolledCourseValidators } from './enrolledCourse.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router
    .post(
        '/create-enrolled-course',
        auth(USER_ROLE.student),
        validateRequest(
            enrolledCourseValidators.createEnrolledCourseValidationSchema,
        ),
        enrolledCourseControllers.createEnrolledCourse,
    )
    .patch(
        '/update-enrolled-course-marks',
        auth(USER_ROLE.faculty, USER_ROLE.superAdmin, USER_ROLE.admin),
        validateRequest(
            enrolledCourseValidators.updateEnrolledCourseMarksValidationZodSchema,
        ),
        enrolledCourseControllers.updateEnrolledCourseMarks,
    )
    .get(
        '/my-enrolled-courses',
        auth(USER_ROLE.student),
        enrolledCourseControllers.getMyEnrolledCourses,
    )
    .get(
        '/',
        auth(USER_ROLE.faculty),
        enrolledCourseControllers.getAllFacultyCourses,
    );

export const enrolledCourseRoutes = router;
