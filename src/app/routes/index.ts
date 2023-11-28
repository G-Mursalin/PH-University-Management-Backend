import { Router } from 'express';
import { studentRoutes } from '../modules/student/student.route';
import { userRoutes } from '../modules/user/user.route';
import { academicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';

const router = Router();

const moduleRoutes = [
  { path: '/students', route: studentRoutes },
  { path: '/users', route: userRoutes },
  { path: '/academic-semesters', route: academicSemesterRoutes },
];

moduleRoutes.forEach((val) => router.use(val.path, val.route));

export default router;
