import express from 'express';
import { facultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidators } from './faculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router
    .get('/', auth(USER_ROLE.admin), facultyControllers.getAllFaculties)
    .get('/:id', facultyControllers.getFacultiesByID)
    .delete('/:id', facultyControllers.deleteFacultyByID)
    .patch(
        '/:id',
        validateRequest(facultyValidators.updateFacultyValidationSchema),
        facultyControllers.updateFaculty,
    );

export const facultiesRoutes = router;
