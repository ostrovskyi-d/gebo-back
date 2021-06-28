const express = require('express');
const router = express.Router();
const {
  User
} = require('../models/index.mjs');
// const {ads} = require('./common');

router.post('/add-new-user', async (req, res, next) => {
  const name = req.body['name'],
      avatar = req.body['avatar'],
      phone = req.body['phone'];

  if (!name || !phone) {
    res.json({
      resultCode: 400,
      type: 'error',
      message: "All fields must be filled",
    });
  } else if (name.length < 3) {
    res.json({
      resultCode: 400,
      type: 'error',
      message: 'Login too short <br>(min symbols - 3, max symbols - 16)',
    })

  } else if (name.length > 30) {
    res.json({
      resultCode: 400,
      type: 'error',
      message: 'Login too long <br>(min symbols - 3, max symbols - 16)',
    })
  } else {
    let user = await User.findOne({phone});
    if (!user) {
      try {
        let user = await db.User.create({name, avatar, phone,});
        // req.session.userId = user.id;
        // req.session.userLogin = user.login;
        res.json({
          resultCode: 101,
          message: "User created",
          userId: user.id,
          userLogin: user.login,
        });
        // res.redirect('/');
      } catch (err) {
        res.json({
          resultCode: 102,
          message: "Error, try later",
        })
      }

    } else {
      console.log("REJECT USER CREATING: USER EXISTS");
      res.json({
        resultCode: 102,
        message: "User already exist",
      })
    }
  }
});


