import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyValidators } from './academicFaculty.validation';
import { academicFacultyControllers } from './academinFaculty.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router
    .post(
        '/create-academic-faculty',
        auth(USER_ROLE.superAdmin),
        validateRequest(
            academicFacultyValidators.createAcademicFacultyValidationSchema,
        ),
        academicFacultyControllers.createAcademicFaculty,
    )
    .get('/', academicFacultyControllers.getAllAcademicFaculties)
    .get('/:id', academicFacultyControllers.getSingleAcademicFaculty)
    .patch(
        '/:id',
        validateRequest(
            academicFacultyValidators.updateAcademicFacultyValidationSchema,
        ),
        academicFacultyControllers.updateAcademicFaculty,
    );

export const academicFacultyRoutes = router;
