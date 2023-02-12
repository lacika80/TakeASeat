import mongoose from "mongoose";

const spaceSchema = mongoose.Schema(
    {
        name: String,
        tables: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Table",
            },
        ],
    },
    {
        toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
        toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
    }
);

export default mongoose.model("Space", spaceSchema);
