import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const adSchema = new Schema({

        img: {
            type: String,
        },
        // title: {
        //     type: String,

        //     required: true
        // },
        description: {
            type: String,
        },
        author: {
            type: String,
            // type: Schema.Types.ObjectId,
            // ref: 'UserModel',
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


export default mongoose.model('Ad', adSchema);
