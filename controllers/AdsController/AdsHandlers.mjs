import AdModel from "../../models/AdModel.mjs";
import config from '../../config.mjs';
import colors from "colors";

const {PER_PAGE} = config;

const {
    brightCyan: dbColor,
    red: errorColor,
} = colors;

const selectCategoriesHandler = async ({adModel, selectedCategories, selectedSubCategories}) => {
    const result = {};

    try {
        // todo: review this bidlocode
        if (selectedCategories.length === 0 && selectedSubCategories.length === 0) {
            return {
                ...result,
                ads: await adModel
                    .find({})
                    .sort('-createdAt')
                    .exec()
            }
        } else if (selectedCategories.length && selectedSubCategories.length) {
            return {
                ...result,
                ads: await adModel
                    .find({
                        $and: [{subCategoryId: selectedSubCategories}, {categoryId: selectedCategories}]
                    })
                    .sort('-createdAt')
                    .exec()
            }
        } else if (!selectedSubCategories.length) {
            return {
                ...result,
                ads: await adModel
                    .find({categoryId: selectedCategories})
                    .sort('-createdAt')
                    .exec()
            }
        } else if (!selectedCategories.length) {
            return {
                ...result,
                ads: await adModel
                    .find({categoryId: selectedSubCategories})
                    .sort('-createdAt')
                    .exec()
            }
        }
    } catch (err) {
        console.log(err);
        return {...result, error: {message: err.message}}
    }
}


const getAllAdsHandler = async (req, res) => {
    try {
        const ads = await AdModel.find({})
            .sort('-createdAt')
            .populate({
                path: 'author',
                select: '-likedAds'
            });

        if (ads.length) {
            console.log(dbColor('Ads successfully found'))

            return {
                resultCode: res.statusCode,
                message: `Ads successfully found`,
                ads
            };
        } else {
            console.log(errorColor(`Error, can't find ads`))
            return {
                resultCode: res.statusCode,
                message: 'There is no ads in database',
                ads: ads
            };
        }
    } catch (err) {
        console.log(errorColor(`Error, can't find ads: `), err)
        return {
            resultCode: res.statusCode,
            message: err.message || 'Server error, try again later or call server support'
        };
    }
}

const getPagedAdsHandler = async (pageQuery ) => {
    try {
        const perPage = +PER_PAGE;
        const reqPage = pageQuery || 1;
        const adsTotalPromise = await AdModel.countDocuments();
        const adsTotal = await adsTotalPromise;
        const totalPages = Math.ceil(adsTotal / perPage);

        const pagedAds = await AdModel.find({})
            .skip(perPage * reqPage - perPage)
            .limit(+perPage)
            .populate({path: 'author', select: '-likedAds'})
            .sort({createdAt: -1})
            .exec();
        console.log(pagedAds);
        if (!pagedAds) return pagedAds;

        return {
            message: `Ads successfully found`,
            ads: pagedAds,
            adsTotal,
            totalPages,
            perPage,
            currentPage: reqPage
        };

    } catch (err) {
        console.log(errorColor(err));
        return {
            message: err.message || 'Unknown error',
        }
    }
}

const getAdsByCategoriesHandler = async (adModel, selectedCategories, selectedSubCategories) => {
    try {
        const result = await selectCategoriesHandler({
            adModel, selectedCategories, selectedSubCategories
        });

        if (!result) {
            return {
                message: `Server error, can't find ads by following ids:`,
                selectedCategories,
                selectedSubCategories,
            };
        }

        return result;
    } catch (err) {
        console.log(errorColor(err))
        return {
            message: err.message
        };
    }
}

const saveNewAdToDatabase = async (ad) => {
    try {
        await ad.save().then(async (ad, err) => {
            if (err) {
                return {
                    message: "Error: " + err.message,
                    error: err
                }
            }

            console.log(dbColor(`Ad with id ${ad._id} successfully saved to DB`))
            return {
                message: `Ad with id ${ad._id} successfully saved to DB`,
                ad
            }
        })
    } catch (err) {
        console.log(errorColor(err))
        return {
            message: "Error: " + err.message,
        }
    }
}

export {
    getAdsByCategoriesHandler,
    getAllAdsHandler,
    getPagedAdsHandler,
    saveNewAdToDatabase,
}
