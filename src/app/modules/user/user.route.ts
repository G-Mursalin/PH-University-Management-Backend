import express from 'express';
import { userControllers } from './user.controller';
import { studentValidators } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidators.createStudentValidationSchema),
  userControllers.createStudent,
);

export const userRoutes = router;
