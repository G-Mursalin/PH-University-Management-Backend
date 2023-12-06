import express from 'express';
import { facultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidators } from './faculty.validation';

const router = express.Router();

router
  .get('/', facultyControllers.getAllFaculties)
  .get('/:id', facultyControllers.getFacultiesByID)
  .delete('/:id', facultyControllers.deleteFacultyByID)
  .patch(
    '/:id',
    validateRequest(facultyValidators.updateFacultyValidationSchema),
    facultyControllers.updateFaculty,
  );

export const facultiesRoutes = router;
