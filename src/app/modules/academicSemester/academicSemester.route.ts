import express from 'express';
import { academicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterValidations } from './academicSemester.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router
    .post(
        '/create-academic-semester',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        validateRequest(
            academicSemesterValidations.createAcademicSemesterValidationSchema,
        ),
        academicSemesterControllers.createAcademicSemester,
    )
    .get(
        '/',
        auth(
            USER_ROLE.superAdmin,
            USER_ROLE.admin,
            USER_ROLE.faculty,
            USER_ROLE.student,
        ),
        academicSemesterControllers.getAllAcademicSemesters,
    )
    .get(
        '/:id',
        auth(
            USER_ROLE.superAdmin,
            USER_ROLE.admin,
            USER_ROLE.faculty,
            USER_ROLE.student,
        ),
        academicSemesterControllers.getAcademicSemesterById,
    )
    .patch(
        '/:id',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        validateRequest(
            academicSemesterValidations.updateAcademicSemesterValidationSchema,
        ),
        academicSemesterControllers.updateAcademicSemester,
    );

export const academicSemesterRoutes = router;
