import express from 'express';
import { userControllers } from './user.controller';
import { studentValidators } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidators } from '../faculty/faculty.validation';
import { adminValidators } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { userValidators } from './user.validation';

const router = express.Router();

router
    .post(
        '/create-student',
        auth(USER_ROLE.admin),
        validateRequest(studentValidators.createStudentValidationSchema),
        userControllers.createStudent,
    )
    .post(
        '/create-faculty',
        auth(USER_ROLE.admin),
        validateRequest(facultyValidators.createFacultyValidationSchema),
        userControllers.createFaculty,
    )
    .post(
        '/create-admin',
        // auth(USER_ROLE.admin),
        validateRequest(adminValidators.createAdminValidationSchema),
        userControllers.createAdmin,
    )
    .get(
        '/get-me',
        auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
        userControllers.getMe,
    )
    .post(
        '/change-status/:id',
        auth(USER_ROLE.admin),
        validateRequest(userValidators.changeStatusValidationSchema),
        userControllers.changeStatus,
    );

export const userRoutes = router;
