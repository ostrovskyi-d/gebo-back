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
exports.getUserIdByToken = void 0;
// @ts-ignore
const express_jwt_1 = __importDefault(require("express-jwt"));
const config_1 = __importDefault(require("../config"));
const UserController_1 = __importDefault(require("../controllers/UserController/UserController"));
// @ts-ignore
const jsonwebtoken_1 = require("jsonwebtoken");
const { AUTH } = config_1.default;
const User = new UserController_1.default();
const isRevoked = (req, payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.getById(payload.sub);
    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }
    done();
});
const jwt = () => {
    return (0, express_jwt_1.default)({
        secret: AUTH.JWT_SECRET,
        algorithms: ['HS256'],
        isRevoked
    }).unless({
        // public routes that don't require authentication
        path: AUTH.NO_AUTH_PATHS
    });
};
const getUserIdByToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (token) {
        const parsedToken = token.toString().includes('Bearer') ? token.split('Bearer ')[1] : token;
        const { sub: author } = yield (0, jsonwebtoken_1.verify)(parsedToken, AUTH.JWT_SECRET);
        return { author };
    }
    else {
        return undefined;
    }
});
exports.getUserIdByToken = getUserIdByToken;
exports.default = jwt;
