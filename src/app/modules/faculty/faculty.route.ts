import express from 'express';
import { facultyControllers } from './faculty.controller';

const router = express.Router();

router
  .get('/', facultyControllers.getAllFaculties)
  .get('/:id', facultyControllers.getFacultiesByID)
  .delete('/:id', facultyControllers.deleteFacultyByID)
  .patch('/:id', facultyControllers.updateFaculty);

export const facultiesRoutes = router;
