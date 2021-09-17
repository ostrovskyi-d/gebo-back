import config from '../config';

const {
    NODE_ENV,
    DEV_ROOT_URL,
    ROOT_URL,
    mongo: {
        MONGO_URI,
        DEV_MONGO_URI,
    },
} = config;


export const getRootPath = () => {
    if (NODE_ENV === 'production') {
        return ROOT_URL;
    } else if (NODE_ENV === 'development') {
        return DEV_ROOT_URL;
    }
}

export const getMongoURI = () => {
    if (NODE_ENV === 'production') {
        return MONGO_URI;
    } else if (NODE_ENV === 'development') {
        return DEV_MONGO_URI;
    }
}

