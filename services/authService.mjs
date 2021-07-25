import expressJwt from 'express-jwt';
import config from '../config.mjs';
import UserController from '../controllers/userController.mjs'


const {SESSION_SECRET} = config;
const User = new UserController();

const jwt = () => {
    const secret = SESSION_SECRET;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/add-new-user',
            '/clear-users',
            '/ads',
            '/users'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await User.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
}

export default jwt;
