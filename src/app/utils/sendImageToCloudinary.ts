/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

// Cloudinary Config
cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
});

// Send image to cloudinary
export const sendImageToCloudinary = (
    imagName: string,
    path: string,
): Promise<any> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            path,
            { public_id: imagName },
            function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result as UploadApiResponse);
                    // Delete the file after upload file to cloudinary
                    fs.unlink(path, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            console.log('File is deleted');
                        }
                    });
                }
            },
        );
    });
};

// Store file to Upload folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

export const upload = multer({ storage: storage });
