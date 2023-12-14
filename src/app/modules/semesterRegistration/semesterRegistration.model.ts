import { Schema, model } from 'mongoose';
import { TSemesterRegistrationRoutes } from './semesterRegistration.interface';
import { SemesterRegistrationStatus } from './semesterRegistration.constant';

const semesterRegistrationSchema = new Schema<TSemesterRegistrationRoutes>(
    {
        academicSemester: {
            type: Schema.Types.ObjectId,
            unique: true,
            requiredPaths: true,
            ref: 'AcademicSemester',
        },
        status: {
            type: String,
            required: true,
            enum: SemesterRegistrationStatus,
            default: 'UPCOMING',
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        minCredit: { type: Number, default: 3 },
        maxCredit: { type: Number, default: 15 },
    },
    {
        timestamps: true,
    },
);

// Create a Model.
export const SemesterRegistration = model<TSemesterRegistrationRoutes>(
    'SemesterRegistration',
    semesterRegistrationSchema,
);
