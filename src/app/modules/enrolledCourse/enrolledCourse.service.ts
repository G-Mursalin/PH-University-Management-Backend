import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { EnrolledCourse } from './enrolledCourse.model';
import { Student } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { Faculty } from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';

// Create Enrolled Courses
const createEnrolledCourse = async (userId: string, payload: string) => {
    // Check if the offered course exists
    const isOfferedCourseExists = await OfferedCourse.findById(payload);
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found');
    }

    // Check if the room capacity is OK
    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Room is full for this course',
        );
    }

    // Check if the student is already enrolled
    const student = await Student.findOne({ id: userId }, { _id: 1 });

    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
    }

    const isStudentAlreadyEnrolledInSameOfferedCourse =
        await EnrolledCourse.findOne({
            semesterRegistration: isOfferedCourseExists.semesterRegistration,
            offeredCourse: payload,
            student: student._id,
        });

    if (isStudentAlreadyEnrolledInSameOfferedCourse) {
        throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled');
    }

    // Check total enrolled credit for this student and compare it to semesterRegistration maxCredit
    // total enrolled credits + current enrolled credit > semesterRegistration maxCredit

    // **semesterRegistration maxCredit
    const semesterRegistrationMaxCredit = await SemesterRegistration.findById(
        isOfferedCourseExists.semesterRegistration,
    ).select('maxCredit');

    // **current enrolled credit
    const courseCredit = await Course.findById(
        isOfferedCourseExists.course,
    ).select('credits');

    // **total enrolled credits
    const enrolledCoursesTotalEnrolledCredits = await EnrolledCourse.aggregate([
        {
            $match: {
                student: student._id,
                semesterRegistration:
                    isOfferedCourseExists.semesterRegistration,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledCourses',
            },
        },
        {
            $unwind: '$enrolledCourses',
        },
        {
            $group: {
                _id: null,
                totalEnrolledCredits: { $sum: '$enrolledCourses.credits' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEnrolledCredits: 1,
            },
        },
    ]);
    const totalEnrolledCredits =
        enrolledCoursesTotalEnrolledCredits.length > 0
            ? enrolledCoursesTotalEnrolledCredits[0].totalEnrolledCredits
            : 0;

    if (
        totalEnrolledCredits &&
        semesterRegistrationMaxCredit?.maxCredit &&
        totalEnrolledCredits + courseCredit?.credits >
            semesterRegistrationMaxCredit?.maxCredit
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You have exceeded maximum number of credits',
        );
    }
    // Create an Enrolled Course
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const result = await EnrolledCourse.create(
            [
                {
                    semesterRegistration:
                        isOfferedCourseExists.semesterRegistration,
                    academicSemester: isOfferedCourseExists.academicSemester,
                    academicDepartment:
                        isOfferedCourseExists.academicDepartment,
                    academicFaculty: isOfferedCourseExists.academicFaculty,
                    offeredCourse: payload,
                    course: isOfferedCourseExists.course,
                    student: student._id,
                    faculty: isOfferedCourseExists.faculty,
                    isEnrolled: true,
                },
            ],
            { session },
        );

        if (!result || !result.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Fail to enrolled');
        }

        const maxCapacity = isOfferedCourseExists.maxCapacity;
        const updatedOfferedCourse = await OfferedCourse.findByIdAndUpdate(
            payload,
            {
                maxCapacity: maxCapacity - 1,
            },
            { session },
        );
        if (!updatedOfferedCourse) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Fail to enrolled');
        }

        await session.commitTransaction();
        await session.endSession();

        return result;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();

        throw error;
    }
};

// Update Enrolled Course Marks
const updateEnrolledCourseMarks = async (
    facultyId: string,
    payload: Partial<TEnrolledCourse>,
) => {
    const { semesterRegistration, offeredCourse, student, courseMarks } =
        payload;

    // Check if semesterRegistration exists
    const isSemesterRegistrationExists =
        await SemesterRegistration.findById(semesterRegistration);

    if (!isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Semester registration not found',
        );
    }

    // Check if OfferedCourseExists exists
    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found');
    }

    // Check if student exists
    const isStudentExists = await Student.findById(student);

    if (!isStudentExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
    }

    // Check if faculty exists
    const isFacultyExists = await Faculty.findOne(
        { id: facultyId },
        { _id: 1 },
    );

    if (!isFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
    }

    // Check if the faculty is belongs to that course
    const isCourseBelongToFaculty = await EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: isFacultyExists._id,
    });

    if (!isCourseBelongToFaculty) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden');
    }

    // Now update the course
    const modifiedData: Record<string, unknown> = {};

    if (courseMarks?.finalTerm) {
        const { classTest1, classTest2, midTerm, finalTerm } =
            isCourseBelongToFaculty.courseMarks;

        const totalMarks =
            Math.ceil(classTest1) +
            Math.ceil(midTerm) +
            Math.ceil(classTest2) +
            Math.ceil(finalTerm);

        const { grade, gradePoints } = calculateGradeAndPoints(totalMarks);

        modifiedData.grade = grade;
        modifiedData.gradePoints = gradePoints;
        modifiedData.isCompleted = true;
    }

    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value;
        }
    }

    const result = await EnrolledCourse.findByIdAndUpdate(
        isCourseBelongToFaculty._id,
        modifiedData,
        {
            new: true,
            runValidators: true,
        },
    );

    return result;
};

// Get My All Enrolled
const getMyEnrolledCourses = async (
    studentId: string,
    query: Record<string, unknown>,
) => {
    const student = await Student.findOne({ id: studentId });

    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found!');
    }

    const enrolledCourseQuery = new QueryBuilder(
        EnrolledCourse.find({ student: student._id }).populate(
            'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
        ),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await enrolledCourseQuery.modelQuery;
    const meta = await enrolledCourseQuery.countTotal();

    return {
        meta,
        result,
    };
};

// Get All Faculty Courses(Enrolled)
const getAllFacultyCourses = async (userId: string) => {
    const faculty = await Faculty.findOne({ id: userId }).select({
        _id: 1,
    });

    const courses = await EnrolledCourse.find({ faculty }).populate({
        path: 'student',
    });

    return courses;
};

export const enrolledCourseServices = {
    createEnrolledCourse,
    updateEnrolledCourseMarks,
    getMyEnrolledCourses,
    getAllFacultyCourses,
};
