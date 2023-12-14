import { Types } from 'mongoose';

export type TSemesterRegistrationRoutes = {
    academicSemester: Types.ObjectId;
    status: 'UPCOMING' | 'ONGOING' | 'ENDED';
    startDate: Date;
    endDate: Date;
    minCredit: number;
    maxCredit: number;
};
