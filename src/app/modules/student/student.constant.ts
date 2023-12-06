import { TBloodGroup, TGender } from './student.interface';

export const Gender: TGender[] = ['male', 'female', 'others'];

export const BloodGroup: TBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export const studentSearchableFields = [
  'email',
  'name.firstName',
  'presentAddress',
];
