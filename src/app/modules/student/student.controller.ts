import { Request, Response } from 'express';
import { studentServices } from './student.service';
// import studentSchema from './student.joi.validation';
import studentZodSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student } = req.body;
    // ********************Zod*********************************
    const zodData = studentZodSchema.parse(student);

    const result = await studentServices.createStudentToDB(zodData);

    res.status(200).send({
      success: true,
      message: 'Student is created successfully',
      data: result,
    });
    // // *****************Joi*******************************

    // const { error, value } = studentSchema.validate(student);
    // if (error) {
    //   res.status(500).send({
    //     success: false,
    //     message: 'Something Went Wrong',
    //     error: error.details,
    //   });
    // } else {
    //   const result = await studentServices.createStudentToDB(value);
    //   res.status(200).send({
    //     success: true,
    //     message: 'Student is created successfully',
    //     data: result,
    //   });
    // }
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: error.message || 'Something Went Wrong',
      error: error,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await studentServices.getAllStudentsFromDB();

    res.status(200).send({
      success: true,
      message: 'Students are retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: error.message || 'Something Went Wrong',
      error: error,
    });
  }
};

const getStudentByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await studentServices.getStudentByIDFromDB(id);

    res.status(200).send({
      success: true,
      message: 'Student retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteUserByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await studentServices.deleteStudentFromDB(id);

    res.status(200).send({
      success: true,
      message: 'Student deleted successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: error.message || 'Something Went Wrong',
      error: error,
    });
  }
};

export const studentControllers = {
  createStudent,
  getAllStudents,
  getStudentByID,
  deleteUserByID,
};
