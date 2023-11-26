import { z } from 'zod';

// Zod Schema
const nameSchema = z.object({
  firstName: z
    .string()
    .refine(
      (data) =>
        data.trim().length > 0 &&
        data.length <= 20 &&
        /^[A-Z][a-z]*$/.test(data),
      {
        message:
          'First name must be capitalized and have at most 20 characters',
      },
    ),
  middleName: z.string(),
  lastName: z
    .string()
    .refine((data) => data.length > 0 && /^[A-Za-z]+$/.test(data), {
      message: 'Last name must contain only letters',
    }),
});

const guardianSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

const localGuardianSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

const studentZodSchema = z.object({
  id: z.string(),
  password: z.string(),
  name: nameSchema,
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
  guardian: guardianSchema,
  localGuardian: localGuardianSchema,
  profileImage: z.string().optional(),
  isActive: z.enum(['active', 'blocked']).default('active'),
  isDeleted: z.boolean().default(false),
});

export default studentZodSchema;
