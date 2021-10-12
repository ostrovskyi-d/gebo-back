"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdModel_1 = __importDefault(require("./AdModel"));
const UserModel_1 = __importDefault(require("./UserModel"));
exports.default = {
    Ad: AdModel_1.default,
    User: UserModel_1.default,
};
