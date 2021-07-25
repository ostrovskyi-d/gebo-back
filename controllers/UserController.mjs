import config from "../config.mjs";
import UserModel from '../models/UserModel.mjs';
import colors from "colors";
import jwt from 'jsonwebtoken';

const {SESSION_SECRET} = config;

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
          resultCode: res.statusCode,
          message: err
        });
      } else {
        console.log(dbColor('Users successfully found'))
        res.json({
          resultCode: res.statusCode,
          message: `Users successfully found`,
          users
        });
      }
    })
  }

  async create(req, res) {
    const {
      fields: {name, phone, avatar}
    } = req;

    let user;

    try {


      if (await UserModel.findOne({name})) {
        res.json({
          resultCode: 409,
          message: `Username ${name} is already taken`
        })
      } else {
        user = new UserModel({
          name: name || 'Default',
          phone: phone || '000000000',
          avatar: avatar || '/default',
        });
      }



      if (user) {
        const token = jwt.sign({ sub: user.id }, SESSION_SECRET, { expiresIn: '7d' });

        await user.save().then((user, err) => {
          res.json({
            resultCode: res.statusCode,
            message: `User with id ${user._id} successfully saved to DB`,
            user,
            token
          })
          console.log(dbColor(`User with id ${user._id} successfully saved to DB`))
        })
      }
    } catch (err) {
      console.log(errorColor(`Error: User with id ${req._id} can't be created: `, err))
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
            resultCode: res.statusCode,
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
            resultCode: res.statusCode,
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
  async _clearUsersCollection(req, res) {
    await UserModel.deleteMany({}, (users)=>{
      res.json({
        users,
        message: "ONLY FOR DEV ENV: All users successfully removed from db"
      })
    });
  }

  async getById(id) {
    return UserModel.findById({_id: id});
  }
}

export default UserController;
