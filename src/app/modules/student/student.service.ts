import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudents = async (query: Record<string, unknown>) => {
    const studentQuery = new QueryBuilder(
        Student.find()
            .populate('user')
            .populate('admissionSemester')
            .populate('academicDepartment academicFaculty'),
        query,
    )
        .search(studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await studentQuery.modelQuery;
    const meta = await studentQuery.countTotal();
    return { meta, result };
};

const getStudentByID = async (id: string) => {
    const result = await Student.findById(id)
        .populate({ path: 'admissionSemester' })
        .populate({ path: 'academicDepartment', populate: 'academicFaculty' });

    return result;
};

const updateStudent = async (id: string, payload: Partial<TStudent>) => {
    const { name, guardian, localGuardian, ...remainingStudentData } = payload;

    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingStudentData,
    };

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }

    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value;
        }
    }

    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`localGuardian.${key}`] = value;
        }
    }

    const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    return result;
};

const deleteUserByID = async (id: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const deletedStudent = await Student.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, session },
        );
        if (!deletedStudent) {
            throw new AppError(400, 'Fail to delete student');
        }
        const deletedUser = await User.findByIdAndUpdate(
            deletedStudent.user,
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedUser) {
            throw new AppError(400, 'Fail to delete user');
        }
        await session.commitTransaction();
        await session.endSession();
        return deletedStudent;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
    }
};

export const studentServices = {
    getAllStudents,
    getStudentByID,
    updateStudent,
    deleteUserByID,
};
