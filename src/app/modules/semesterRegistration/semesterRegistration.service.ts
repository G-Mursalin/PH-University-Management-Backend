import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistrationRoutes } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import mongoose from 'mongoose';

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

    // Check is the academic semester is already registered
    const isSemesterRegistrationExists = await SemesterRegistration.findOne({
        academicSemester,
    });

    if (isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.CONFLICT,
            'This Semester is already registered!',
        );
    }

    // Create Semester Registration
    const result = await SemesterRegistration.create(payload);

    return result;
};

const getAllSemesterRegistrations = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuey = new QueryBuilder(
        SemesterRegistration.find().populate('academicSemester'),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await semesterRegistrationQuey.modelQuery;
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
    // Check if the requested semester is exists
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

    // UPCOMING ==> ONGOING ==> ENDED (We can only update this one direction)
    // We can't update status UPCOMING to ENDED
    if (
        currentSemesterStatus === RegistrationStatus.UPCOMING &&
        requestedStatus === RegistrationStatus.ENDED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
        );
    }

    // We can't update status ONGOING to UPCOMING
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

const deleteSemesterRegistration = async (id: string) => {
    const isSemesterRegistrationExists =
        await SemesterRegistration.findById(id);

    if (!isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'SemesterRegistration not found',
        );
    }

    if (isSemesterRegistrationExists.status !== 'UPCOMING') {
        throw new AppError(
            httpStatus.NOT_FOUND,
            `SemesterRegistration can not be deleted. Because this semesterRegistration is ${isSemesterRegistrationExists.status}`,
        );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Delete all OfferedCourse documents related to the semesterRegistration
        const offeredCourses = await OfferedCourse.deleteMany(
            { semesterRegistration: id },
            { session },
        );

        if (!offeredCourses) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Fail to delete SemesterRegistration',
            );
        }

        // Delete SemesterRegistration
        const result = await SemesterRegistration.findByIdAndDelete(id, {
            new: true,
            session,
        });

        if (!result) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Fail to delete SemesterRegistration',
            );
        }

        // Commit and end the transaction
        await session.commitTransaction();
        session.endSession();

        return result;
    } catch (error) {
        // If an error occurs, rollback the transaction and end transaction
        await session.abortTransaction();
        session.endSession();
    }
};

export const semesterRegistrationServices = {
    getAllSemesterRegistrations,
    getSemesterRegistrationByID,
    updateSemesterRegistration,
    createSemesterRegistration,
    deleteSemesterRegistration,
};
