// routes root
const auth = require('./auth.mjs');
const post = require('./ad');
const archive = require('./archive');
const user = require('./user.mjs');

module.exports = {
    auth,
    post,
    archive,
    user,
};
