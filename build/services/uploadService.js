"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.deleteFile = void 0;
// @ts-ignore
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("../config"));
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET_REGION, S3_BUCKET_NAME, S3_PATH } = config_1.default.s3;
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: BUCKET_REGION
});
const getParams = (file) => {
    return {
        Bucket: S3_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };
};
const deleteFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const params = getParams(file);
    yield s3.deleteObject(params, function (err, data) {
        if (err)
            console.log(err);
        else
            console.log("File successfully deleted");
    });
});
exports.deleteFile = deleteFile;
const uploadFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const params = getParams(file);
    return s3.upload(params, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            return {
                fileLink: S3_PATH + file.originalname,
                s3_key: params['Key']
            };
        }
    });
});
exports.uploadFile = uploadFile;
