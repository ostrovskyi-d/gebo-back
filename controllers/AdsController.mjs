import AdModel from "../models/AdModel.mjs";
import colors from "colors";
import User from "../models/UserModel.mjs";

const {
    brightCyan: dbColor,
    red: errorColor,
} = colors;

class AdsController {

    async index(req, res) {
        try {
            const ads = await AdModel.find({})
            // .populate('author');
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
                    resultCode: 404,
                    message: 'There is no ads in database',
                    ads: ads
                });
            }
        } catch (err) {
            console.log(errorColor(`Error, can't find ads: `), err)
            res.json({
                resultCode: 409,
                message: err || 'Server error, try again later or call server support'
            });
        }

    }

    async create(req, res) {
        const {description, author, categoryId, subCategoryId} = req.body;

        const ad = new AdModel({
            img: req.file ? req.file.path : '/test-path-to-img11',
            description: description || 'test ad description11',
            author: author,
            categoryId: categoryId || 'test category id11',
            subCategoryId: subCategoryId || 'test sub-category id1w1'
        });

        try {
            const user = await User.findOneAndUpdate(
                {_id: author},
                {"$push": {ads: ad}}
            );

            if (!user) {
                return res.json({
                    resultCode: 404,
                    message: `Requested author doesn\'t exist {_id: ${author}}... You shall not pass!`
                })
            }
        } catch (err) {
            res.json({
                resultCode: 409,
                message: "Server error... Please, try again later"
            })
        }


        try {
            await ad.save().then(async (ad, err) => {
                if (err) {
                    res.statusCode(409).json({
                        resultCode: 409,
                        message: "Error: " + err.message,
                        error: err
                    })
                    return;
                }
                res.json({
                    resultCode: 201,
                    message: `Ad with id ${ad._id} successfully saved to DB`
                })
                console.log(dbColor(`Ad with id ${ad._id} successfully saved to DB`))
            })
        } catch (err) {
            res.json({
                resultCode: 409,
                message: "Error: " + err.message,
                error: err
            })
            console.log(errorColor(err))
        }
    }

    async read(req, res) {
        AdModel.findOne({_id: req.params.id}).then(ad => {
            if (!ad) {
                res.json({
                    resultCode: 409,
                    message: `Ad with id ${req.params.id} not found in DB`
                })
                console.log(errorColor(`Ad with id ${req.params.id} not found in DB`))
            } else {
                res.json({
                    resultCode: 201,
                    message: `Ad with id ${req.params.id} found successfully in DB`
                })
                console.log(dbColor(`Ad with id ${req.params.id} found successfully in DB`))
            }
        })
    }

    async update(req, res) {
        await AdModel.findOneAndUpdate(req.params.id, {$set: req.body}, err => {
            if (err) {
                res.json({
                    resultCode: 409,
                    message: err
                })
                console.log(errorColor(`Error, cannot update Ad with id ${req.params.id}: `), err)
            } else {
                res.json({
                    resultCode: 201,
                    message: `Ad with id ${req.params.id} is successfully updated`
                })
                console.log(dbColor(`Ad with id ${req.params.id} is successfully updated`, req.body))
            }
        })
    }

    async delete(req, res) {
        await AdModel.remove({_id: req.params.id}).then(ad => {
            if (ad) {
                res.json({
                    resultCode: 201,
                    message: `Ad with id ${req.params.id} successfully deleted from DB`
                })
                console.log(dbColor(`Ad with id ${req.params.id} successfully deleted from DB`))
            } else {
                res.json({
                    resultCode: 409,
                    message: `Error, can\'t delete Ad with id ${req.params.id} from DB`
                })
                console.log(errorColor(`Error, can\'t delete Ad with id ${req.params.id} from DB`))
            }
        })
    }

    async _clearAdsCollection(req, res) {
        await AdModel.deleteMany({}, (ads) => {
            res.json({
                ads,
                message: "ONLY FOR DEV ENV: All ads successfully removed from db"
            })
        });
    }
}

export default AdsController;
