import { z } from 'zod';
import { BloodGroup, Gender } from './faculty.constant';

// Create Validation
const createNameValidationSchema = z.object({
    firstName: z
        .string()
        .refine(
            (data) =>
                data.trim().length > 0 &&
                data.length <= 20 &&
                /^[A-Z][a-z]*$/.test(data),
            {
                message:
                    'First name must be capitalized, can not contain any number or spacial character and have maximum 20 characters',
            },
        ),
    middleName: z
        .string()
        .refine(
            (data) =>
                data.trim().length > 0 &&
                data.length <= 20 &&
                /^[A-Z][a-z]*$/.test(data),
            {
                message:
                    'Middle name must be capitalized, can not contain any number or spacial character and have maximum 20 characters',
            },
        )
        .optional(),
    lastName: z
        .string()
        .refine(
            (data) =>
                data.trim().length > 0 &&
                data.length <= 20 &&
                /^[A-Z][a-z]*$/.test(data),
            {
                message:
                    'Last name must be capitalized, can not contain any number or spacial character and have maximum 20 characters',
            },
        ),
});

const createFacultyValidationSchema = z.object({
    body: z.object({
        password: z.string().optional(),
        faculty: z.object({
            designation: z.string({
                required_error: 'Designation is required',
            }),
            name: createNameValidationSchema,
            gender: z.enum([...Gender] as [string, ...string[]]),
            dateOfBirth: z.string().optional(),
            email: z.string().email(),
            contactNo: z.string(),
            emergencyContactNo: z.string(),
            bloodGroup: z
                .enum([...(BloodGroup as [string, ...string[]])])
                .optional(),
            presentAddress: z.string(),
            permanentAddress: z.string(),
            profileImage: z.string().optional(),
            academicDepartment: z.string(),
            isDeleted: z.boolean().default(false),
        }),
    }),
});

// Update Validation
const updateNameValidationSchema = z.object({
    firstName: z
        .string()
        .refine(
            (data) =>
                data.trim().length > 0 &&
                data.length <= 20 &&
                /^[A-Z][a-z]*$/.test(data),
            {
                message:
                    'First name must be capitalized, can not contain any number or spacial character and have maximum 20 characters',
            },
        )
        .optional(),
    middleName: z
        .string()
        .refine(
            (data) =>
                data.trim().length > 0 &&
                data.length <= 20 &&
                /^[A-Z][a-z]*$/.test(data),
            {
                message:
                    'Middle name must be capitalized, can not contain any number or spacial character and have maximum 20 characters',
            },
        )
        .optional(),
    lastName: z
        .string()
        .refine(
            (data) =>
                data.trim().length > 0 &&
                data.length <= 20 &&
                /^[A-Z][a-z]*$/.test(data),
            {
                message:
                    'Last name must be capitalized, can not contain any number or spacial character and have maximum 20 characters',
            },
        )
        .optional(),
});

const updateFacultyValidationSchema = z.object({
    body: z.object({
        faculty: z.object({
            designation: z
                .string({ required_error: 'Designation is required' })
                .optional(),
            name: updateNameValidationSchema.optional(),
            gender: z.enum([...Gender] as [string, ...string[]]).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().email().optional(),
            contactNo: z.string().optional(),
            emergencyContactNo: z.string().optional(),
            bloodGroup: z
                .enum([...(BloodGroup as [string, ...string[]])])
                .optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string().optional(),
            profileImage: z.string().optional(),
            academicFaculty: z.string().optional(),
            academicDepartment: z.string().optional(),
            isDeleted: z.boolean().default(false).optional(),
        }),
    }),
});

export const facultyValidators = {
    createFacultyValidationSchema,
    updateFacultyValidationSchema,
};
