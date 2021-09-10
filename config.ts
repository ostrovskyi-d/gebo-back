import dotenv from 'dotenv';
import path from 'path';

let _dirname = path.resolve(path.dirname(''));

const root = path.join.bind(this, _dirname);
dotenv.config({path: root('.env')});

const config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    DEV_MONGO_URI: process.env.DEV_MONGO_URI,
    PER_PAGE: process.env.PER_PAGE || 5,
    JWT_SECRET: process.env.JWT_SECRET,
    DEV_ROOT_URL: process.env.DEV_ROOT_URL,
    ROOT_URL: process.env.ROOT_URL,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    BUCKET_REGION: process.env.BUCKET_REGION,
    S3_PATH: process.env.S3_PATH,

    AUTH: {
        isActive: false,
        NO_AUTH_PATHS: [
            // '/',
            // '/get-ads',
            // '/users',
            '/add-new-user',
            // '/clear-users',
            // '/clear-ads',
            // '/like-ad',
        ]
    },
};

export default config;
