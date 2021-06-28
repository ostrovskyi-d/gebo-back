import UserModel from '../models/UserModel.mjs';
import colors from "colors";

const {
  brightCyan: dbColor,
  red: errorColor,
} = colors;

class UserController {

  async index(req, res) {
    await UserModel.find({}).then((users, err) => {
      if (err) {
        console.log(errorColor(`Error, can't find users: `, err))
        res.json({
          resultCode: 409,
          message: err
        });
      } else {
        console.log(dbColor('Users successfully found'))
        res.json({
          resultCode: 201,
          message: `Users successfully found`,
          users
        });
      }
    })
  }

  async create(req, res) {

    const user = new UserModel({
      name: req.fields.name || 'Default',
      phone: req.fields.name || '000000000',
      avatar: req.fields.avatar || '/default',
    });

    try {
      await user.save().then((user, err) => {
        res.json({
          resultCode: res.statusCode,
          message: `User with id ${user._id} successfully saved to DB`,
          user
        })
        console.log(dbColor(`User with id ${user._id} successfully saved to DB`))
      })
    } catch (err) {
      console.log(errorColor(`Error: User with id ${user._id} can't be created: `, err))
    }
  }

  async update(req, res) {
    const userId = req.params.id;

    try {
      await UserModel.findOneAndUpdate(userId, {$set: req.body}, err => {
        if (err) {
          res.json({
            resultCode: 409,
            message: `Error: User with id ${userId} can't be updated: `
          })
          console.log(errorColor(`Error: User with id ${userId} can't be updated: `, err))
        } else {
          res.json({
            resultCode: 201,
            message: `User with id ${req.params.id} is successfully updated`
          })
          console.log(dbColor(`User with id ${req.params.id} is successfully updated`))
        }
      })
    } catch (err) {
      console.log(errorColor(err));
    }
  }

  async delete(req, res) {
    try {
      await UserModel.remove({_id: req.params.id}).then(user => {
        if (user) {
          res.json({
            resultCode: 201,
            message: `User with id ${req.params.id} successfully deleted from DB`
          })
          console.log(dbColor(`User with id ${req.params.id} successfully deleted from DB`))
        } else {
          res.json({
            resultCode: 409,
            message: `Error, can\'t delete User with id ${req.params.id} from DB`
          })
          console.log(errorColor(`Error, can\'t delete User with id ${req.params.id} from DB`))
        }
      })
    } catch (err) {
      console.log(errorColor("Error: ", err))
    }
  }

  async read(req, res) {
    try {
      await UserModel.findOne({_id: req.params.id}).then(user => {
        if (!user) {
          res.json({
            resultCode: 409,
            message: `User with id ${req.params.id} not found in DB`
          })
          console.log(errorColor(`User with id ${req.params.id} not found in DB`))
        } else {
          res.json({
            resultCode: 201,
            message: `User with id ${req.params.id} found successfully in DB`,
            user: user
          })
          console.log(dbColor(`User with id ${req.params.id} found successfully in DB`))
        }
      })
    } catch (err) {
      console.log(errorColor("Error: ", err))
    }
  }

}

export default UserController;
