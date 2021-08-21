import config from "../config.mjs";
import User from '../models/UserModel.mjs';
import colors from "colors";
import jwt from 'jsonwebtoken';
import {getRootPath} from "../heplers/pathsHandler.mjs";
import {getUserIdByToken} from "../services/authService.mjs";
import AdModel from "../models/AdModel.mjs";
import {uploadFile} from "../services/uploadService.mjs";

const {JWT_SECRET, S3_PATH} = config;
const {brightCyan: dbColor, red: errorColor} = colors;

class UserController {
    async index(req, res) {
        await User.find({}).then((users, err) => {
            if (err) {
                console.log(errorColor(`Error, can't find users: `), err)
                res.json({
                    resultCode: res.statusCode,
                    message: err
                });
            } else {
                console.log(dbColor('Users successfully found'))
                res.json({
                    resultCode: res.statusCode,
                    message: `Users successfully found`, users
                });
            }
        })
    }

    async create(req, res) {
        const {
            body: {name, phone}, file
        } = req;

        let user;

        file && uploadFile(file);

        try {

            user = new User({
                name: name || 'Default',
                phone: phone || '000000000',
                avatar: file ? S3_PATH + file.originalname : '',
            });

            if (user) {
                const token = jwt.sign({sub: user._id}, JWT_SECRET, {expiresIn: '7d'});
                await user.save().then((user, err) => {
                    if (err) {
                        return res.json({
                            resultCode: res.statusCode,
                            message
                        })
                    }
                    res.json({
                        resultCode: res.statusCode,
                        message: `User with id ${user._id} successfully saved to DB`,
                        user,
                        token,
                    })
                    console.log(dbColor(`User with id ${user._id} successfully saved to DB`))
                })
            }
        } catch (err) {
            res.json({
                resultCode: 409,
                message: `Error: User with id ${req._id} can't be created.`
            })
            console.log(errorColor(`Error: User with id ${req._id} can't be created: `), err)
        }
    }


    async update(req, res) {
        try {
            const {body, params, headers, file} = req;
            const {likedAds, name, phone} = body;
            const {author: updatedForId} = await getUserIdByToken(headers?.authorization);

            file && uploadFile(file);
            const userId = params?.id || updatedForId;

            await User.findByIdAndUpdate(userId, {
                $set: {
                    ...body,
                    avatar: file ? S3_PATH + file.originalname : ''
                }
            });
            await User.updateOne({_id: userId}, {$set: {...body}});
            const updatedUser = await User.findById(userId).exec();

            if (likedAds) {
                res.json({likedAds: updatedUser['likedAds']})
            } else {
                res.json(updatedUser)
            }

        } catch (err) {
            console.log(errorColor(err));
        }
    }

    async delete(req, res) {
        try {
            const userId = getUserIdByToken(req.authorization.token)

            await User.remove({_id: userId}).then(async user => {
                if (user) {
                    await AdModel.deleteMany({author: {_id: userId}});
                    res.json({
                        resultCode: res.statusCode,
                        message: `User with id ${userId} successfully deleted from DB`
                    })
                    console.log(dbColor(`User with id ${userId} successfully deleted from DB`))
                } else {
                    res.json({
                        resultCode: 409, message: `Error, can\'t delete User with id ${userId} from DB`
                    })
                    console.log(errorColor(`Error, can\'t delete User with id ${userId} from DB`))
                }
            })
        } catch (err) {

            console.log(errorColor("Error: "), err)
        }
    }

    async read(req, res) {
        const getUser = async (req) => {
            console.log(req)
            if (req.params['my']) {
                return await User.findOne({_id: req.params.id}, 'likedAds')
                    .populate({
                        path: 'likedAds',
                        model: AdModel,
                        populate: {
                            path: 'author',
                            select: 'name phone'
                        }
                    })
                    .exec();
            } else {
                return await User.findOne({_id: req.params.id})
                    .populate({
                        path: 'ads',
                        model: AdModel,
                        populate: {
                            path: 'author',
                            select: 'name phone',
                        }
                    })
                    .populate('likedAds')
                    .exec();
            }
        }
        try {
            let user = await getUser(req);
            console.log(user);
            if (!user) {
                res.json({
                    resultCode: 409,
                    message: `User with id ${req.params.id} not found in DB`
                })
                console.log(errorColor(`User with id ${req.params.id} not found in DB`))
            } else {
                res.json({
                    resultCode: 201,
                    message: `User with id ${req.params.id} found successfully in DB`,
                    user
                })
                console.log(dbColor(`User with id ${req.params.id} found successfully in DB`))
            }


        } catch (err) {
            console.log(errorColor("Error: "), err)
        }
    }

    async _clearUsersCollection(req, res) {
        await User.deleteMany({}, (users) => {
            res.json({
                users,
                message: "ONLY FOR DEV ENV: All users successfully removed from db"
            })
        });
    }

    async getById(id) {
        return User.findById({_id: id});
    }
}

export default UserController;
