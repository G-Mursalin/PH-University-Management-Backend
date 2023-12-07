import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { courseControllers } from './course.controller';
import { courseValidations } from './course.validation';

const router = express.Router();

router
  .post(
    '/create-course',
    validateRequest(courseValidations.createCourseValidationSchema),
    courseControllers.createCourse,
  )
  .get('/:id', courseControllers.getSingleCourse)
  .get('/', courseControllers.getAllCourses)
  .patch(
    '/:id',
    validateRequest(courseValidations.updateCourseValidationSchema),
    courseControllers.updateCourse,
  )
  .delete('/:id', courseControllers.deleteCourse)
  .put(
    '/:courseId/assign-faculties',
    validateRequest(courseValidations.facultiesWithCourseValidationSchema),
    courseControllers.assignFacultiesWithCourse,
  )
  .delete(
    '/:courseId/remove-faculties',
    validateRequest(courseValidations.facultiesWithCourseValidationSchema),
    courseControllers.removeFacultiesFromCourse,
  );

export const courseRoutes = router;
