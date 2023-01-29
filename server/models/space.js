import mongoose from "mongoose";

const spaceSchema = mongoose.Schema({
    name: { type: String, default: "default" },
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }],
});

export default mongoose.model("Space", spaceSchema);
