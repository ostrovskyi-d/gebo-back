const express = require('express');
const router = express.Router();
const controller = require('../controllers/AdsController');

router.get('/login', controller.login);
router.post('/register', controller.register);
