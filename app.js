// :TODO NEED ADDED TS FOR ALL FILE

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const {User, Ad} = require('./src/models');

////////// create express app and added headers in response
const app = express();
const jsonParser = express.json();


// change to cors module
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})
const connectToDB = async (mongodbUri) => {
    try {
        await mongoose.connect(mongodbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        mongoose.connection.readyState === 1
            && console.log("Successfully connected to mongodb" + config.MONGODB_URI)
    } catch (error) {
        console.error(error)
    }
}
connectToDB(config.MONGODB_URI);

////////// schemas for mongoose requests

////////// functions for mongoose
// added users in mongoDB
let userData = {
    name: 'Vasyaaaa',
    userId: 'aowd9awtd6atwgd',
    phone: 120198273
}

let addUserToMongo = async (userData) => {
    const user = new User(userData);
    await user.save()
        .then(function(doc){
            console.log("New user created {", "name" + doc?.name,"phone: " + doc?.phone + "}");
            mongoose.disconnect();  // отключение от базы данных
        })
        .catch(function (err){
            console.log(err);
            mongoose.disconnect();
        });

}

app.post('/', async (req, res) => {
    await addUserToMongo(userData);
    res.json(userData)
})

// added ad in mongoDB
let addAdToMongo = async (adData) => {

    const ad = new Ad({
        idAd: adData.idAd,
        img: adData.img,
        description: adData.description,
        author: adData.autor,
        authorId: adData.autorId,
        typeClass: adData.typeClass,
        typeText: adData.typeText,
        adData: adData.adData
    })

    await ad.save(function (err) {
        if (err) return console.log(err)
    })

}

// edit ad
let editAdToMongo = (adData) => {

    const ad = new Ad({
        idAd: adData.idAd,
        img: adData.img,
        description: adData.description,
        author: adData.autor,
        authorId: adData.autorId,
        typeClass: adData.typeClass,
        typeText: adData.typeText,
        adData: adData.adData
    })

    ad.save(function (err) {

        if (err) return console.log(err)
    })
}

// find ad :TODO need check, maybe need delete this function
let findAD = (filter = {}, res) => {

    Ad.find(filter, function (err, docs) {

        if (err) res.send(err)
        res.send(docs)

    })
}

////////// Routing
// get main page for SPA
app.get('/', function (req, res) {
    app.use(express.static('front-build'))
    res.sendFile(__dirname + "/front-build/index.html")
})

// get ads
app.get('/get-ads/:userId', function (req, res) {

    Ad.find({}, function (err, docs) {

        if (err) console.log(err)
        // @ts-ignore
        let ads = docs.filter(item => (item.autorId != req.params.userId))
        res.send(ads)
        console.log('Ads is send.')
    })
})

// get my ads
app.get('/get-my-ads/:userId', function (req, res) {

    Ad.find({autorId: req.params.userId}, function (err, docs) {
        console.log(docs)

        if (err) res.send(err)
        res.send(docs)

    })
})

// delete my ad
app.get('/delete-ad/:adId', function (req, res) {

    Ad.findOneAndDelete({idAd: req.params.adId}, function (err, docs) {

        if (err) res.send(err)
        console.log(`Ad id- ${req.params.adId} has delete.`)
        res.sendStatus(200)

    })
})

// add user
app.post("/add-new-user", jsonParser, function (req, res) {

    addUserToMongo(req.body.userData)
    console.log('User is added.')
    res.sendStatus(200)

})

// add ad
app.put("/add-new-ad", jsonParser, function (req, res) {

    addAdToMongo(req.body.adData)
    console.log('Ad is added.')
    res.sendStatus(200)

})

// edit ad
app.put("/edit-ad", jsonParser, async (req, res) => {

    const filter = {_id: req.body.adData._id}
    const update = {
        adData: req.body.adData.adData,
        autor: req.body.adData.autor,
        autorId: req.body.adData.autorId,
        description: req.body.adData.description,
        idAd: req.body.adData.idAd,
        img: req.body.adData.img,
        typeClass: req.body.adData.typeClass,
        typeText: req.body.adData.typeText
    }

    let updatedData = await Ad.findOneAndUpdate(filter, update, {new: true, upsert: true, rawResult: true})
    res.send(updatedData)

})

app.listen(config.PORT, () => {
    console.log(`Example app listening at http://localhost:${config.PORT}`)
})
