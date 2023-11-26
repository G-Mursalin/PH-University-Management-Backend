import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import {
  // StudentModel,
  TGuardian,
  StudentModelStaticMethod,
  TLocalGuardian,
  TStudent,
  // TStudentMethod,
  TUserName,
} from './student.interface';
import validator from 'validator';
import config from '../../config';

const nameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'First name is required'],
    maxlength: [20, 'Max allowed length 20'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
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

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: [true, 'Father name is required'] },
  fatherOccupation: {
    type: String,
    required: [true, 'Father occupation is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father contact number is required'],
  },
  motherName: { type: String, required: [true, 'Mother name is required'] },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother contact number is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: [true, 'Local guardian name is required'] },
  occupation: {
    type: String,
    required: [true, 'Local guardian occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local guardian contact number is required'],
  },
  address: {
    type: String,
    required: [true, 'Local guardian address is required'],
  },
});

// Create Schema
// const studentSchema = new Schema<TStudent, StudentModel, TStudentMethod>({
//   id: {
//     type: String,
//     required: [true, 'Student ID is required'],
//     unique: true,
//   },
//   name: { type: nameSchema, required: [true, 'Student name is required'] },
//   gender: {
//     type: String,
//     enum: {
//       values: ['male', 'female', 'others'],
//       message: '{VALUE} is not valid',
//     },
//     required: [true, 'Gender is required'],
//   },
//   dateOfBirth: { type: String },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     validate: {
//       validator: function (value: string) {
//         return validator.isEmail(value);
//       },
//       message: '{VALUE} is not valid email',
//     },
//   },
//   contactNo: { type: String, required: [true, 'Contact number is required'] },
//   emergencyContactNo: {
//     type: String,
//     required: [true, 'Emergency contact number is required'],
//   },
//   bloodGroup: {
//     type: String,
//     enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
//   },
//   presentAddress: {
//     type: String,
//     required: [true, 'Present address is required'],
//   },
//   permanentAddress: {
//     type: String,
//     required: [true, 'Permanent address is required'],
//   },
//   guardian: {
//     type: guardianSchema,
//     required: [true, 'Guardian information is required'],
//   },
//   localGuardian: {
//     type: localGuardianSchema,
//     required: [true, 'Local guardian information is required'],
//   },
//   profileImage: { type: String },
//   isActive: { type: String, enum: ['active', 'blocked'], default: 'active' },
// });

// // Custom instance Methods
// studentSchema.methods.isUserExists = async function (id: string) {
//   return await Student.findOne({ id });
// };

// Create a Model.
// export const Student = model<TStudent, StudentModel>('Student', studentSchema);

// *******************************************************************
const studentSchema = new Schema<TStudent, StudentModelStaticMethod>(
  {
    id: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
    },
    password: { type: String, required: [true, 'Password is required'] },
    name: { type: nameSchema, required: [true, 'Student name is required'] },
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
    contactNo: { type: String, required: [true, 'Contact number is required'] },
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
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local guardian information is required'],
    },
    profileImage: { type: String },
    isActive: { type: String, enum: ['active', 'blocked'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// Custom Static Methods
studentSchema.statics.isUserExists = async function (id: string) {
  return await Student.findOne({ id });
};

// Middlewares
// **Document Middleware
// ****Only run create() / save()
studentSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt));

  next();
});

studentSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

//*** Query Middleware */
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// **** Aggregation middleware
studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// ********************Virtual Fields
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.lastName}`;
});

// Create a Model.
export const Student = model<TStudent, StudentModelStaticMethod>(
  'Student',
  studentSchema,
);
