import colors from 'colors'; // only for development purposes
import express from 'express';
import bodyParser from 'body-parser';
import config from './config.mjs';
import cors from 'cors';
import {getMongoURI} from "./heplers/pathsHandler.mjs";

import AdsController from "./controllers/AdsController.mjs";
import UserController from "./controllers/UserController.mjs";
import ChatController from "./controllers/ChatController.mjs";

import jwt from './services/authService.mjs';
import connectToDB from "./services/dbConnectService.mjs";
import multer from 'multer';
import {getFileStream} from './services/uploadService.mjs'

const upload = multer({dest: 'uploads/'});

// create instances for controllers
const User = new UserController();
const Ad = new AdsController();
const Chat = new ChatController();

const {brightGreen: serverColor} = colors;
const {PORT, AUTH} = config;
const mongoURI = getMongoURI();
const app = express();

// use middlewares
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
AUTH.isActive && app.use(jwt());

app.use(express.static('./uploads'));
app.use('/uploads', express.static('./uploads'));

// root route
app.all('/', (req, res) => {
    res.json({
        message: 'Welcome to GEBO app!',
    })
});

app.get('/uploads/:key', (req, res) => {
    try {

        const key = req.params.key;
        const readStream = getFileStream(key);

        readStream.pipe(res);
    } catch (err) {
        console.error(err);
        res.json({
            err: err,
            message: err.message,
        })
    }
})

// Ads routes
app.get('/ads', Ad.index);
app.get('/ads/:id', Ad.read);
app.post('/ads', upload.single('img'), Ad.create);
app.put('/ads/:id', Ad.update);
app.delete('/ads/:id', Ad.delete);
app.delete('/clear-ads', Ad._clearAdsCollection);

// Users routes
app.get('/users', User.index);
app.get('/users/:id', User.read);
app.post('/add-new-user', upload.single('avatar'), User.create);
app.put('/toggle-like-ad', User.update);
app.put('/user', User.update)
app.delete('/users/:id', User.delete);
app.delete('/clear-users', User._clearUsersCollection);


// Chat
app.get('/users/chat', Chat.init);


// Server and Mongo connect
const start = async () => {
    console.log(serverColor('--app Server is staring...'))
    await connectToDB(mongoURI);
    await app.listen(PORT, () => {
        console.log(serverColor(`--app Server listening at http://localhost:${PORT}`))
    })
}

start();
