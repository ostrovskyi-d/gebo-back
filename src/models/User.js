const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
        userId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: Number,
            required: true,
            unique: true,
        },
        avatar: {
            type: String,
        },
        ads: [{
            type: Schema.Types.ObjectId,
            ref: 'Ad'
        }],
    },
    {
        timestamps: true
    }
);
userSchema.set('toJSON', {
    virtuals: true
});

// const User = ;
module.exports = mongoose.model('User', userSchema);
// export default User;
