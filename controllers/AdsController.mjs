import AdModel from "../models/AdModel.mjs";
import colors from "colors";
import User from "../models/UserModel.mjs";
import {getAdsByCategories} from "../heplers/selectCategoriesHandler.mjs";
import UserModel from "../models/UserModel.mjs";
import {getUserIdByToken} from "../services/authService.mjs";
import config from "../config.mjs";
import {uploadFile} from "../services/uploadService.mjs";

const {
    brightCyan: dbColor,
    red: errorColor,
} = colors;

const {S3_PATH} = config;

class AdsController {

    async index(req, res) {
        try {
            const ads = await AdModel.find({})
                .sort('-createdAt')
                .populate({
                    path: 'author',
                    select: '-likedAds'
                });
            if (ads.length) {
                console.log(dbColor('Ads successfully found'))
                res.json({
                    resultCode: res.statusCode,
                    message: `Ads successfully found`,
                    ads
                });
            } else {
                console.log(errorColor(`Error, can't find ads`))
                res.json({
                    resultCode: res.statusCode,
                    message: 'There is no ads in database',
                    ads: ads
                });
            }
        } catch (err) {
            console.log(errorColor(`Error, can't find ads: `), err)
            res.json({
                resultCode: res.statusCode,
                message: err || 'Server error, try again later or call server support'
            });
        }

    }

    async create(req, res) {
        const {file, body, headers: {authorization: auth}} = req;
        console.log(req.body)
        const {name, description, categoryId, subCategoryId, selectedCategories, selectedSubCategories} = body;
        const {author} = await getUserIdByToken(auth);
        file && await uploadFile(file);
        // Create Ad
        const ad = new AdModel({
            name: name || 'Оголошення',
            img: file ? S3_PATH + file.originalname : '',
            description: description || 'test ad description11',
            author: author,
            categoryId: categoryId || '1',
            subCategoryId: subCategoryId || '1'
        });


        // Return ads
        // return ads that matches selected categories
        if (selectedCategories && selectedSubCategories) {
            try {
                const adModel = AdModel;
                const result = await getAdsByCategories({
                    adModel, selectedCategories, selectedSubCategories
                });

                if (!result) {
                    return res.json({
                        resultCode: res.statusCode,
                        message: `Server error, can't find ads by following ids:`,
                        selectedCategories,
                        selectedSubCategories,
                    });
                }

                return res.json(result);
            } catch (err) {
                console.log(errorColor(err))
                return res.json({
                    resultCode: res.statusCode,
                    message: err.message
                });
            }
        }

        // Update user with ref to this ad
        try {
            const user = await User.findOneAndUpdate(
                {_id: author},
                {"$addToSet": {ads: ad}}
            );

            if (!user) {
                return res.json({
                    resultCode: res.statusCode,
                    message: `Requested author doesn\'t exist {_id: ${author}}... You shall not pass!`
                })
            }
        } catch (err) {
            res.json({
                resultCode: res.statusCode,
                message: "Server error... Please, try again later"
            })
        }

        // save new ad
        try {
            await ad.save().then(async (ad, err) => {
                if (err) {
                    res.json({
                        resultCode: res.statusCode,
                        message: "Error: " + err.message,
                        error: err
                    })
                    return;
                }
                res.json({
                    resultCode: res.statusCode,
                    message: `Ad with id ${ad._id} successfully saved to DB`,
                    ad
                })
                console.log(dbColor(`Ad with id ${ad._id} successfully saved to DB`))
            })
        } catch (err) {
            res.json({
                resultCode: res.statusCode,
                message: "Error: " + err.message,
                error: err
            })
            console.log(errorColor(err))
        }
    }

    async read(req, res) {
        await AdModel.findOne({_id: req.params.id}).populate({
            path: 'author',
            select: '-likedAds'
        }).then(ad => {
            if (!ad) {
                res.json({
                    resultCode: res.statusCode,
                    message: `Ad with id ${req.params.id} not found in DB`,
                })
                console.log(errorColor(`Ad with id ${req.params.id} not found in DB`))
            } else {
                res.json({
                    resultCode: res.statusCode,
                    message: `Ad with id ${req.params.id} found successfully in DB`,
                    ad
                })
                console.log(dbColor(`Ad with id ${req.params.id} found successfully in DB`))
            }
        })
    }

    async update(req, res) {
        let file;
        if (req.file) {
            file = await uploadFile(req.file);
        }
        await AdModel.findOneAndUpdate(req.params.id, {
            $set: {
                ...req.body,
                img: file ? S3_PATH + file.originalname : ''
            }
        }, err => {
            if (err) {
                res.json({
                    resultCode: res.statusCode,
                    message: err
                })
                console.log(errorColor(`Error, cannot update Ad with id ${req.params.id}: `), err)
            } else {
                res.json({
                    resultCode: res.statusCode,
                    message: `Ad with id ${req.params.id} is successfully updated`
                })
                console.log(dbColor(`Ad with id ${req.params.id} is successfully updated`, req.body))
            }
        })
    }

    async delete(req, res) {
        const {author: userId} = await getUserIdByToken(req.headers.authorization);

        await AdModel.findByIdAndDelete(req.params.id).exec();
        await UserModel.updateMany({}, {$pull: {likedAds: req.params.id, ads: req.params.id}});

        const userAds = await UserModel.findById(userId, {ads: '$ads'}).populate('ads');

        if (userAds) {
            res.json({
                resultCode: 201,
                message: `Ad with id ${req.params.id} successfully deleted from DB`,
                ads: userAds
            })
            console.log(dbColor(`Ad with id ${req.params.id} successfully deleted from DB`))
        } else {
            res.json({
                resultCode: 409,
                message: `Error, can\'t delete Ad with id ${req.params.id} from DB`
            })
            console.log(errorColor(`Error, can\'t delete Ad with id ${req.params.id} from DB`))
        }

    }

    async _clearAdsCollection(req, res) {
        await AdModel.deleteMany({}, (ads) => {
            res.json({
                ads,
                message: "ONLY FOR DEV ENV: All ads successfully removed from db. Also removed ads links in categories"
            })
        });
    }
}

export default AdsController;
