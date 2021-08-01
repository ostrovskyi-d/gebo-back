import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const catSchema = new Schema({
        name: String,
        slug: {
            type: String,
            index: true
        },
        catId: {
            type: String,
            unique: true,
        },
        ads: [{type: Schema.Types.ObjectId, ref: 'Ad'}],
    },
    {versionKey: false},
)

// catSchema.set('toJSON', {
//     virtuals: true
// });

export default mongoose.model('Category', catSchema);
