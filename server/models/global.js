import mongoose from "mongoose";

const globalSchema = mongoose.Schema({
    is_hide_unavailable: { type: Boolean, default: true },
    stay_time: {
        type: Number,
        default: 90,
    },
    free_time: { type: Number, default: 0 },
    basicPerm: { type: Number, default: 0 },
    
});

export default mongoose.model("Global", globalSchema);
