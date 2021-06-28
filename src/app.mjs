import colors from 'colors'; // only for development purposes
import express from 'express';
import config from './config.mjs';
import cors from 'cors';
import connectToDB from "./services/dbConnectService.mjs";
import bodyParser from 'body-parser';
import AdsController from "./controllers/AdsController.mjs";
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

//


// Server and Mongo connect
const start = async () => {

  await connectToDB(MONGODB_URI);
  await app.listen(PORT, () => {
    console.log(serverColor(`--app Server listening at http://localhost:${PORT}`))
  })
}
start();


// let addAdToMongo = async (adData) => {
//
//     const ad = new Ad({
//         idAd: adData.idAd,
//         img: adData.img,
//         description: adData.description,
//         author: adData.autor,
//         authorId: adData.autorId,
//         typeClass: adData.typeClass,
//         typeText: adData.typeText,
//         adData: adData.adData
//     })
//
//     await ad.save(function (err) {
//         if (err) return console.log(err)
//     })
//
// }
//
// // edit ad
// let editAdToMongo = (adData) => {
//
//     const ad = new Ad({
//         idAd: adData.idAd,
//         img: adData.img,
//         description: adData.description,
//         author: adData.autor,
//         authorId: adData.autorId,
//         typeClass: adData.typeClass,
//         typeText: adData.typeText,
//         adData: adData.adData
//     })
//
//     ad.save(function (err) {
//
//         if (err) return console.log(err)
//     })
// }
//
// // find ad :TODO need check, maybe need delete this function
// let findAD = (filter = {}, res) => {
//
//     Ad.find(filter, function (err, docs) {
//
//         if (err) res.send(err)
//         res.send(docs)
//
//     })
// }
//
// ////////// Routing
// // get main page for SPA
// app.get('/', function (req, res) {
//     app.use(express.static('front-build'))
//     res.sendFile(__dirname + "/front-build/index.html")
// })
//
// // get ads
// app.get('/get-ads/:userId', function (req, res) {
//
//     Ad.find({}, function (err, docs) {
//
//         if (err) console.log(err)
//         // @ts-ignore
//         let ads = docs.filter(item => (item.autorId != req.params.userId))
//         res.send(ads)
//         console.log('Ads is send.')
//     })
// })
//
// // get my ads
// app.get('/get-my-ads/:userId', function (req, res) {
//
//     Ad.find({autorId: req.params.userId}, function (err, docs) {
//         console.log(docs)
//
//         if (err) res.send(err)
//         res.send(docs)
//
//     })
// })
//
// // delete my ad
// app.get('/delete-ad/:adId', function (req, res) {
//
//     Ad.findOneAndDelete({idAd: req.params.adId}, function (err, docs) {
//
//         if (err) res.send(err)
//         console.log(`Ad id- ${req.params.adId} has delete.`)
//         res.sendStatus(200)
//
//     })
// })
//
// // add user
// app.post("/add-new-user", jsonParser, function (req, res) {
//
//
//
// })
//
// // add ad
// app.put("/add-new-ad", jsonParser, function (req, res) {
//
//     addAdToMongo(req.body.adData)
//     console.log('Ad is added.')
//     res.sendStatus(200)
//
// })
//
// // edit ad
// app.put("/edit-ad", jsonParser, async (req, res) => {
//
//     const filter = {_id: req.body.adData._id}
//     const update = {
//         adData: req.body.adData.adData,
//         autor: req.body.adData.autor,
//         autorId: req.body.adData.autorId,
//         description: req.body.adData.description,
//         idAd: req.body.adData.idAd,
//         img: req.body.adData.img,
//         typeClass: req.body.adData.typeClass,
//         typeText: req.body.adData.typeText
//     }
//
//     let updatedData = await Ad.findOneAndUpdate(filter, update, {new: true, upsert: true, rawResult: true})
//     res.send(updatedData)
//
// })
