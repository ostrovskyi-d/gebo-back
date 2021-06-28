const express = require('express');
const router = express.Router();
const {
    Ad
} = require('../models/index.mjs');
const {ads} = require('./common.mjs');

router.get('/get-ads', (req, res) => ads(req, res));

