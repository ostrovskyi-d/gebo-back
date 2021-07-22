import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.resolve(path.dirname(''));

const root = path.join.bind(this, __dirname);
dotenv.config({path: root('../.env')});

const config = {
    PORT: process.env.PORT || 3001,
    MONGODB_URI: process.env.MONGODB_URI,
    PER_PAGE: process.env.PER_PAGE || 1,
    SESSION_SECRET: process.env.SESSION_SECRET || '123jcaiedif7e8yhofbqeo87'
};

export default config;
