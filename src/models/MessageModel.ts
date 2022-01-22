import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema({
    content: {
        type: String,
        // required: true
    },
    userName: {
        type: String,
        // required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        // required: true
    }
}, {timestamps: true});

export default mongoose.model("Message", messageSchema);