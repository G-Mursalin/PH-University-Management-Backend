/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
    generateAdminID,
    generateFacultyID,
    generateStudentID,
} from './user.utils';

// Create Student
const createStudent = async (
    file: any,
    password: string,
    student: TStudent,
) => {
    // Find Academic Semester Information
    const admissionSemester = await AcademicSemester.findById(
        student.admissionSemester,
    );

    if (!admissionSemester) {
        throw new AppError(404, 'This admission semester is not exists');
    }

    // Find Academic Department
    const academicDepartment = await AcademicDepartment.findById(
        student.academicDepartment,
    );

    if (!academicDepartment) {
        throw new AppError(404, 'This department is not exists');
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

        //If user send image file then Upload image to Cloudinary
        const imageName = file
            ? `${newUser[0].id}-${student.name.firstName}-${student.name.lastName}`
            : '';
        const { secure_url } = file
            ? await sendImageToCloudinary(imageName, file.path)
            : '';

        // Make student data
        student.id = newUser[0].id;
        student.user = newUser[0]._id;
        student.profileImage = secure_url;
        student.academicFaculty = academicDepartment.academicFaculty;

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
const createFaculty = async (
    file: any,
    password: string,
    faculty: TFaculty,
) => {
    // Check if the academicDepartment Exists
    const isAcademicDepartmentExists = await AcademicDepartment.findById(
        faculty.academicDepartment,
    );
    if (!isAcademicDepartmentExists) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Academic Department is not exists',
        );
    }

    // Start Transaction
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

        //If user send image file then Upload image to Cloudinary
        const imageName = file
            ? `${newUser[0].id}-${faculty.name.firstName}-${faculty.name.lastName}`
            : '';
        const { secure_url } = file
            ? await sendImageToCloudinary(imageName, file.path)
            : '';

        // Make Faculty data
        faculty.id = newUser[0].id;
        faculty.user = newUser[0]._id;
        faculty.profileImage = secure_url;
        faculty.academicFaculty = isAcademicDepartmentExists.academicFaculty;

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
const createAdmin = async (file: any, password: string, admin: TAdmin) => {
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

        //If user send image file then Upload image to Cloudinary
        const imageName = file
            ? `${newUser[0].id}-${admin.name.firstName}-${admin.name.lastName}`
            : '';
        const { secure_url } = file
            ? await sendImageToCloudinary(imageName, file.path)
            : '';

        // Make Admin data
        admin.id = newUser[0].id;
        admin.user = newUser[0]._id;
        admin.profileImage = secure_url;

        // Create a Admin (Transaction 2)
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

// Get me
const getMe = async (userId: string, role: string) => {
    let result = null;
    if (role === 'student') {
        result = await Student.findOne({ id: userId }).populate('user');
    }

    if (role === 'admin') {
        result = await Admin.findOne({ id: userId }).populate('user');
    }

    if (role === 'faculty') {
        result = await Faculty.findOne({ id: userId }).populate('user');
    }

    return result;
};

// Change User Status
const changeStatus = async (id: string, status: string) => {
    // Check if the user exists
    const isUserExists = await User.findById(id);

    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
    }

    const result = await User.findByIdAndUpdate(
        id,
        { status },
        {
            new: true,
            runValidators: true,
        },
    );
    return result;
};

export const userServices = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    changeStatus,
};
