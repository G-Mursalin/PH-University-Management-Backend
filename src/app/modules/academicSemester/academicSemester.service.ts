import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import {
    academicSemesterNameCodeMapper,
    academicSemesterSearchableFields,
} from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemester = async (payLoad: TAcademicSemester) => {
    // Check semester code is valid
    if (academicSemesterNameCodeMapper[payLoad.name] != payLoad.code) {
        throw new AppError(400, 'Invalid Semester Code');
    }

    const result = await AcademicSemester.create(payLoad);

    return result;
};

const getAllAcademicSemesters = async (query: Record<string, unknown>) => {
    const academicSemesterQuery = new QueryBuilder(
        AcademicSemester.find(),
        query,
    )
        .search(academicSemesterSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await academicSemesterQuery.modelQuery;
    const meta = await academicSemesterQuery.countTotal();

    return { result, meta };
};
const getAcademicSemesterById = async (id: string) => {
    const result = await AcademicSemester.findById(id);

    return result;
};

// Update Academic Semester
const updateAcademicSemester = async (
    id: string,
    payload: Partial<TAcademicSemester>,
) => {
    // Check If the academic semester is exists
    const isAcademicSemesterExists = await AcademicSemester.findById(id);

    if (!isAcademicSemesterExists) {
        throw new AppError(404, 'Academic semester is not exist');
    }

    // Check if the semester name and code is matched
    if (
        payload.name &&
        payload.code &&
        academicSemesterNameCodeMapper[payload.name] !== payload.code
    ) {
        throw new Error('Invalid Semester Code');
    }

    const result = await AcademicSemester.findOneAndUpdate(
        { _id: id },
        payload,
        {
            new: true,
            runValidators: true,
        },
    );

    return result;
};

export const academicSemesterServices = {
    createAcademicSemester,
    getAllAcademicSemesters,
    getAcademicSemesterById,
    updateAcademicSemester,
};
