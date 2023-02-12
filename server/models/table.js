import mongoose from "mongoose";

const tableSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        posx: { type: Number, required: true },
        posy: { type: Number, required: true },
        is_active: { type: Boolean, default: true, alias: "isActive" },
        seats: {type: Number, default: 0},
        tableOpts: [String],
    },
    {
        toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
        toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
    }
);

export default mongoose.model("Table", tableSchema);
