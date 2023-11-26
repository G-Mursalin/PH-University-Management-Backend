import { Router } from 'express';
import { studentRoutes } from '../modules/student/student.route';
import { userRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  { path: '/students', route: studentRoutes },
  { path: '/users', route: userRoutes },
];

moduleRoutes.forEach((val) => router.use(val.path, val.route));

export default router;
