import { semesterRegistrationRoutes } from './../modules/semesterRegistration/semesterRegistration.route';
import { Router } from 'express';
import { studentRoutes } from '../modules/student/student.route';
import { userRoutes } from '../modules/user/user.route';
import { academicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { academicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { academicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { facultiesRoutes } from '../modules/faculty/faculty.route';
import { adminRoutes } from '../modules/admin/admin.route';
import { courseRoutes } from '../modules/course/course.route';
import { offeredCoursesRoutes } from '../modules/offeredCourse/offeredCourse.route';
import { authRoutes } from '../modules/auth/auth.route';
import { enrolledCourseRoutes } from '../modules/enrolledCourse/enrolledCourse.route';

const router = Router();

const moduleRoutes = [
    { path: '/students', route: studentRoutes },
    { path: '/users', route: userRoutes },
    { path: '/academic-semesters', route: academicSemesterRoutes },
    { path: '/academic-faculties', route: academicFacultyRoutes },
    { path: '/academic-departments', route: academicDepartmentRoutes },
    { path: '/faculties', route: facultiesRoutes },
    { path: '/admins', route: adminRoutes },
    { path: '/courses', route: courseRoutes },
    { path: '/semester-registrations', route: semesterRegistrationRoutes },
    { path: '/offered-courses', route: offeredCoursesRoutes },
    { path: '/auth', route: authRoutes },
    { path: '/enrolled-courses', route: enrolledCourseRoutes },
];

moduleRoutes.forEach((val) => router.use(val.path, val.route));

export default router;
