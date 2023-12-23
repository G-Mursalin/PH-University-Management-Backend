import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { EnrolledCourse } from './enrolledCourse.model';
import { Student } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';

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

export const enrolledCourseServices = {
    createEnrolledCourse,
};
