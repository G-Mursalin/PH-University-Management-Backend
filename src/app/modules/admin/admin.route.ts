import express from 'express';
import { adminControllers } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidators } from './admin.validation';

const router = express.Router();

router
  .get('/', adminControllers.getAllAdmins)
  .get('/:id', adminControllers.getAdminByID)
  .delete('/:id', adminControllers.deleteAdminByID)
  .patch(
    '/:id',
    validateRequest(adminValidators.updateAdminValidationSchema),
    adminControllers.updateFaculty,
  );

export const adminRoutes = router;
