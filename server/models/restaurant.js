import mongoose from "mongoose";

const restaurantSchema = mongoose.Schema({
    name: { type: String, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    is_active: { type: Boolean, default: 1 },
    creation_date: {
        type: Date,
        default: new Date(),
    },
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RestPermission",
        },
    ],
    spaces: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Space",
        },
    ],
    openingTimes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "openingTime",
        },
    ],
    global: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "global",
        required: true,
    },
});

export default mongoose.model("Restaurant", restaurantSchema);
