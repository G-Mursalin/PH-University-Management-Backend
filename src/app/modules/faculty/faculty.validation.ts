import { z } from 'zod';

// Zod Schema
const nameValidationSchema = z.object({
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

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    faculty: z.object({
      designation: z.string({ required_error: 'Designation is required' }),
      name: nameValidationSchema,
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
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

export const facultyValidators = {
  createFacultyValidationSchema,
};
