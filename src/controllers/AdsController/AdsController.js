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
const AdModel_1 = __importDefault(require("../../models/AdModel"));
const colors_1 = __importDefault(require("colors"));
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const authService_1 = require("../../services/authService");
const config_1 = __importDefault(require("../../config"));
const uploadService_1 = require("../../services/uploadService");
const AdsHandlers_1 = require("./AdsHandlers");
const UserHandlers_1 = require("../UserController/UserHandlers");
const { brightCyan: dbColor, red: errorColor, } = colors_1.default;
const { S3_PATH } = config_1.default.s3;
const { PER_PAGE } = config_1.default;
class AdsController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('-- AdsController method ".index" called --');
            console.log('query: ', req === null || req === void 0 ? void 0 : req.query);
            console.log('params: ', req === null || req === void 0 ? void 0 : req.params);
            const reqPage = Number(req.query['page']);
            if (!req.query['page']) {
                const result = yield (0, AdsHandlers_1.getPagedAdsHandler)();
                res.json(result);
            }
            else {
                const result = yield (0, AdsHandlers_1.getPagedAdsHandler)(reqPage);
                if (!result) {
                    return res.status(500).json({
                        message: `Error. Can't handle ads at page №: ${+req.query['page']}`,
                        ads: result
                    });
                }
                else {
                    console.log(result);
                    return res.json(result);
                }
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('-- AdsController method ".create" called --');
            const { file, body, query, headers: { authorization: auth } } = req || {};
            const { name, description, categoryId, subCategoryId, selectedCategories = [], selectedSubCategories = [] } = body || {};
            const { author } = yield (0, authService_1.getUserIdByToken)(auth);
            const perPage = Number(PER_PAGE);
            const reqPage = Number(query['page']) || 1;
            const adsTotalPromise = yield AdModel_1.default.countDocuments();
            const adsTotal = yield adsTotalPromise;
            const totalPages = Math.ceil(adsTotal / perPage);
            file && (yield (0, uploadService_1.uploadFile)(file));
            // Create Ad
            const ad = new AdModel_1.default({
                name: name || 'Оголошення',
                img: file ? S3_PATH + file.originalname : '',
                description: description || 'test ad description11',
                author: author,
                categoryId: categoryId || '1',
                subCategoryId: subCategoryId || '1'
            });
            console.log(selectedCategories, selectedSubCategories);
            // Return ads
            // return ads that matches selected categories
            if (selectedCategories && selectedSubCategories) {
                const result = yield AdModel_1.default
                    .find({
                    $or: [{ categoryId: { $in: selectedCategories } }, { subCategoryId: { $in: selectedSubCategories } }]
                })
                    .skip(perPage * reqPage - perPage)
                    .limit(+perPage)
                    .populate({ path: 'author', select: '-likedAds' })
                    .sort({ createdAt: -1 })
                    .exec();
                res.json({
                    message: `Ads successfully found`,
                    ads: result,
                    adsTotal,
                    totalPages,
                    perPage,
                    currentPage: reqPage
                });
                return;
            }
            // Update user with ref to this ad
            const result = yield (0, UserHandlers_1.updateAdOwner)(ad, author);
            // console.log(result.message);
            // save new ad
            const savedAd = yield (0, AdsHandlers_1.saveNewAdToDatabase)(ad);
            return res.json(savedAd);
        });
    }
    read(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('-- AdsController method ".read" called --');
            yield AdModel_1.default.findOne({ _id: req.params.id }).populate({
                path: 'author',
                select: '-likedAds'
            }).then((ad) => {
                if (!ad) {
                    res.json({
                        resultCode: res.statusCode,
                        message: `Ad with id ${req.params.id} not found in DB`,
                    });
                    console.log(errorColor(`Ad with id ${req.params.id} not found in DB`));
                }
                else {
                    res.json({
                        resultCode: res.statusCode,
                        message: `Ad with id ${req.params.id} found successfully in DB`,
                        ad
                    });
                    console.log(dbColor(`Ad with id ${req.params.id} found successfully in DB`));
                }
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('-- AdsController method ".update" called --');
            const { params } = req || {};
            const paramsId = params.id;
            let file;
            if (req.file) {
                file = yield (0, uploadService_1.uploadFile)(req.file);
            }
            yield AdModel_1.default.findByIdAndUpdate(paramsId, {
                $set: Object.assign(Object.assign({}, req.body), { 
                    // @ts-ignore
                    img: file ? S3_PATH + file.originalname : '' })
            }, (err) => {
                if (err) {
                    res.json({
                        resultCode: res.statusCode,
                        message: err
                    });
                    console.log(errorColor(`Error, cannot update Ad with id ${req.params.id}: `), err);
                }
                else {
                    res.json({
                        resultCode: res.statusCode,
                        message: `Ad with id ${req.params.id} is successfully updated`
                    });
                    console.log(dbColor(`Ad with id ${req.params.id} is successfully updated`, req.body));
                }
            });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('-- AdsController method ".delete" called --');
            const { author: userId } = yield (0, authService_1.getUserIdByToken)(req.headers.authorization);
            const deletedAd = yield AdModel_1.default.findByIdAndDelete(req.params.id).exec();
            yield UserModel_1.default.updateMany({}, { $pull: { likedAds: req.params.id, ads: req.params.id } });
            const userAds = yield UserModel_1.default.findById(userId, { ads: '$ads' }).populate('ads');
            if (userAds) {
                res.json({
                    resultCode: 201,
                    message: `Ad with id ${req.params.id} successfully deleted from DB`,
                    ads: userAds
                });
                console.log(dbColor(`Ad with id ${req.params.id} successfully deleted from DB`));
            }
            else {
                res.json({
                    resultCode: 409,
                    message: `Error, can\'t delete Ad with id ${req.params.id} from DB`
                });
                console.log(errorColor(`Error, can\'t delete Ad with id ${req.params.id} from DB`));
            }
        });
    }
    _clearAdsCollection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('-- AdsController method "._clearAdsCollection" called --');
            yield AdModel_1.default.deleteMany({}, (ads) => {
                res.json({
                    ads,
                    message: "ONLY FOR DEV ENV: All ads successfully removed from db. Also removed ads links in categories"
                });
            });
        });
    }
}
exports.default = AdsController;
