import colors from 'colors'; // only for development purposes
import express from 'express';
import jwt from './services/authService.mjs';
import config from './config.mjs';
import cors from 'cors';
import connectToDB from "./services/dbConnectService.mjs";
import bodyParser from 'body-parser';
import AdsController from "./controllers/AdsController.mjs";
import formidableMiddleware from 'express-formidable';
import UserController from "./controllers/UserController.mjs";
import ChatController from "./controllers/ChatController.mjs";

// create instances for controllers
const User = new UserController();
const Ad = new AdsController();
const Chat = new ChatController();

const {brightGreen: serverColor} = colors;
const {MONGO_URI, PORT, NODE_ENV, DEV_MONGO_URI} = config;
const app = express();

// use middlewares
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(formidableMiddleware());
app.use(jwt());

// root route
app.all('/', (req, res) => {
  res.json({
    message: 'Welcome to GEBO app!',
  })
})
// Ads routes
app.get('/ads', Ad.index);
app.get('/ads/:id', Ad.read);
app.post('/ads', Ad.create);
app.put('/ads/:id', Ad.update);
app.delete('/ads/:id', Ad.delete);
app.delete('/clear-ads', Ad._clearAdsCollection)

// Users routes
app.get('/users', User.index);
app.get('/users/:id', User.read);
app.post('/add-new-user', User.create);
app.put('/users/:id', User.update);
app.delete('/users/:id', User.delete);
app.delete('/clear-users', User._clearUsersCollection)

// Chat
app.get('/users/:id/chat', Chat.init)


// Server and Mongo connect
const start = async () => {
  const mongoURI = NODE_ENV === 'development' ? DEV_MONGO_URI : MONGO_URI;
  await connectToDB(mongoURI);
  await app.listen(PORT, () => {
    console.log(serverColor(`--app Server listening at http://localhost:${PORT}`))
  })
}
start();
