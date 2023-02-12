import mongoose from "mongoose";
/* active: {
        tables: [
            {
                id: 1121,
                name: "beltér",
                tables: [
                    [
                        { id: 1, name: "asztal 1/1", posx: 1, posy: 1, seats: 6, space: 1121 },
                        { id: 2, name: "asztal 1/2", posx: 1, posy: 2, seats: 3, space: 1121 },
                        { id: 3, name: "asztal 1/3", posx: 1, posy: 3, seats: 4, space: 1121 },
                    ],
                    [
                        { id: 4, name: "asztal 2/1", posx: 2, posy: 1, seats: 2, space: 1121 },
                        { id: 5, name: "asztal 2/2", posx: 2, posy: 2, seats: 1, space: 1121 },
                    ],
                    [{ id: 6, name: "asztal 3/1", posx: 3, posy: 1, seats: 1, space: 1121 }],
                ],
            },
        ],
        tableOpts: ["kint", "bent", "ablaknál", "dohányzó", "nem dohányzó"],
    }, */
const restaurantSchema = mongoose.Schema(
    {
        spaces: [
            {
                name: String,
                tables: [
                    {
                        _id: { type: mongoose.ObjectId, default: new mongoose.Types.ObjectId() },
                        name: { type: String, required: true },
                        posx: { type: Number, required: true },
                        posy: { type: Number, required: true },
                        tableOpts: [String],
                    },
                    {
                        virtuals: {
                            space: {
                                get() {
                                    return "find out how to get the space which this table inside";
                                },
                            },
                        },
                    },
                ],
            },
        ],
        name: { type: String, required: true },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        users: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                permission: { type: Number, required: true },
                global: {
                    stay_time: {
                        type: Number,
                        default: 90,
                    },
                    free_time: { type: Number, default: 0 },
                },
            },
        ],
        is_active: { type: Boolean, default: 1, alias: "isActive" },
        ooh: [
            {
                day_of_week: { type: Number, required: true, min: 1, max: 7 },
                open: Date,
                close: Date,
                is_open: { type: Boolean, required: true },
            },
            { alias: "originalOpeningHours" },
        ],
        soh: [
            {
                date: Date,
                open: Date,
                close: Date,
            },
            { alias: "specialOpeningHours" },
        ],
        global: {
            is_hide_unavailable: { type: Boolean, default: true },
            stay_time: {
                type: Number,
                default: 90,
            },
            free_time: { type: Number, default: 0 },
            basicPerm: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
        virtuals: {
            tableOpts: {
                get() {
                    return "find out how to get that list...";
                },
            },
        },
        toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
        toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
    }
);

export default mongoose.model("Restaurant", restaurantSchema);
