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
        const adsTotalPromise = await AdModel.count({});
        const adsTotal = await adsTotalPromise;
        const totalPages = Math.ceil(adsTotal / perPage);
        console.warn(pageQuery);
        console.warn(perPage * reqPage - perPage);
        const pagedAds = await AdModel.find({})
            .skip(perPage * reqPage - perPage)
            .limit(+perPage)
            .populate({path: 'author', select: '-likedAds'})
            .sort({createdAt: -1})
            .exec();

        if (!pagedAds || !pagedAds.length) return pagedAds;

        return {
            message: `Ads successfully found`,
            ads: pagedAds,
            adsTotal,
            totalPages,
            perPage,
            currentPage: reqPage
        };

    } catch (err: any) {
        console.log(errorColor(err));
        return {
            message: err.message || 'Unknown error',
        }
    }
}


const saveNewAdToDatabase = async (ad: any) => {
    try {
        const savedAd: any = await ad.save();
        if (savedAd) {
            console.log(dbColor(`Ad with id ${ad._id} successfully saved to DB`))
            return {
                message: `Ad with id ${ad._id} successfully saved to DB`,
                ad
            }
        }
    } catch (err: any) {
        console.log(errorColor(err))
        return {
            message: "Error: " + err.message,
        }
    }
}

export {
    getPagedAdsHandler,
    saveNewAdToDatabase,
}
