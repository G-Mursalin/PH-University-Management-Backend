import express from 'express';
import { enrolledCourseControllers } from './enrolledCourse.controller';
import validateRequest from '../../middlewares/validateRequest';
import { enrolledCourseValidators } from './enrolledCourse.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/create-enrolled-course',
    auth(USER_ROLE.student),
    validateRequest(
        enrolledCourseValidators.createEnrolledCourseValidationSchema,
    ),
    enrolledCourseControllers.createEnrolledCourse,
);

export const enrolledCourseRoutes = router;
