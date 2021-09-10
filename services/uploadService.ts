// @ts-ignore
import AWS from 'aws-sdk';
import config from "../config";

const s3 = new AWS.S3({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: config.BUCKET_REGION
});

const getParams = (file: any) => {
    return {
        Bucket: config.S3_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    }
}

export const deleteFile = async (file: any) => {
    const params: any = getParams(file);
    await s3.deleteObject(params, function (err: any, data: any) {
        if (err) console.log(err);
        else console.log("File successfully deleted")
    })
}

export const uploadFile = async (file: any) => {
    const params: any = getParams(file)
    return s3.upload(params, function (err: any, data: any) {
        if (err) {
            console.log(err);
        } else {
            return {
                fileLink: config.S3_PATH + file.originalname,
                s3_key: params['Key']
            };
        }
    });
}




