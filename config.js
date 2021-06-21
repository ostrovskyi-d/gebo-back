const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({path: root('.env')});

module.exports = {
    PORT: process.env.PORT || 4000,
    MONGODB_URI: process.env.MONGODB_URI,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    SESSION_SECRET: process.env.SESSION_SECRET,
    PER_PAGE: process.env.PER_PAGE || 1
};
