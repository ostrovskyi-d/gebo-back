import expressJwt from 'express-jwt';
import config from '../config.mjs';
import UserController from '../controllers/UserController.mjs'


const {SESSION_SECRET, AUTH} = config;
const User = new UserController();

const isRevoked = async (req, payload, done) => {
    const user = await User.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
}

const jwt = () => {
    return expressJwt({
            secret: SESSION_SECRET,
            algorithms: ['HS256'],
            isRevoked
        }
    ).unless({
        // public routes that don't require authentication
        path: AUTH.NO_AUTH_PATHS
    });
}

export default jwt;
