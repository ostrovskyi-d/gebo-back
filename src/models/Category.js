const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catSchema = new Schema({
        catId: {
            type: String,
            unique: true
        },
        catName: {
            type: String,
            unique: true
        }
    },
    {
        timestamps: {
            created_at: new Date().toDateString()
        }
    }
)

catSchema.set('toJSON', {
    virtuals: true
});

// const Ad = ;

module.exports = mongoose.model('Category', catSchema);
// export default Ad;
