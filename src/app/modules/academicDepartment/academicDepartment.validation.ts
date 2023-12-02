import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Academic department must be string',
    }),
    academicFaculty: z.string({
      required_error: 'Faculty is required',
      invalid_type_error: 'Academic faculty must be string',
    }),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Academic department must be string',
      })
      .optional(),
    academicFaculty: z
      .string({
        required_error: 'Faculty is required',
        invalid_type_error: 'Academic faculty must be string',
      })
      .optional(),
  }),
});

export const academicDepartmentValidation = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
