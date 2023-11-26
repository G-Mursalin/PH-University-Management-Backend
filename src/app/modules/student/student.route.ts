import express from 'express';
import { studentControllers } from './student.controller';

const router = express.Router();

router
  .get('/', studentControllers.getAllStudents)
  .get('/:id', studentControllers.getStudentByID)
  .delete('/:id', studentControllers.deleteUserByID);

export const studentRoutes = router;
