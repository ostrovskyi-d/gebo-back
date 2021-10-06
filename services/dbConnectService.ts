import mongoose from 'mongoose'
import colors from "colors";

const {brightCyan: dbColor, red: errorColor}: any = colors;

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
        console.error(errorColor("--app: Cannot connect to db, please try to connect local db."));
    }

    mongoose.connection.on('error', err => console.error(err));
    mongoose.connection.on('connected', () => console.log('Connected'));
}

export default connectToDB;
