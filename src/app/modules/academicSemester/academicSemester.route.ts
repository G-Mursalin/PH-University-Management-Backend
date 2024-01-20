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
        validateRequest(
            academicSemesterValidations.createAcademicSemesterValidationSchema,
        ),
        academicSemesterControllers.createAcademicSemester,
    )
    .get(
        '/',
        auth(USER_ROLE.admin),
        academicSemesterControllers.getAllAcademicSemesters,
    )
    .get('/:id', academicSemesterControllers.getAcademicSemesterById)
    .patch(
        '/:id',
        validateRequest(
            academicSemesterValidations.updateAcademicSemesterValidationSchema,
        ),
        academicSemesterControllers.updateAcademicSemester,
    );

export const academicSemesterRoutes = router;
