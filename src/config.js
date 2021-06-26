import dotenv from 'dotenv';
import path from 'path';

const root = path.join.bind(this, __dirname);
dotenv.config({path: root('../.env')});

const config = {
    PORT: process.env.PORT || 4000,
    MONGODB_URI: process.env.MONGODB_URI,
    PER_PAGE: process.env.PER_PAGE || 1
};
export default config;
