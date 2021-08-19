import config from '../config.mjs';
import S3 from 'aws-sdk/clients/s3.js';
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
    try {
        console.warn(file);
        const fileStream = fs.createReadStream(file.path);

        const uploadParams = {
            Bucket: S3_BUCKET,
            Body: fileStream,
            Key: file.filename
        }

        return s3.upload(uploadParams).promise();
    } catch (err) {
        console.error(err)
    }
}

export const getFileStream = (fileKey) => {
    try {
        const downloadParams = {
            Key: fileKey,
            Bucket: S3_BUCKET
        }

        return s3.getObject(downloadParams).createReadStream();
    } catch (err) {
        console.error(err);
    }
}
