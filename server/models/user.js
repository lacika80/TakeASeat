import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    is_verified: { type: Boolean, default: 0 },
    google_identifier: { type: String },
    is_active: { type: Boolean, default: 1 },
    registration_date: {
        type: Date,
        default: new Date(),
    },
    global_permission: { type: Number, default: 0 },
});

export default mongoose.model("User", userSchema);
