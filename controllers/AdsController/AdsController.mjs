import AdModel from "../../models/AdModel.mjs";
import colors from "colors";
import User from "../../models/UserModel.mjs";
import UserModel from "../../models/UserModel.mjs";
import {getUserIdByToken} from "../../services/authService.mjs";
import config from "../../config.mjs";
import {uploadFile} from "../../services/uploadService.mjs";
import {getAllAdsHandler, getPagedAdsHandler, getAdsByCategoriesHandler, saveNewAdToDatabase} from "./AdsHandlers.mjs";
import {updateAdOwner} from "../UserController/UserHandlers.mjs";

const {
    brightCyan: dbColor,
    red: errorColor,
} = colors;

const {S3_PATH, PER_PAGE} = config;

class AdsController {

    async indexPage(req, res) {
        console.log('-- Controller method ".indexPage" called --');
        if (req.params['page'] && req.params['page'] > 0) {
            const result = await getPagedAdsHandler(req.params['page'], res);

            if (!result) {
                return res.statusCode(500).json({
                    resultCode: res.statusCode,
                    message: `Error. Can't handle ads at page №: ${req.query.page}`,
                    ads: result
                })
            } else {
                return res.json(result)
            }
        } else {
            return res.json(await getPagedAdsHandler(+req.params['page'], res))
        }
    }

    async index(req, res) {
        console.log('-- Controller method ".index" called --');

        if (!req.query['page']) {
            const result = await getAllAdsHandler(req, res);
            res.json(result);
        }
    }

    async create(req, res) {
        console.log('-- Controller method ".create" called --');

        const {file, body, headers: {authorization: auth}} = req;
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
            const adModel = AdModel;
            const result = await getAdsByCategoriesHandler(adModel, selectedCategories, selectedSubCategories);
            return res.json(result);
        }

        // Update user with ref to this ad
        const result = await updateAdOwner(ad, author);
        console.log(result.message);

        // save new ad
        const savedAd = await saveNewAdToDatabase(ad);
        return res.json(savedAd)
    }

    async read(req, res) {
        console.log('-- Controller method ".read" called --');

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
        console.log('-- Controller method ".update" called --');

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
        console.log('-- Controller method ".delete" called --');

        const {author: userId} = await getUserIdByToken(req.headers.authorization);
        const deletedAd = await AdModel.findByIdAndDelete(req.params.id).exec();
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
        console.log('-- Controller method "._clearAdsCollection" called --');

        await AdModel.deleteMany({}, (ads) => {
            res.json({
                ads,
                message: "ONLY FOR DEV ENV: All ads successfully removed from db. Also removed ads links in categories"
            })
        });
    }
}

export default AdsController;
