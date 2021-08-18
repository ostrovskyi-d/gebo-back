// import AdModel from "../models/AdModel.mjs";

export const getAdsByCategories = async ({adModel, selectedCategories, selectedSubCategories}) => {
    const result = {};

    try {

        if (selectedCategories.length === 0 && selectedSubCategories.length === 0) {
            return {...result, ads: await adModel.find({}).exec()};
        } else if (selectedCategories.length && selectedSubCategories.length) {
            return {
                ...result, ads: await adModel.find({
                    $and: [{subCategoryId: selectedSubCategories}, {categoryId: selectedCategories}]
                }).exec()
            }
        } else if (!selectedSubCategories.length) {
            return {...result, ads: await adModel.find({categoryId: selectedCategories}).exec()};
        } else if (!selectedCategories.length) {
            return {...result, ads: await adModel.find({categoryId: selectedSubCategories}).exec()}
        }

    } catch (err) {
        console.log(err);
        return {...result, error: {message: err.message}}
    }


}
