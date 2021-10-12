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
const config_1 = __importDefault(require("../../config"));
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const colors_1 = __importDefault(require("colors"));
// @ts-ignore
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService_1 = require("../../services/authService");
const AdModel_1 = __importDefault(require("../../models/AdModel"));
const uploadService_1 = require("../../services/uploadService");
const { S3_PATH } = config_1.default.s3;
const { JWT_SECRET } = config_1.default.AUTH;
const { brightCyan: dbColor, red: errorColor } = colors_1.default;
class UserController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserModel_1.default.find({}).then((users, err) => {
                if (err) {
                    console.log(errorColor(`Error, can't find users: `), err);
                    res.json({
                        resultCode: res.statusCode,
                        message: err
                    });
                }
                else {
                    console.log(dbColor('Users successfully found'));
                    res.json({
                        resultCode: res.statusCode,
                        message: `Users successfully found`, users
                    });
                }
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { name, phone }, file } = req;
            try {
                file && (yield (0, uploadService_1.uploadFile)(file));
                const user = new UserModel_1.default({
                    name: name || 'Default',
                    phone: phone || '000000000',
                    avatar: file ? S3_PATH + file.originalname : '',
                });
                if (user) {
                    const token = jsonwebtoken_1.default.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '7d' });
                    console.log("Bearer token: ", token);
                    console.log("User ID: ", user._id);
                    // @ts-ignore
                    yield user.save().then((doc, err) => {
                        if (err) {
                            return res.json({
                                resultCode: res.statusCode,
                                message: err.message
                            });
                        }
                        res.json({
                            resultCode: res.statusCode,
                            message: `User with id ${doc._id} successfully saved to DB`,
                            user,
                            token,
                        });
                        console.log(dbColor(`User with id ${doc._id} successfully saved to DB`));
                    });
                }
            }
            catch (err) {
                res.json({
                    resultCode: 409,
                    message: `Error: User with name ${name} can't be created.`
                });
                console.log(errorColor(`Error: User with name ${name} can't be created: `), err);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, params, headers, file } = req;
                const { likedAds, name, phone } = body;
                // @ts-ignore
                const { author: updatedForId } = yield (0, authService_1.getUserIdByToken)(headers === null || headers === void 0 ? void 0 : headers.authorization);
                file && (yield (0, uploadService_1.uploadFile)(file));
                const userId = (params === null || params === void 0 ? void 0 : params.id) || updatedForId;
                yield UserModel_1.default.findByIdAndUpdate(userId, {
                    $set: Object.assign(Object.assign({}, body), { avatar: file ? S3_PATH + file.originalname : '' })
                });
                yield UserModel_1.default.updateOne({ _id: userId }, { $set: Object.assign({}, body) });
                const updatedUser = yield UserModel_1.default.findById(userId).exec();
                if (likedAds) {
                    res.json({ likedAds: updatedUser['likedAds'] });
                }
                else {
                    res.json(updatedUser);
                }
            }
            catch (err) {
                console.log(errorColor(err));
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { author: userId } = yield (0, authService_1.getUserIdByToken)(req.headers.authorization);
                yield UserModel_1.default.deleteOne({ _id: userId }).then((user) => __awaiter(this, void 0, void 0, function* () {
                    if (user) {
                        yield AdModel_1.default.deleteMany({ 'author': userId });
                        res.json({
                            resultCode: res.statusCode,
                            message: `User with id ${userId} successfully deleted from DB`
                        });
                        console.log(dbColor(`User with id ${userId} successfully deleted from DB`));
                    }
                    else {
                        res.json({
                            resultCode: 409, message: `Error, can\'t delete User with id ${userId} from DB`
                        });
                        console.log(errorColor(`Error, can\'t delete User with id ${userId} from DB`));
                    }
                }));
            }
            catch (err) {
                console.log(errorColor("Error: "), err);
            }
        });
    }
    read(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = (req) => __awaiter(this, void 0, void 0, function* () {
                console.log(req);
                if (req.params['my']) {
                    return yield UserModel_1.default.findOne({ _id: req.params.id }, 'likedAds')
                        .populate({
                        path: 'likedAds',
                        model: AdModel_1.default,
                        populate: {
                            path: 'author',
                            select: 'name phone'
                        }
                    })
                        .exec();
                }
                else {
                    return yield UserModel_1.default.findOne({ _id: req.params.id })
                        .populate({
                        path: 'ads',
                        model: AdModel_1.default,
                        populate: {
                            path: 'author',
                            select: 'name phone',
                        }
                    })
                        .populate('likedAds')
                        .exec();
                }
            });
            try {
                let user = yield getUser(req);
                console.log(user);
                if (!user) {
                    res.json({
                        resultCode: 409,
                        message: `User with id ${req.params.id} not found in DB`
                    });
                    console.log(errorColor(`User with id ${req.params.id} not found in DB`));
                }
                else {
                    res.json({
                        resultCode: 201,
                        message: `User with id ${req.params.id} found successfully in DB`,
                        user
                    });
                    console.log(dbColor(`User with id ${req.params.id} found successfully in DB`));
                }
            }
            catch (err) {
                console.log(errorColor("Error: "), err);
            }
        });
    }
    _clearUsersCollection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserModel_1.default.deleteMany({}, (users) => {
                res.json({
                    users,
                    message: "ONLY FOR DEV ENV: All users successfully removed from db"
                });
            });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.default.findById({ _id: id });
        });
    }
}
exports.default = UserController;
