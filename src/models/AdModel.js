"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const getLocalizedDate = () => (0, moment_1.default)().locale('uk');
const Schema = mongoose_1.default.Schema;
const adSchema = new Schema({
    img: { type: String, default: '' },
    name: { type: String },
    description: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', },
    categoryId: {
        type: String,
    },
    subCategoryId: {
        type: String,
    },
    date: { type: String, default: getLocalizedDate().format('DD MMMM, HH:mm') },
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose_1.default.model('Ad', adSchema);
