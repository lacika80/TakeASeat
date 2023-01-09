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
        ref: "RestPermission"
      }
    ]
});

export default mongoose.model("Restaurant", restaurantSchema);
