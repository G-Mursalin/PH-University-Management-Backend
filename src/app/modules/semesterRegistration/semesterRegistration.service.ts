import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistrationRoutes } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistration = async (
    payload: TSemesterRegistrationRoutes,
) => {
    // Check if there is any semester registered that is "UPCOMING" or "ONGOING"

    const isThereAnyUpcomingOrOngoingSemester =
        await SemesterRegistration.findOne({
            $or: [
                { status: RegistrationStatus.UPCOMING },
                { status: RegistrationStatus.ONGOING },
            ],
        });

    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `There is already a ${isThereAnyUpcomingOrOngoingSemester.status} registered semester!`,
        );
    }

    const academicSemester = payload?.academicSemester;
    //  Check if the academic semester is exists
    const isAcademicSemesterExists =
        await AcademicSemester.findById(academicSemester);

    if (!isAcademicSemesterExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Academic Semester is not found',
        );
    }

    // Check is the semester is already registered
    const isSemesterRegistrationExists = await SemesterRegistration.findOne({
        academicSemester,
    });

    if (isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'This Semester is already registered!',
        );
    }

    // Create Semester Registration
    const result = await SemesterRegistration.create(payload);

    return result;
};

const getAllSemesterRegistrations = async (query: Record<string, unknown>) => {
    const facultyQuery = new QueryBuilder(
        SemesterRegistration.find().populate('academicSemester'),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await facultyQuery.modelQuery;
    return result;
};

const getSemesterRegistrationByID = async (id: string) => {
    const result =
        SemesterRegistration.findById(id).populate('academicSemester');

    return result;
};

const updateSemesterRegistration = async (
    id: string,
    payload: Partial<TSemesterRegistrationRoutes>,
) => {
    //    Check if the requested semester is exists
    const isSemesterRegistrationExists =
        await SemesterRegistration.findById(id);

    if (!isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Semester Registration is not found',
        );
    }

    //   If the requested semester registration is ended then we wii not update anything

    const currentSemesterStatus = isSemesterRegistrationExists.status;
    const requestedStatus = payload?.status;

    if (currentSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This semester already ${currentSemesterStatus}`,
        );
    }

    //Update logic:

    // UPCOMING ==> ONGOING ==> ENDED
    if (
        currentSemesterStatus === RegistrationStatus.UPCOMING &&
        requestedStatus === RegistrationStatus.ENDED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
        );
    }

    if (
        currentSemesterStatus === RegistrationStatus.ONGOING &&
        requestedStatus === RegistrationStatus.UPCOMING
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
        );
    }

    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return result;
};

export const semesterRegistrationServices = {
    getAllSemesterRegistrations,
    getSemesterRegistrationByID,
    updateSemesterRegistration,
    createSemesterRegistration,
};
