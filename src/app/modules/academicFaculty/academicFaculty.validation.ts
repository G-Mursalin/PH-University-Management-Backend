import { z } from 'zod';

const createAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Academic faculty name is required',
      invalid_type_error: 'Academic faculty name must be string',
    }),
  }),
});
const updateAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Academic faculty name is required',
      invalid_type_error: 'Academic faculty name must be string',
    }),
  }),
});

export const academicFacultyValidators = {
  createAcademicFacultyValidationSchema,
  updateAcademicFacultyValidationSchema,
};
