import AdModel from "../../models/AdModel";
import colors from "colors";
import UserModel from "../../models/UserModel";
import {getUserIdByToken} from "../../services/authService";
import config from "../../config";
import {uploadFile} from "../../services/uploadService";
import {getPagedAdsHandler, getAdsByCategoriesHandler, saveNewAdToDatabase} from "./AdsHandlers";
import {updateAdOwner} from "../UserController/UserHandlers";
import {Request, Response} from 'express';

const {
    brightCyan: dbColor,
    red: errorColor,
}: any = colors;

const {S3_PATH} = config.s3;

class AdsController {

    async index(req: Request, res: Response) {
        console.log('-- AdsController method ".index" called --');
        console.log('query: ', req?.query);
        console.log('params: ', req?.params);

        if (!req.query['page']) {
            const result = await getPagedAdsHandler(1, res);
            res.json(result);
        } else {
            const result = await getPagedAdsHandler(+req.query['page'], res);

            if (!result) {
                return res.status(500).json({
                    message: `Error. Can't handle ads at page №: ${+req.query['page']}`,
                    ads: result
                })
            } else {
                return res.json(result)
            }
        }
    }

    async create(req: Request, res: Response) {
        console.log('-- AdsController method ".create" called --');

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

    async read(req: Request, res: Response) {
        console.log('-- AdsController method ".read" called --');

        await AdModel.findOne({_id: req.params.id}).populate({
            path: 'author',
            select: '-likedAds'
        }).then((ad: any) => {
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

    async update(req: Request, res: Response) {
        console.log('-- AdsController method ".update" called --');
        const {params} = req || {};
        const paramsId = params.id;
        let file;
        if (req.file) {
            file = await uploadFile(req.file);
        }
        await AdModel.findByIdAndUpdate(paramsId, {
            $set: {
                ...req.body,
                img: file ? S3_PATH + file.originalname : ''
            }
        }, (err: any) => {
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

    async delete(req: Request, res: Response) {
        console.log('-- AdsController method ".delete" called --');

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

    async _clearAdsCollection(req: Request, res: Response) {
        console.log('-- AdsController method "._clearAdsCollection" called --');

        await AdModel.deleteMany({}, (ads: any) => {
            res.json({
                ads,
                message: "ONLY FOR DEV ENV: All ads successfully removed from db. Also removed ads links in categories"
            })
        });
    }
}

export default AdsController;
