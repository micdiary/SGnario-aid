import mongoose from "mongoose";

const ScenariosSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    scenario: {
        type: String,
        required: true,
        unqiue: true,
    },
    videos: [
        {
            videoId: { type: String, required: true, unique: true },
            videoName: { type: String, required: true, unique: true },
        },
    ],
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export const ScenariosModel = mongoose.model("scenarios", ScenariosSchema);
