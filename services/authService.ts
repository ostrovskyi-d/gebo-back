// @ts-ignore
import expressJwt from 'express-jwt';
import config from '../config';
import UserController from '../controllers/UserController/UserController'
// @ts-ignore
import jsonWebToken from "jsonwebtoken";

const {JWT_SECRET, AUTH} = config;
const User = new UserController();

const isRevoked = async (req: any, payload: any, done: any) => {
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

export const getUserIdByToken = async (token: String) => {
    if (token) {
        const parsedToken = token.toString().includes('Bearer') ? token.split('Bearer ')[1] : token;
        const {sub: author} = await jsonWebToken.verify(parsedToken, JWT_SECRET);
        return {author};
    } else {
        return undefined;
    }
}

export default jwt;
