import express from 'express';
import { authControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router
    .post(
        '/login',
        validateRequest(authValidations.loginValidationSchema),
        authControllers.loginUser,
    )
    .post(
        '/change-password',
        auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
        validateRequest(authValidations.changePasswordValidationSchema),
        authControllers.changeUserPassword,
    );

export const authRoutes = router;
