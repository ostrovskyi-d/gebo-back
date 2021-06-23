const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adSchema = new Schema({

        adId: {
            unique: true,
            type: String
        },
        img: {
            type: String,
        },
        // title: {
        //     type: String,

        //     required: true
        // },
        description: {
            type: String,
            required: true
        },
        author: {
            type: Schema?.Types?.ObjectId,
            ref: 'User',
        },
        categoryId: {
            type: String
        },
        subCategoryId: {
            type: String
        }
    },
    {
        timestamps: {
            created_at: new Date().toDateString()
        }
    }
)

adSchema.set('toJSON', {
    virtuals: true
});

// const Ad = ;

module.exports = mongoose.model('Ad', adSchema);
// export default Ad;
