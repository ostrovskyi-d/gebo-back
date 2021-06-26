const {
    Ad
} = require('../models');
const config = require('../config');


const notAuthorised = (id, login, res, callback) => {
    if (!id && !login) {
        res.json({
            resultCode: 102,
            reason: "Not authorised, you must log in or register"
        })
    } else {
        callback()
    }

};

const ads = async (req, res) => {
    const {
        userId,
        userLogin
    } = req.session;

    const perPage = +config.PER_PAGE;
    const reqPage = Number(req.params.page) || Number(req.path.split('/')[2]);
    // console.log(`RECEIVED URI-PARAMS:::►`, req.params);
    try {
        // Created promises-variables for parallel operations
        const postsPromise = Ad.find({})
            .skip(perPage * reqPage - perPage)
            .limit(perPage)
            .populate('author')
            .sort({
                createdAt: -1
            });
        const countPromise = Ad.count(undefined, undefined);
        const posts = await postsPromise;
        const count = await countPromise;
        const totalPages = Math.ceil(count / perPage);
        // console.log(posts[0].author)
        // if (userId && userLogin) {
        res.json({
            resultCode: 101,
            message: 'Authorised',
            ads: posts,
            perPage: perPage,
            totalPostsCount: count,
            currentPage: reqPage,
            totalPages: totalPages,
            user: {
                id: userId,
                login: userLogin
            },
        })
        // } else {
        //     res.json({
        //         resultCode: 102,
        //         message: 'Not authorised',
        //         posts: posts,
        //         perPage: perPage,
        //         totalPostsCount: count,
        //         currentPage: reqPage,
        //         totalPages: totalPages,
        //     })
        // }

    } catch (error) {
        console.error(`Server Error: `, error)
    }
};
module.exports = {notAuthorised, ads};
