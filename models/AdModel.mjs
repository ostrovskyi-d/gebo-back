import mongoose from 'mongoose';
import moment from "moment";

const locale = () => moment().locale('uk');

const Schema = mongoose.Schema;

const adSchema = new Schema({
        img: {
            type: String,
            default: ''
        },
        name: {type: String},
        description: {type: String},
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        categoryId: {type: String},
        subCategoryId: {type: String},
        date: { type: String, default: locale().format('MMMM Do YYYY, h:mm:ss a') },
    },
    {versionKey: false},
    {
        timestamps: {
            created_at: new Date().toDateString()
        }
    },
)

export default mongoose.model('Ad', adSchema);
