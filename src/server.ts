// :TODO NEED ADDED TS FOR ALL FILE

const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');
const {User, Ad} = require('./models');



////////// create express server and added headers in response
const server = express();
const jsonParser = express.json();

server.use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

////////// connect URI for mongoDB

////////// connect mongoose with mongoDB
// process.env.PORT - this port for HEROKU
// 2000 - this port for localhost
mongoose.connect((config.MONGODB_URI), {useNewUrlParser: true, useUnifiedTopology: true}, function (err: any) {
    if (err) return console.log(err)
    server.listen(config.MONGODB_URI, function () {
        console.log(`server is up. port: ${config.MONGODB_URI}`)
        console.log(`connect to: ${config.MONGODB_URI}`)
    })
})

////////// schemas for mongoose requests

////////// functions for mongoose
// added users in mongoDB
let addUserToMongo = (userData: any) => {

    let newUserData: any = {
        name: userData.name,
        userId: userData.idUser,
    }

    if (userData.phone) {
        newUserData.phone = userData.phone
    }

    const user = new User(newUserData)

    user.save(function (err: any) {

        if (err) return console.log(err)
    })

}

// added ad in mongoDB
let addAdToMongo = (adData: any) => {

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

    ad.save(function (err: any) {

        if (err) return console.log(err)
    })
}

// edit ad
let editAdToMongo = (adData: any) => {

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

    ad.save(function (err: any) {

        if (err) return console.log(err)
    })
}

// find ad :TODO need check, maybe need delete this function
let findAD = (filter = {}, res: any) => {

    Ad.find(filter, function (err: any, docs: any) {

        if (err) res.send(err)
        res.send(docs)

    })
}

////////// Routing
// get main page for SPA
server.get('/', function (req: any, res: any) {
    server.use(express.static('front-build'))
    res.sendFile(__dirname + "/front-build/index.html")
})

// get ads
server.get('/get-ads/:userId', function (req: any, res: any) {

    Ad.find({}, function (err: any, docs: any) {

        if (err) console.log(err)
        // @ts-ignore
        let ads = docs.filter(item => (item.autorId != req.params.userId))
        res.send(ads)
        console.log('Ads is send.')
    })
})

// get my ads
server.get('/get-my-ads/:userId', function (req: any, res: any) {

    Ad.find({autorId: req.params.userId}, function (err: any, docs: any) {
        console.log(docs)

        if (err) res.send(err)
        res.send(docs)

    })
})

// delete my ad
server.get('/delete-ad/:adId', function (req: any, res: any) {

    Ad.findOneAndDelete({idAd: req.params.adId}, function (err: any, docs: any) {

        if (err) res.send(err)
        console.log(`Ad id- ${req.params.adId} has delete.`)
        res.sendStatus(200)

    })
})

// add user
server.post("/add-new-user", jsonParser, function (req: any, res: any) {

    addUserToMongo(req.body.userData)
    console.log('User is added.')
    res.sendStatus(200)

})

// add ad
server.put("/add-new-ad", jsonParser, function (req: any, res: any) {

    addAdToMongo(req.body.adData)
    console.log('Ad is added.')
    res.sendStatus(200)

})

// edit ad
server.put("/edit-ad", jsonParser, async (req: any, res: any) => {

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
