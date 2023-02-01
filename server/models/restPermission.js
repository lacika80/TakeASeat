import mongoose from "mongoose";
import mongooseLong from "mongoose-long";
mongooseLong(mongoose);
const {
    Types: { Long },
} = mongoose;

const restPermissionSchema = mongoose.Schema({
    permission: { type: Long, required: true },
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
