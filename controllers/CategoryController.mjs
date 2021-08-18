import CategoryModel from "../models/CategoryModel.mjs";
// import colors from "colors";

// const {
//     brightCyan: dbColor,
//     red: errorColor,
// } = colors;

class CategoryController {
    async index(req, res) {
        try {
            await CategoryModel.find({}).then((cats, err) => {
                if (err) {
                    res.statusCode(409).json({
                        message: 'Error occurred during searching models in db',
                        _error: err,
                    })
                }
                res.json({
                    resultCode: res.statusCode,
                    message: 'Categories successfully found',
                    categories: cats,
                })
            })
        } catch (err) {
            throw err;
        }
    }

    async create(req, res) {
        try {
            const category = new CategoryModel(req.body);
            await category.save().then((categoryDoc, err) => {
                if (err) {
                    res.statusCode(409).json({
                        message: `Cannot create category with id: ${req.body.catId} and name: ${req.body.name}`,
                        _error: err,
                    })
                } else {
                    res.json({
                        resultCode: res.statusCode,
                        message: `Category with id: ${req.body.catId} and name: ${req.body.name} has been successfully created`
                    })
                }
            })
        } catch (err) {
            res.json({error: err})
        }
    }

    async read(req, res) {
        const {params: {catId}} = req;
        try {
            const categories = await CategoryModel.findOne({catId}).exec();
            res.json({
                category: catId,
                ads: categories['ads'],
            })
        } catch (err) {
            res.json({error: err})
        }
    }

    async update(req, res) {

    }

    async delete(req, res) {

    }

    async _clearCatsCollection(req, res) {
        await CategoryModel.deleteMany({}, (cats) => {
            res.json({
                cats,
                message: "ONLY FOR DEV ENV: All categories successfully removed from db"
            })
        })
    }
}

export default CategoryController;
