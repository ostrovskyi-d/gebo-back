import mongoose from 'mongoose';

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
        date: { type: Date, default: Date.now },
    },
    {versionKey: false},
    {
        timestamps: {
            created_at: new Date().toDateString()
        }
    },
)

export default mongoose.model('Ad', adSchema);
