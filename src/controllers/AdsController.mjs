import AdModel from "../models/AdModel.mjs";
import colors from "colors";

const {
  brightCyan: dbColor,
  red: errorColor,
} = colors;

class AdsController {

  async index(req, res) {
    await AdModel.find({}).then((ads, err) => {
      if (err) {
        console.log(errorColor(`Error, can't find ads: `, err))
        res.json({
          resultCode: 409,
          message: err
        });
      } else {
        console.log(dbColor('Ads successfully found'))
        res.json({
          resultCode: 201,
          message: `Ads successfully found`,
          ads
        });
      }
    })
  }

  async create(req, res) {
    const {img, description, author, categoryId, subCategoryId} = req.params;

    const ad = new AdModel({
      img: img || '/test-path-to-img11',
      description: description || 'test ad description11',
      author: author || 'test ad author11',
      categoryId: categoryId || 'test category id11',
      subCategoryId: subCategoryId || 'test sub-category id1w1'
    });

    try {
      await ad.save().then((ad, err) => {
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
        console.log(errorColor(`Error, cannot update Ad with id ${req.params.id}: `, err))
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

}

export default AdsController;
