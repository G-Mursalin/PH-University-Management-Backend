import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
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
        role: {
            type: String,
            enum: { values: ['admin', 'student', 'faculty'] },
        },
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
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt),
    );
    next();
});

//  Set password "" while get user
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});

// Check if the user exist in database
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
    return await User.findOne({ id });
};

//  Check Password is correct
userSchema.statics.isPasswordMatched = async function (
    passwordFromReq: string,
    passwordInDB: string,
) {
    return await bcrypt.compare(passwordFromReq, passwordInDB);
};

// Create Model
export const User = model<TUser, UserModel>('User', userSchema);
