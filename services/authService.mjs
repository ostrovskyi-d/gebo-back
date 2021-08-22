import expressJwt from 'express-jwt';
import config from '../config.mjs';
import UserController from '../controllers/UserController/UserController.mjs'
import jsonWebToken from "jsonwebtoken";

const {JWT_SECRET, AUTH} = config;
const User = new UserController();

const isRevoked = async (req, payload, done) => {
    const user = await User.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};

const jwt = () => {
    return expressJwt({
            secret: JWT_SECRET,
            algorithms: ['HS256'],
            isRevoked
        }
    ).unless({
        // public routes that don't require authentication
        path: AUTH.NO_AUTH_PATHS
    });
};

export const getUserIdByToken = async (token) => {
    if (token) {
        const parsedToken = token.toString().includes('Bearer') ? token.split('Bearer ')[1] : token;
        const {sub: author} = await jsonWebToken.verify(parsedToken, JWT_SECRET);
        console.log(author)
        return {author};
    }
}

export default jwt;
