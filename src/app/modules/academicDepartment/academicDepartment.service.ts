import AppError from '../../errors/AppError';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

const createAcademicDepartment = async (payload: TAcademicDepartment) => {
    //Check if academic faculty exists
    const academicFaculty = await AcademicFaculty.findById(
        payload.academicFaculty,
    );

    if (!academicFaculty) {
        throw new AppError(404, 'Academic Faculty is not exists');
    }

    const result = await AcademicDepartment.create(payload);
    return result;
};

const getAllAcademicDepartments = async () => {
    const result = await AcademicDepartment.find().populate('academicFaculty');
    return result;
};

const getSingleAcademicDepartment = async (id: string) => {
    const result =
        await AcademicDepartment.findById(id).populate('academicFaculty');
    return result;
};

const updateAcademicDepartment = async (
    id: string,
    payload: Partial<TAcademicDepartment>,
) => {
    const result = await AcademicDepartment.findOneAndUpdate(
        { _id: id },
        payload,
        {
            new: true,
            validator: true,
        },
    );
    return result;
};

export const academicDepartmentServices = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateAcademicDepartment,
};
