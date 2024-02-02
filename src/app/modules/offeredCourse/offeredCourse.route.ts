import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { offeredCourseValidations } from './offeredCourse.validation';
import { offeredCourseControllers } from './offeredCourse.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router
    .post(
        '/',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        validateRequest(
            offeredCourseValidations.createOfferedCourseValidationSchema,
        ),
        offeredCourseControllers.createOfferedCourse,
    )
    .get(
        '/',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
        offeredCourseControllers.getAllOfferedCourses,
    )
    .get(
        '/my-offered-courses',
        auth(USER_ROLE.student),
        offeredCourseControllers.getMyOfferedCourses,
    )
    .get(
        '/:id',
        auth(
            USER_ROLE.superAdmin,
            USER_ROLE.admin,
            USER_ROLE.faculty,
            USER_ROLE.student,
        ),
        offeredCourseControllers.getOfferedCourseById,
    )
    .patch(
        '/:id',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        validateRequest(
            offeredCourseValidations.updateOfferedCourseValidationSchema,
        ),
        offeredCourseControllers.updateOfferedCourse,
    )
    .delete(
        '/:id',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        offeredCourseControllers.deleteOfferedCourse,
    );

export const offeredCoursesRoutes = router;
