import { Schema, model } from 'mongoose';
import validator from 'validator';
import { TAdmin, TAdminName } from './admin.interface';

const nameSchema = new Schema<TAdminName>({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name is required'],
        maxlength: [20, 'Max allowed length 20'],
        validate: {
            validator: function (value: string) {
                const firstNameStr =
                    value.charAt(0).toUpperCase() + value.slice(1);
                return firstNameStr === value;
            },
            message: '{VALUE} is not capitalize format',
        },
    },
    middleName: { type: String },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        validate: {
            validator: function (value: string) {
                return validator.isAlpha(value);
            },
            message: '{VALUE} is not value',
        },
    },
});

const adminSchema = new Schema<TAdmin>(
    {
        id: {
            type: String,
            required: [true, 'ID is required'],
            unique: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            required: [true, 'User id is required'],
            unique: true,
            ref: 'User',
        },
        designation: {
            type: String,
            required: [true, 'Designation is required'],
        },
        name: {
            type: nameSchema,
            required: [true, 'Faculty name is required'],
        },
        gender: {
            type: String,
            enum: {
                values: ['male', 'female', 'others'],
                message: '{VALUE} is not valid',
            },
            required: [true, 'Gender is required'],
        },
        dateOfBirth: { type: String },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            validate: {
                validator: function (value: string) {
                    return validator.isEmail(value);
                },
                message: '{VALUE} is not valid email',
            },
        },
        contactNo: {
            type: String,
            required: [true, 'Contact number is required'],
        },
        emergencyContactNo: {
            type: String,
            required: [true, 'Emergency contact number is required'],
        },
        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        },
        presentAddress: {
            type: String,
            required: [true, 'Present address is required'],
        },
        permanentAddress: {
            type: String,
            required: [true, 'Permanent address is required'],
        },
        profileImage: { type: String, default: '' },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Create a Model.
export const Admin = model<TAdmin>('Admin', adminSchema);
