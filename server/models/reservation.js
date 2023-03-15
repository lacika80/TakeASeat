import mongoose from "mongoose";
const reservationSchema = mongoose.Schema(
    {
        name: String,
        phone: String,
        email: String,
        arrive: Date,
        leave: Date,
        adult: Number,
        child: { type: Number, default: 0 },
        comment: String,
        tableIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Table",
            },
        ],
        tableReqs: [String],
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        updater: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        came: { type: Boolean, default: "false" },
    },
    { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
