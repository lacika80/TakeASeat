import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    date: {
        type: Date,
        default: new Date(),
    },
    seen: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        required: true,
    },
    acceptable: {
        type: Boolean,
        default: false,
    },
    is_accepted: {
        type: Boolean
    },
    accept:{
        type: String,
    },
    decline:{
        type: String,
    },
});

export default mongoose.model("Notification", notificationSchema);
