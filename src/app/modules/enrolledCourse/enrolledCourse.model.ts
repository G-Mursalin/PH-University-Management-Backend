import { Schema, model } from 'mongoose';
import { TCourseMarks, TEnrolledCourse } from './enrolledCourse.interface';
import { Grade } from './enrolledCourse.constant';

const courseMarksSchema = new Schema<TCourseMarks>(
    {
        classTest1: { type: Number, default: 0 },
        midTerm: { type: Number, default: 0 },
        classTest2: { type: Number, default: 0 },
        finalTerm: { type: Number, default: 0 },
    },
    { _id: false },
);

const enrolledCourseSchema = new Schema<TEnrolledCourse>(
    {
        semesterRegistration: {
            type: Schema.Types.ObjectId,
            required: [true, 'semesterRegistration is required'],
            ref: 'SemesterRegistration',
        },
        academicSemester: {
            type: Schema.Types.ObjectId,
            required: [true, 'academicSemester is required'],
            ref: 'AcademicSemester',
        },
        academicDepartment: {
            type: Schema.Types.ObjectId,
            required: [true, 'academicSemester is required'],
            ref: 'AcademicDepartment',
        },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            required: [true, 'academicFaculty is required'],
            ref: 'AcademicFaculty',
        },
        offeredCourse: {
            type: Schema.Types.ObjectId,
            required: [true, 'offeredCourse is required'],
            ref: 'OfferedCourse',
        },
        course: {
            type: Schema.Types.ObjectId,
            required: [true, 'course is required'],
            ref: 'Course',
        },
        student: {
            type: Schema.Types.ObjectId,
            required: [true, 'student is required'],
            ref: 'Student',
        },
        faculty: {
            type: Schema.Types.ObjectId,
            required: [true, 'faculty is required'],
            ref: 'Faculty',
        },
        isEnrolled: { type: Boolean, default: false },
        courseMarks: { type: courseMarksSchema, default: {} },
        grade: { type: String, enum: Grade, default: 'NA' },
        gradePoints: { type: Number, min: 0, max: 4, default: 0 },
        isCompleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    },
);

// Create a Model.
export const EnrolledCourse = model<TEnrolledCourse>(
    'EnrolledCourse',
    enrolledCourseSchema,
);
