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
    SESSION_SECRET: process.env.SESSION_SECRET,
    AUTH: {
        isActive: false,
        NO_AUTH_PATHS: [
            '/',
            '/get-ads',
            '/users',
            '/add-new-user',
            '/clear-users',
            '/clear-ads',
        ]
    },
};

export default config;
