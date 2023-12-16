import { Router } from 'express';
import { semesterRegistrationControllers } from './semesterRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { semesterRegistrationValidations } from './semesterRegistration.validation';

const router = Router();

router
    .post(
        '/',
        validateRequest(
            semesterRegistrationValidations.createSemesterRegistrationValidationSchema,
        ),
        semesterRegistrationControllers.createSemesterRegistration,
    )
    .get('/', semesterRegistrationControllers.getAllSemesterRegistrations)
    .get('/:id', semesterRegistrationControllers.getSemesterRegistrationByID)
    .patch(
        '/:id',
        validateRequest(
            semesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
        ),
        semesterRegistrationControllers.updateSemesterRegistration,
    )
    .delete('/:id', semesterRegistrationControllers.deleteSemesterRegistration);

export const semesterRegistrationRoutes = router;
