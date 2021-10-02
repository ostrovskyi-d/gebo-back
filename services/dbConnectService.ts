import mongoose from 'mongoose'
import colors from "colors";
import config from "../config";

const {brightCyan: dbColor, red: errorColor}: any = colors;
const {LOCAL_DEV_MONGO_URI} = config.mongo;

const connectToDB = async (mongoURI: any = LOCAL_DEV_MONGO_URI) => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        if (mongoose.connection.readyState === 1) {
            console.log(dbColor("--app Database connected: " + mongoURI))
        } else {
            await connectToDB();
        }
    } catch (error) {
        console.error(errorColor("--app: connectToDB catch: " + error));
        console.error(errorColor("--app: Trying to change mongodb to local..."));
        await connectToDB();
    }

    mongoose.connection.on('error', err => console.error(err));
    mongoose.connection.on('connected', () => console.log('Connected'));
}

export default connectToDB;
