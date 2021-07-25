import colors from 'colors'; // only for development purposes
import express from 'express';
import jwt from './services/authService.mjs';
import config from './config.mjs';
import cors from 'cors';
import connectToDB from "./services/dbConnectService.mjs";
import bodyParser from 'body-parser';
import AdsController from "./controllers/AdsController.mjs";
import formidable from 'express-formidable';
import UserController from "./controllers/UserController.mjs";

// create instances for controllers
const User = new UserController();
const Ad = new AdsController();

const {brightGreen: serverColor} = colors;
const {MONGODB_URI, PORT} = config;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(formidable());
app.use(jwt());

app.all('/', (req, res) => {
  res.send("Hello")
})
// Ads routes
app.get('/ads', Ad.index);
app.get('/ads/:id', Ad.read);
app.post('/ads', Ad.create);
app.put('/ads/:id', Ad.update);
app.delete('/ads/:id', Ad.delete);

// Users routes
app.get('/users', User.index);
app.get('/users/:id', User.read);
app.post('/add-new-user', User.create);
app.put('/users/:id', User.update);
app.delete('/users/:id', User.delete);
app.delete('/clear-users', User._clearUsersCollection)
//


// Server and Mongo connect
const start = async () => {

  await connectToDB(MONGODB_URI);
  await app.listen(PORT, () => {
    console.log(serverColor(`--app Server listening at http://localhost:${PORT}`))
  })
}
start();
