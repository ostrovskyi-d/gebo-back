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
exports.updateAdOwner = void 0;
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const updateAdOwner = (ad, adOwner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findOneAndUpdate({ _id: adOwner }, { "$addToSet": { ads: ad } });
        if (!user) {
            return {
                message: `Requested author doesn\'t exist {_id: ${adOwner}}... You shall not pass!`
            };
        }
        else {
            return {
                message: `Requested author (id: ${adOwner}) successfully updated with a new ad (id: ${ad._id})`,
            };
        }
    }
    catch (err) {
        return {
            message: "Server error... Please, try again later"
        };
    }
});
exports.updateAdOwner = updateAdOwner;
