import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.resolve(path.dirname(''));

const root = path.join.bind(this, __dirname);
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
