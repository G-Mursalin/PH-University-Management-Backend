import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { offeredCourseValidations } from './offeredCourse.validation';
import { offeredCourseControllers } from './offeredCourse.controller';

const router = Router();

router
    .post(
        '/',
        validateRequest(
            offeredCourseValidations.createOfferedCourseValidationSchema,
        ),
        offeredCourseControllers.createOfferedCourse,
    )
    .get('/', offeredCourseControllers.getAllOfferedCourses)
    .get('/:id', offeredCourseControllers.getOfferedCourseById)
    .patch(
        '/:id',
        validateRequest(
            offeredCourseValidations.updateOfferedCourseValidationSchema,
        ),
        offeredCourseControllers.updateOfferedCourse,
    )
    .delete('/:id', offeredCourseControllers.deleteOfferedCourse);

export const offeredCoursesRoutes = router;
