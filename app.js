import colors from 'colors'; // only for development purposes
import express from 'express';
import bodyParser from 'body-parser';
import config from './config.mjs';
import cors from 'cors';

import AdsController from "./controllers/AdsController.mjs";
import UserController from "./controllers/UserController.mjs";
import ChatController from "./controllers/ChatController.mjs";
import CategoryController from "./controllers/CategoryController.mjs";

import jwt from './services/authService.mjs';
import connectToDB from "./services/dbConnectService.mjs";
import uploadService from "./services/uploadService.mjs";

// create instances for controllers
const User = new UserController();
const Ad = new AdsController();
const Chat = new ChatController();
const Category = new CategoryController();

const {brightGreen: serverColor} = colors;
const {MONGO_URI, PORT, NODE_ENV, DEV_MONGO_URI, AUTH} = config;
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// use middlewares
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(uploadService.multer);
AUTH.isActive && app.use(jwt());

// root route
app.all('/', (req, res) => {
    res.json({
        message: 'Welcome to GEBO app!',
    })
});

// Ads routes
app.get('/ads',Ad.index);
app.get('/ads/:id', Ad.read);
app.post('/ads', Ad.create);
app.put('/ads/:id', Ad.update);
app.delete('/ads/:id', Ad.delete);
app.delete('/clear-ads', Ad._clearAdsCollection)

// Categories routes
app.get('/cat', Category.index);
app.post('/cat', Category.create);
app.get('/cat/:catId', Category.read);
app.put('/cat/:catId', Category.update);
app.delete('/cat/:catId', Category.delete);
app.delete('/clear-cats', Category._clearCatsCollection);

// Users routes
app.get('/users', User.index);
app.get('/users/:id', User.read);
app.post('/add-new-user', User.create);
app.put('/users/:id', User.update);
app.delete('/users/:id', User.delete);
app.delete('/clear-users', User._clearUsersCollection);


// Chat
app.get('/users/:id/chat', Chat.init);


// Server and Mongo connect
const start = async () => {
    const mongoURI = NODE_ENV === 'development' ? DEV_MONGO_URI : MONGO_URI;
    console.log(serverColor('--app Server is staring...'))
    await connectToDB(mongoURI);
    await app.listen(PORT, () => {
        console.log(serverColor(`--app Server listening at http://localhost:${PORT}`))
    })
}

start();
