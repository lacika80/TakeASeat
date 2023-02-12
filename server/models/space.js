import mongoose from "mongoose";

const spaceSchema = mongoose.Schema({
    name: String,
    tables: [
        {
            name: { type: String, required: true },
            posx: { type: Number, required: true },
            posy: { type: Number, required: true },
            tableOpts: [String],
        },
    ],
});

export default mongoose.model("Space", spaceSchema);
