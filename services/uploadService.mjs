import multer from 'multer';
import moment from 'moment';
import config from '../config.mjs';
import S3 from 'aws-sdk/clients/s3.js';
import multerS3 from 'multer-s3';
import fs from 'fs';

const {
    S3_BUCKET_NAME: S3_BUCKET,
    BUCKET_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
} = config;

const s3 = new S3({
    region: BUCKET_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});

export const uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: S3_BUCKET,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise();
}

export const getFileStream = (fileKey) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: S3_BUCKET
    }

    return s3.getObject(downloadParams).createReadStream();
}

//
// multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: S3_BUCKET,
//         metadata: function (req, file, cb) {
//             console.log(req.headers);
//             console.log(file)
//             cb(null, {fieldName: file.fieldName})
//         },
//         key: function (req, file, cb) {
//             console.log(req.headers);
//             console.log(file)
//
//             cb(null, Date.now().toString())
//         }
//     })
// })

