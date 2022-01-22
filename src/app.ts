import colors from 'colors'; // only for development purposes
import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import config from './config';
import cors from 'cors';
import {getMongoURI} from "./heplers/pathsGetters";
import AdsController from "./controllers/AdsController/AdsController";
import UserController from "./controllers/UserController/UserController";
import ChatController from "./controllers/ChatController";
import jwt from './services/authService';
import connectToDB from "./services/dbConnectService";
import multer from "multer";
import morgan from 'morgan';
import {createServer} from "http";
import {Server, Socket} from "socket.io";

// create instances for controllers
const User = new UserController();
const Ad = new AdsController();
const Chat = new ChatController();

const {brightGreen: serverColor}: any = colors;
const {PORT, AUTH} = config;

const mongoURI = getMongoURI();
const app = express();
const storage = multer.memoryStorage();
const upload = multer({storage});
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        credentials: true
    }
});

io.on("connection", (socket: Socket) => {
    socket.on("message", (message) => {
        console.log(message); // world
        socket.emit('received', 'MESSAGE RECEIVED: ' + message)
    });
    socket.on("typing", () => {

    })
});


// use middlewares
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
AUTH.isActive && app.use(jwt());
app.use(express.static('./uploads'));
app.use('/uploads', express.static('./uploads'));

// root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to GEBO app!',
    })
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
app.put('/user', upload.single('avatar'), User.update)
app.delete('/users', User.delete);
app.delete('/clear-users', User._clearUsersCollection);

app.post('/upload', (req: Request, res: Response) => {
    if (req.files) {
        res.send('Successfully uploaded ' + req.files.length + ' files!')
    } else {
        res.send('No files selected')
    }
})

// Chat
app.get('/users/chat', Chat.init);


// Server and Mongo connect
const start = async () => {
    console.log(serverColor('--app Server is staring...'))
    await connectToDB(mongoURI);
    await httpServer.listen(PORT, () => {
        console.log(serverColor(`--app Server listening at http://localhost:${PORT}`))
    })
}

start();
