import { SemesterRegistration } from './../semesterRegistration/semesterRegistration.model';
import httpStatus from 'http-status';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import AppError from '../../errors/AppError';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { hasTimeConflict } from './offeredCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from '../semesterRegistration/semesterRegistration.constant';

const createOfferedCourse = async (payload: TOfferedCourse) => {
    const {
        semesterRegistration,
        academicFaculty,
        academicDepartment,
        course,
        section,
        faculty,
        days,
        startTime,
        endTime,
    } = payload;

    // Check if the semester registration is exists
    const isSemesterRegistrationExits =
        await SemesterRegistration.findById(semesterRegistration);

    if (!isSemesterRegistrationExits) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Semester registration not found !',
        );
    }

    // Get the academicSemester ObjectID from semester registration
    const academicSemester = isSemesterRegistrationExits.academicSemester;

    // Check if the academic faculty is exists
    const isAcademicFacultyExits =
        await AcademicFaculty.findById(academicFaculty);

    if (!isAcademicFacultyExits) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Academic Faculty not found !',
        );
    }

    // Check if the academic department is exists
    const isAcademicDepartmentExits =
        await AcademicDepartment.findById(academicDepartment);

    if (!isAcademicDepartmentExits) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Academic Department not found !',
        );
    }

    // Check if the course is exists
    const isCourseExits = await Course.findById(course);

    if (!isCourseExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found !');
    }

    // Check if the faculty is exists
    const isFacultyExits = await Faculty.findById(faculty);

    if (!isFacultyExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
    }

    // Check if the department is belongs to the faculty
    const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty,
    });

    if (!isDepartmentBelongToFaculty) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This ${isAcademicDepartmentExits.name} is not  belong to this ${isAcademicFacultyExits.name}`,
        );
    }

    // Check if the same offered course same section in same registered semester exists
    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
        await OfferedCourse.findOne({
            semesterRegistration,
            course,
            section,
        });

    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Offered course with same section is already exist!`,
        );
    }

    //*** Solve the time conflations for faculty
    // Get the schedules for faculties
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time! Choose other time or day`,
        );
    }

    const result = await OfferedCourse.create({
        ...payload,
        academicSemester,
    });
    return result;
};

const getAllOfferedCourses = async (query: Record<string, unknown>) => {
    const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await offeredCourseQuery.modelQuery;
    return result;
};

const getOfferedCourseById = async (id: string) => {
    const offeredCourse = await OfferedCourse.findById(id);

    if (!offeredCourse) {
        throw new AppError(404, 'Offered Course not found');
    }

    return offeredCourse;
};

const updateOfferedCourse = async (
    id: string,
    payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
    const { faculty, days, startTime, endTime } = payload;

    // Check if the offeredCourse exists
    const isOfferedCourseExits = await OfferedCourse.findById(id);

    if (!isOfferedCourseExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found!');
    }

    // Check faculty is exists
    const isFacultyExits = await Faculty.findById(faculty);

    if (!isFacultyExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
    }

    // Check  semester registration status (Admin can only update offered course in which semesterRegistration is UPCOMING )
    const semesterRegistrationStatus = await SemesterRegistration.findById(
        isOfferedCourseExits.semesterRegistration,
    ).select('status');
    if (semesterRegistrationStatus?.status !== RegistrationStatus.UPCOMING) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not update! Because the registered semester is ${semesterRegistrationStatus?.status}`,
        );
    }

    //*** Solve the time conflations for faculty
    // Get the schedules for faculties
    const semesterRegistration = isOfferedCourseExits.semesterRegistration;
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
    }).select('days startTime endTime');

    const filteredAssignedSchedules = assignedSchedules.filter(
        (val) => String(val._id) !== id,
    );

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (hasTimeConflict(filteredAssignedSchedules, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time! Choose other time or day`,
        );
    }

    const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
};

const deleteOfferedCourse = async (id: string) => {
    // Check if the offeredCourse exists
    const isOfferedCourseExists = await OfferedCourse.findById(id);

    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
    }

    // Check semester registration status (Admin can delete offeredCourse only if semesterRegistration is UPCOMING)
    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    const semesterRegistrationStatus =
        await SemesterRegistration.findById(semesterRegistration).select(
            'status',
        );

    if (semesterRegistrationStatus?.status !== RegistrationStatus.UPCOMING) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Offered course can not deleted! Because the semester is ${semesterRegistrationStatus}`,
        );
    }

    const result = await OfferedCourse.findByIdAndDelete(id);

    return result;
};

export const offeredCourseServices = {
    createOfferedCourse,
    getAllOfferedCourses,
    getOfferedCourseById,
    updateOfferedCourse,
    deleteOfferedCourse,
};
