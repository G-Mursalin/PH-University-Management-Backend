import { z } from 'zod';
import { BloodGroup, Gender } from './student.constant';

// *****************Create Validation
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

const guardianValidationSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

const localGuardianValidationSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    student: z.object({
      name: nameValidationSchema,
      gender: z.enum([...(Gender as [string, ...string[]])]),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum([...(BloodGroup as [string, ...string[]])]).optional(),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      profileImage: z.string().optional(),
      admissionSemester: z.string(),
    }),
  }),
});

// *****************Update Validation

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

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateNameValidationSchema.optional(),
      gender: z.enum([...(Gender as [string, ...string[]])]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z.enum([...(BloodGroup as [string, ...string[]])]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      profileImage: z.string().optional(),
      admissionSemester: z.string().optional(),
    }),
  }),
});

export const studentValidators = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
