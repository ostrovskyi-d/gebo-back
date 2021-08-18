import mongoose from 'mongoose';
import moment from "moment";

const getLocalizedDate = () => moment().locale('uk');

const Schema = mongoose.Schema;

const adSchema = new Schema({
        img: {type: String, default: ''},
        name: {type: String},
        description: {type: String},
        author: {type: Schema.Types.ObjectId, ref: 'User',},
        categoryId: {
            type: String,
            // type: Schema.Types.ObjectId,
            // ref: 'Category'
        },
        subCategoryId: {
            type: String,
            // type: Schema.Types.ObjectId,
            // ref: 'SubCategory'
        },
        date: {type: String, default: getLocalizedDate().format('DD MMMM, HH:mm')},
    },
    {versionKey: false},
    {
        timestamps: {
            created_at: new Date().toDateString()
        }
    },
)

export default mongoose.model('Ad', adSchema);
