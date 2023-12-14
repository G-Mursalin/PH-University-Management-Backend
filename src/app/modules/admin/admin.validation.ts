import { z } from 'zod';
import { BloodGroup, Gender } from './admin.constant';

//********Create Validation
const createNameValidationSchema = z.object({
    firstName: z.string(),
    // .refine(
    //   (data) =>
    //     data.trim().length > 0 &&
    //     data.length <= 20 &&
    //     /^[A-Z][a-z]*$/.test(data),
    //   {
    //     message:
    //       'First name must be capitalized and have at most 20 characters',
    //   },
    // ),
    middleName: z.string(),
    lastName: z
        .string()
        .refine((data) => data.length > 0 && /^[A-Za-z]+$/.test(data), {
            message: 'Last name must contain only letters',
        }),
});

const createAdminValidationSchema = z.object({
    body: z.object({
        password: z.string().optional(),
        admin: z.object({
            designation: z.string({
                required_error: 'Designation is required',
            }),
            name: createNameValidationSchema,
            gender: z.enum(['male', 'female', 'others']),
            dateOfBirth: z.string().optional(),
            email: z.string().email(),
            contactNo: z.string(),
            emergencyContactNo: z.string(),
            bloodGroup: z
                .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
                .optional(),
            presentAddress: z.string(),
            permanentAddress: z.string(),
            profileImage: z.string().optional(),
            isDeleted: z.boolean().default(false),
        }),
    }),
});

//********Update Validation
const updateNameValidationSchema = z.object({
    firstName: z.string().optional(),
    // .refine(
    //   (data) =>
    //     data.trim().length > 0 &&
    //     data.length <= 20 &&
    //     /^[A-Z][a-z]*$/.test(data),
    //   {
    //     message:
    //       'First name must be capitalized and have at most 20 characters',
    //   },
    // ),
    middleName: z.string().optional(),
    lastName: z
        .string()
        .refine((data) => data.length > 0 && /^[A-Za-z]+$/.test(data), {
            message: 'Last name must contain only letters',
        })
        .optional(),
});

const updateAdminValidationSchema = z.object({
    body: z.object({
        admin: z.object({
            designation: z
                .string({ required_error: 'Designation is required' })
                .optional(),
            name: updateNameValidationSchema.optional(),
            gender: z.enum([...(Gender as [string, ...string[]])]).optional(),
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
            isDeleted: z.boolean().default(false).optional(),
        }),
    }),
});

export const adminValidators = {
    createAdminValidationSchema,
    updateAdminValidationSchema,
};
