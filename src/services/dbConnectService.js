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
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const { brightCyan: dbColor, red: errorColor } = colors_1.default;
const connectToDB = (mongoURI) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        if (mongoose_1.default.connection.readyState === 1) {
            console.log(dbColor("--app Database connected: " + mongoURI));
        }
    }
    catch (error) {
        console.error(errorColor("--app MongoURI: ", mongoURI));
        console.error(errorColor("--app: connectToDB catch: " + error));
        console.error(errorColor("--app: Cannot connect to db, please try to connect local db."));
    }
    mongoose_1.default.connection.on('error', err => console.error(err));
    mongoose_1.default.connection.on('connected', () => console.log('Connected'));
});
exports.default = connectToDB;
