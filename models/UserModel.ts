import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
        name: {type: String, required: true,},
        phone: {type: String},
        avatar: {type: String},
            // @ts-ignore
            likedAds: [{type: Schema.ObjectId, ref: 'Ad'}],
        ads: [{type: Schema.Types.ObjectId, ref: 'Ad'}],
    },
    {versionKey: false},
    // @ts-ignore
    {timestamps: true},
);

// userSchema.set('toJSON', {
//     virtuals: true
// });

export default mongoose.model('User', userSchema);
