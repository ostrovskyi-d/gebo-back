import AWS from 'aws-sdk';
import config from "../config.mjs";

const s3 = new AWS.S3({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: config.BUCKET_REGION
});

export const uploadFile = (file) => {

    console.log(file);
    const params = {
        Bucket: config.S3_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    }

    s3.upload(params, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            return {
                fileLink: config.S3_PATH + file.originalname,
                s3_key: params['Key']
            };
        }
    })
}




