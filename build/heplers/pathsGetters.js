"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoURI = void 0;
const config_1 = __importDefault(require("../config"));
const { NODE_ENV, mongo: { MONGO_URI, DEV_MONGO_URI, LOCAL_DEV_MONGO_URI, }, } = config_1.default;
const getMongoURI = () => {
    if (NODE_ENV === 'production' || NODE_ENV === 'staging') {
        return MONGO_URI;
    }
    else if (NODE_ENV === 'development') {
        return DEV_MONGO_URI;
    }
    else if (NODE_ENV === 'local') {
        return LOCAL_DEV_MONGO_URI;
    }
};
exports.getMongoURI = getMongoURI;
