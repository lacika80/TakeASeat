import mongoose from "mongoose";

const openingTimeSchema = mongoose.Schema({
    day_of_week: { type: Number },
    date: { type: Date },
    open: { type: Date },
    close: { type: Boolean },
    is_open: { type: Boolean, required: true },
});

export default mongoose.model("OpeningTime", openingTimeSchema);
