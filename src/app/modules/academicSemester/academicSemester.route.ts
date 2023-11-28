import express from 'express';
import { academicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterValidations } from './academicSemester.validation';

const router = express.Router();

router
  .post(
    '/create-academic-semester',
    validateRequest(
      academicSemesterValidations.createAcademicSemesterValidationSchema,
    ),
    academicSemesterControllers.createAcademicSemester,
  )
  .get('/', academicSemesterControllers.getAllAcademicSemesters)
  .get('/:id', academicSemesterControllers.getAcademicSemesterById)
  .patch(
    '/:id',
    validateRequest(
      academicSemesterValidations.updateAcademicSemesterValidationSchema,
    ),
    academicSemesterControllers.updateAcademicSemester,
  );

export const academicSemesterRoutes = router;
