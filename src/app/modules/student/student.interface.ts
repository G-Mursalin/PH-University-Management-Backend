import { Model, Types } from 'mongoose';

export type TGender = 'male' | 'female' | 'others';
export type TBloodGroup =
    | 'A+'
    | 'A-'
    | 'B+'
    | 'B-'
    | 'AB+'
    | 'AB-'
    | 'O+'
    | 'O-';

export type TGuardian = {
    fatherName: string;
    fatherOccupation: string;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string;
    motherContactNo: string;
};

export type TUserName = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export type TLocalGuardian = {
    name: string;
    occupation: string;
    contactNo: string;
    address: string;
};

export type TStudent = {
    id: string;
    user: Types.ObjectId;
    name: TUserName;
    gender: 'male' | 'female' | 'others';
    dateOfBirth?: string;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    presentAddress: string;
    permanentAddress: string;
    guardian: TGuardian;
    localGuardian: TLocalGuardian;
    profileImage?: string;
    isDeleted: boolean;
    admissionSemester: Types.ObjectId;
    academicDepartment: Types.ObjectId;
    academicFaculty: Types.ObjectId;
};

// **************Instance Methods

// export type TStudentMethod = {
//   isUserExists(id: string): Promise<TStudent | null>;
// };

// export type StudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   TStudentMethod
// >;

// ***********************Static Methods
export interface StudentModelStaticMethod extends Model<TStudent> {
    // eslint-disable-next-line no-unused-vars
    isUserExists(id: string): Promise<TStudent | null>;
}
