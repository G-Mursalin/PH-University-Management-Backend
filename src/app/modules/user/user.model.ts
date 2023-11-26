import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
    },
    password: { type: String, required: [true, 'Password is required'] },
    needsPasswordChange: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: { values: ['in-progress', 'blocked'] },
      default: 'in-progress',
    },
    role: { type: String, enum: { values: ['admin', 'student', 'faculty'] } },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Hash password while saving to database
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt));
  next();
});

//  Set password "" while get user
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Create Model
export const User = model<TUser>('User', userSchema);
