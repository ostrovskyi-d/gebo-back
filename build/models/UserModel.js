"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    name: { type: String, required: true, },
    phone: { type: String },
    avatar: { type: String },
    // @ts-ignore
    likedAds: [{ type: Schema.ObjectId, ref: 'Ad' }],
    ads: [{ type: Schema.Types.ObjectId, ref: 'Ad' }],
}, { versionKey: false }, 
// @ts-ignore
{ timestamps: true });
// userSchema.set('toJSON', {
//     virtuals: true
// });
exports.default = mongoose_1.default.model('User', userSchema);
