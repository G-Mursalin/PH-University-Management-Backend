import { Router } from 'express';
import { semesterRegistrationControllers } from './semesterRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { semesterRegistrationValidations } from './semesterRegistration.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router
    .post(
        '/',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        validateRequest(
            semesterRegistrationValidations.createSemesterRegistrationValidationSchema,
        ),
        semesterRegistrationControllers.createSemesterRegistration,
    )
    .get(
        '/',
        auth(
            USER_ROLE.superAdmin,
            USER_ROLE.admin,
            USER_ROLE.faculty,
            USER_ROLE.student,
        ),
        semesterRegistrationControllers.getAllSemesterRegistrations,
    )
    .get(
        '/:id',
        auth(
            USER_ROLE.superAdmin,
            USER_ROLE.admin,
            USER_ROLE.faculty,
            USER_ROLE.student,
        ),
        semesterRegistrationControllers.getSemesterRegistrationByID,
    )
    .patch(
        '/:id',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        validateRequest(
            semesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
        ),
        semesterRegistrationControllers.updateSemesterRegistration,
    )
    .delete(
        '/:id',
        auth(USER_ROLE.superAdmin, USER_ROLE.admin),
        semesterRegistrationControllers.deleteSemesterRegistration,
    );

export const semesterRegistrationRoutes = router;
