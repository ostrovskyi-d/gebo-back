const express = require('express');
const router = express.Router();
const {
    Ad
} = require('../models');
const {ads} = require('./common');

router.get('/get-ads', (req, res) => ads(req, res));

