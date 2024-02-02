import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { courseControllers } from './course.controller';
import { courseValidations } from './course.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router
    .post(
        '/create-course',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        validateRequest(courseValidations.createCourseValidationSchema),
        courseControllers.createCourse,
    )
    .get(
        '/:id',
        auth(
            USER_ROLE.superAdmin,
            USER_ROLE.admin,
            USER_ROLE.faculty,
            USER_ROLE.student,
        ),
        courseControllers.getSingleCourse,
    )
    .get('/', courseControllers.getAllCourses)
    .patch(
        '/:id',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        validateRequest(courseValidations.updateCourseValidationSchema),
        courseControllers.updateCourse,
    )
    .delete(
        '/:id',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        courseControllers.deleteCourse,
    )
    .get(
        '/:courseId/course-faculties',
        auth(
            USER_ROLE.superAdmin,
            USER_ROLE.admin,
            USER_ROLE.faculty,
            USER_ROLE.student,
        ),
        courseControllers.getFacultiesCourse,
    )
    .put(
        '/:courseId/assign-faculties',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        validateRequest(courseValidations.facultiesWithCourseValidationSchema),
        courseControllers.assignFacultiesWithCourse,
    )
    .delete(
        '/:courseId/remove-faculties',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        validateRequest(courseValidations.facultiesWithCourseValidationSchema),
        courseControllers.removeFacultiesFromCourse,
    );

export const courseRoutes = router;
