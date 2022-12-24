import mongoose from "mongoose";

const dynamicLinkSchema = mongoose.Schema({
    type: { type: Number, required: true },
    sender_id: { type: String},
    restaurant_id: { type: String },
    receiver_id: { type: String },
    email: { type: String, required: true },
    date_of_created: {
        type: Date,
        default: new Date(),
    },
    date_of_used: { type: Date },
    date_valid_until: { type: Date, required: true },
    permission: { type: Number},
    global_permission: { type: Number},
    link: { type: String, required: true },
});

export default mongoose.model("DynamicLink", dynamicLinkSchema);
