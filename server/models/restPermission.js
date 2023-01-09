import mongoose from "mongoose";

const restPermissionSchema = mongoose.Schema({
    permission: { type: Number, required: true },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
});

export default mongoose.model("RestPermission", restPermissionSchema);
