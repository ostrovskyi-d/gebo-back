import mongoose, {Schema} from "mongoose";

const conversationSchema = new Schema({
    conversationId: {type: String},
    sender: {type: String},
    text: {type: String}
}, {timestamps: true});

export default mongoose.model("Conversation", conversationSchema);
