import mongoose from 'mongoose'
import colors from "colors";

const {
  brightCyan: dbColor,
  red: errorColor,
}: any = colors;

const MONGODB_URI = 'mongodb+srv://developer:JRMldyBBAv0aFQTx@cluster0.h2uu3.mongodb.net/test';

const connectToDB = async (mongodbUri = MONGODB_URI) => {
  try {
    await mongoose.connect(mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

    mongoose.connection.readyState === 1
    && console.log(dbColor("--app Database connected: " + mongodbUri))
  } catch (error) {
    console.error(errorColor("--app: connectToDB catch: " + error))
  }

  mongoose.connection.on('error', err => console.error(err));
  mongoose.connection.on('connected', () => console.log('Connected'));
}


export default connectToDB;
