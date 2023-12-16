import express from 'express';
import { authControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';

const router = express.Router();

router.post(
    '/login',
    validateRequest(authValidations.loginValidationSchema),
    authControllers.loginUser,
);

export const authRoutes = router;
