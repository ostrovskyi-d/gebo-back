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
exports.saveNewAdToDatabase = exports.getPagedAdsHandler = void 0;
const AdModel_1 = __importDefault(require("../../models/AdModel"));
const config_1 = __importDefault(require("../../config"));
const colors_1 = __importDefault(require("colors"));
const { PER_PAGE } = config_1.default;
const { brightCyan: dbColor, red: errorColor, } = colors_1.default;
const getPagedAdsHandler = (pageQuery = 1) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const perPage = +PER_PAGE;
        const reqPage = pageQuery || 1;
        const adsTotalPromise = yield AdModel_1.default.countDocuments();
        const adsTotal = yield adsTotalPromise;
        const totalPages = Math.ceil(adsTotal / perPage);
        const pagedAds = yield AdModel_1.default.find({})
            .skip(perPage * reqPage - perPage)
            .limit(+perPage)
            .populate({ path: 'author', select: '-likedAds' })
            .sort({ createdAt: -1 })
            .exec();
        if (!pagedAds)
            return pagedAds;
        return {
            message: `Ads successfully found`,
            ads: pagedAds,
            adsTotal,
            totalPages,
            perPage,
            currentPage: reqPage
        };
    }
    catch (err) {
        console.log(errorColor(err));
        return {
            // @ts-ignore
            message: err.message || 'Unknown error',
        };
    }
});
exports.getPagedAdsHandler = getPagedAdsHandler;
const saveNewAdToDatabase = (ad) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ad.save().then((ad, err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return {
                    message: "Error: " + err.message,
                    error: err
                };
            }
            console.log(dbColor(`Ad with id ${ad._id} successfully saved to DB`));
            return {
                message: `Ad with id ${ad._id} successfully saved to DB`,
                ad
            };
        }));
    }
    catch (err) {
        console.log(errorColor(err));
        return {
            // @ts-ignore
            message: "Error: " + err.message,
        };
    }
});
exports.saveNewAdToDatabase = saveNewAdToDatabase;
