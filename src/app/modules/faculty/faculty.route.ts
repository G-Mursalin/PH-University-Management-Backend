import express from 'express';
import { facultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidators } from './faculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router
    .get(
        '/',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        facultyControllers.getAllFaculties,
    )
    .get(
        '/:id',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
        facultyControllers.getFacultiesByID,
    )
    .delete(
        '/:id',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        facultyControllers.deleteFacultyByID,
    )
    .patch(
        '/:id',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        validateRequest(facultyValidators.updateFacultyValidationSchema),
        facultyControllers.updateFaculty,
    );

export const facultiesRoutes = router;
