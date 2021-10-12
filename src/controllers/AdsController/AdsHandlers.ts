import AdModel from "../../models/AdModel";
import config from '../../config';
import colors from "colors";

const {PER_PAGE}: any = config;

const {
    brightCyan: dbColor,
    red: errorColor,
}: any = colors;


const getPagedAdsHandler = async (pageQuery: any = 1) => {
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
        // @ts-ignore
            message: err.message || 'Unknown error',
        }
    }
}


const saveNewAdToDatabase = async (ad: any) => {
    try {
        await ad.save().then(async (ad: any, err: any) => {
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
        // @ts-ignore
            message: "Error: " + err.message,
        }
    }
}

export {
    getPagedAdsHandler,
    saveNewAdToDatabase,
}
