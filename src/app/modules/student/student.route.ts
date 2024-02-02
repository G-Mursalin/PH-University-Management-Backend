import express from 'express';
import { studentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidators } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router
    .get(
        '/',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        studentControllers.getAllStudents,
    )
    .get(
        '/:id',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
        studentControllers.getStudentByID,
    )
    .delete(
        '/:id',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        studentControllers.deleteUserByID,
    )
    .patch(
        '/:id',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        validateRequest(studentValidators.updateStudentValidationSchema),
        studentControllers.updateStudent,
    );

export const studentRoutes = router;
