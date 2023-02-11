import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, set: (v) => v.toLowerCase() },
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
        last_active_rest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            get: (v) => v.toString(),
        },
        notifications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Notification",
            },
        ],
    },
    {
        virtuals: {
            name: {
                get() {
                    return `${this.last_name} ${this.first_name}`;
                },
            },
        },
        toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
        toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
    }
);

export default mongoose.model("User", userSchema);
