import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    is_verified: { type: Boolean, default: 0 },
    google_identifier: { type: String },
    registration_date: {
        type: Date,
        default: new Date(),
    },
    global_permission: { type: Number, default: 1 },
    restaurants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
        },
    ],
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RestPermission",
        },
    ],
});

export default mongoose.model("User", userSchema);
