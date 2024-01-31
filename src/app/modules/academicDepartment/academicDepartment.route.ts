import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicDepartmentValidation } from './academicDepartment.validation';
import { academicDepartmentControllers } from './academicDepartment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router
    .post(
        '/create-academic-department',
        auth(USER_ROLE.superAdmin),
        validateRequest(
            academicDepartmentValidation.createAcademicDepartmentValidationSchema,
        ),
        academicDepartmentControllers.createAcademicDepartment,
    )
    .get('/', academicDepartmentControllers.getAllAcademicDepartments)
    .get('/:id', academicDepartmentControllers.getSingleAcademicDepartment)
    .patch(
        '/:id',
        validateRequest(
            academicDepartmentValidation.updateAcademicDepartmentValidationSchema,
        ),
        academicDepartmentControllers.updateAcademicDepartment,
    );

export const academicDepartmentRoutes = router;
