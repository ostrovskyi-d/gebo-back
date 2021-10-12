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
const colors_1 = __importDefault(require("colors")); // only for development purposes
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = __importDefault(require("./config"));
const cors_1 = __importDefault(require("cors"));
const pathsGetters_1 = require("./heplers/pathsGetters");
const AdsController_1 = __importDefault(require("./controllers/AdsController/AdsController"));
const UserController_1 = __importDefault(require("./controllers/UserController/UserController"));
const ChatController_1 = __importDefault(require("./controllers/ChatController"));
const authService_1 = __importDefault(require("./services/authService"));
const dbConnectService_1 = __importDefault(require("./services/dbConnectService"));
const multer_1 = __importDefault(require("multer"));
// create instances for controllers
const User = new UserController_1.default();
const Ad = new AdsController_1.default();
const Chat = new ChatController_1.default();
const { brightGreen: serverColor } = colors_1.default;
const { PORT, AUTH } = config_1.default;
const mongoURI = (0, pathsGetters_1.getMongoURI)();
const app = (0, express_1.default)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// use middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
AUTH.isActive && app.use((0, authService_1.default)());
app.use(express_1.default.static('./uploads'));
app.use('/uploads', express_1.default.static('./uploads'));
// root route
app.all('/', (req, res) => {
    res.json({
        message: 'Welcome to GEBO app!',
    });
});
// Ads routes
app.get('/ads?:page', Ad.index);
app.get('/ads/:id', Ad.read);
app.post('/ads', upload.single('img'), Ad.create);
app.put('/ads/:id', upload.single('img'), Ad.update);
app.delete('/ads/:id', Ad.delete);
app.delete('/clear-ads', Ad._clearAdsCollection);
// Users routes
app.get('/users', User.index);
app.get('/users/:id?/:my?', User.read);
app.post('/add-new-user', upload.single('avatar'), User.create);
app.put('/toggle-like-ad', User.update);
app.put('/user', upload.single('avatar'), User.update);
app.delete('/users', User.delete);
app.delete('/clear-users', User._clearUsersCollection);
app.post('/upload', (req, res) => {
    if (req.files) {
        res.send('Successfully uploaded ' + req.files.length + ' files!');
    }
    else {
        res.send('No files selected');
    }
});
// Chat
app.get('/users/chat', Chat.init);
// Server and Mongo connect
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(serverColor('--app Server is staring...'));
    yield (0, dbConnectService_1.default)(mongoURI);
    yield app.listen(PORT, () => {
        console.log(serverColor(`--app Server listening at http://localhost:${PORT}`));
    });
});
start();
