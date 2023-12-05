import express from 'express';
import { adminControllers } from './admin.controller';

const router = express.Router();

router
  .get('/', adminControllers.getAllAdmins)
  .get('/:id', adminControllers.getAdminByID)
  .delete('/:id', adminControllers.deleteAdminByID)
  .patch('/:id', adminControllers.updateFaculty);

export const adminRoutes = router;
