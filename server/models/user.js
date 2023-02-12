import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        first_name: { type: String, required: true, alias:"firstName" },
        last_name: { type: String, required: true, alias:"lastName" },
        email: { type: String, required: true, set: (v) => v.toLowerCase() },
        password: { type: String, required: true },
        is_verified: { type: Boolean, default: 0, alias:"isVerified" },
        google_identifier: { type: String, alias:"googleIdentifier" },
        registration_date: {
            type: Date,
            default: new Date(),
        },
        global_permission: { type: Number, default: 1 , alias:"globalPermission"},
        restaurants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Restaurant",
            },
        ],
        last_active_rest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            alias:"lastActiveRest"
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
