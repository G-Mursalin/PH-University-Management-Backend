/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import {
    generateFacultyID,
    generateStudentID,
    generateAdminID,
} from './user.utils';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';

// Create Student
const createStudent = async (password: string, student: TStudent) => {
    // Find Academic Semester Information
    const admissionSemester = await AcademicSemester.findById(
        student.admissionSemester,
    );

    if (!admissionSemester) {
        throw new AppError(404, 'This admission semester is not exists');
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Make user data
        const user: Partial<TUser> = {
            role: 'student',
            password: password || (config.default_password as string),
            id: await generateStudentID(admissionSemester),
            email: student.email,
        };

        // Crate a user (Transaction 1)
        const newUser = await User.create([user], { session });

        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Fail to create user');
        }

        // Make student data
        student.id = newUser[0].id;
        student.user = newUser[0]._id;
        // console.log(student);
        // Create a student (Transaction 2)
        const newStudent = await Student.create([student], { session });

        if (!newStudent.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Fail to create student',
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return newStudent[0];
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();

        throw error;
    }
};

// Create Faculty
const createFaculty = async (password: string, faculty: TFaculty) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Make user data
        const user: Partial<TUser> = {
            role: 'faculty',
            password: password || (config.default_password as string),
            id: await generateFacultyID(),
            email: faculty.email,
        };

        // Crate a user (Transaction 1)
        const newUser = await User.create([user], { session });

        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Fail to create user');
        }

        // Make Faculty data
        faculty.id = newUser[0].id;
        faculty.user = newUser[0]._id;

        // Create a student (Transaction 2)
        const newFaculty = await Faculty.create([faculty], { session });

        if (!newFaculty.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Fail to create faculty',
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return newFaculty[0];
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();

        throw error;
    }
};

// Create Admin
const createAdmin = async (password: string, admin: TAdmin) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Make user data
        const user: Partial<TUser> = {
            role: 'admin',
            password: password || (config.default_password as string),
            id: await generateAdminID(),
            email: admin.email,
        };

        // Crate a user (Transaction 1)
        const newUser = await User.create([user], { session });

        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Fail to create user');
        }

        // Make Faculty data
        admin.id = newUser[0].id;
        admin.user = newUser[0]._id;

        // Create a student (Transaction 2)
        const newFaculty = await Admin.create([admin], { session });

        if (!newFaculty.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Fail to create faculty',
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return newFaculty[0];
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();

        throw error;
    }
};

export const userServices = {
    createStudent,
    createFaculty,
    createAdmin,
};
