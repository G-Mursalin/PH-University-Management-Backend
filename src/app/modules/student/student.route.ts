import express from 'express';
import { studentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidators } from './student.validation';

const router = express.Router();

router
  .get('/', studentControllers.getAllStudents)
  .get('/:id', studentControllers.getStudentByID)
  .delete('/:id', studentControllers.deleteUserByID)
  .patch(
    '/:id',
    validateRequest(studentValidators.updateStudentValidationSchema),
    studentControllers.updateStudent,
  );

export const studentRoutes = router;
