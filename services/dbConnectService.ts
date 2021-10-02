import mongoose from 'mongoose'
import colors from "colors";
import config from "../config";

const {brightCyan: dbColor, red: errorColor}: any = colors;
const {LOCAL_DEV_MONGO_URI} = config.mongo;

const connectToDB = async (mongoURI) => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        if (mongoose.connection.readyState === 1) {
            console.log(dbColor("--app Database connected: " + mongoURI))
        }
    } catch (error) {
        console.error(errorColor("--app MongoURI: ", mongoURI));
        console.error(errorColor("--app: connectToDB catch: " + error));
        console.error(errorColor("--app: Trying to change mongodb to local..."));
        await connectToDB(LOCAL_DEV_MONGO_URI);
    }

    mongoose.connection.on('error', err => console.error(err));
    mongoose.connection.on('connected', () => console.log('Connected'));
}

export default connectToDB;
