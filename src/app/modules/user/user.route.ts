import express from 'express';
import { userControllers } from './user.controller';
import { studentValidators } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidators } from '../faculty/faculty.validation';
import { adminValidators } from '../admin/admin.validation';

const router = express.Router();

router
  .post(
    '/create-student',
    validateRequest(studentValidators.createStudentValidationSchema),
    userControllers.createStudent,
  )
  .post(
    '/create-faculty',
    validateRequest(facultyValidators.createFacultyValidationSchema),
    userControllers.createFaculty,
  )
  .post(
    '/create-admin',
    validateRequest(adminValidators.createFacultyValidationSchema),
    userControllers.createAdmin,
  );

export const userRoutes = router;
