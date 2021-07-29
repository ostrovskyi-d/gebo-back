import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        phone: {type: String},
        avatar: {
            type: String,
            default: ''
        },
        ads: [{type: Schema.Types.ObjectId, ref: 'Ad'}],
    },
    {versionKey: false},
    {timestamps: true},
);

// userSchema.set('toJSON', {
//     virtuals: true
// });

export default mongoose.model('User', userSchema);
