import mongoose from "mongoose";

// temporary schema for scenario
const TempSchema = new mongoose.Schema({
    category: { type: String, required: true },
    scenario: { type: String, required: true, unique: true },
    videoName: { type: String, required: true },
    videoId: { type: String, required: true, unique: true },
    dateAdded: { type: Date, required: true },
});

export const TempModel = mongoose.model("temps", TempSchema);
