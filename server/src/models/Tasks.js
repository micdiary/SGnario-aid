import mongoose, { Schema } from "mongoose";

const TaskSchema = new mongoose.Schema({
    therapist: { type: String, required: true },
    patient: { type: String, required: true },
    dateAssigned: { type: Date, required: true, default: Date.now },
    scenario: { type: String, required: true },
    category: { type: String, required: true },
    recommendedLength: { type: [Number], required: true },
    videos: [
        {
            videoId: { type: String, required: true },
            videoName: { type: String, required: true },
        },
    ],
    submissions: [
        {
            title: { type: String, required: true },
            recordingLink: { type: String },
            videoDuration: { type: Number },
            dateSubmitted: { type: Date },
            patientStutter: { type: Number },
            patientFluency: { type: Number },
            patientRemark: { type: String },
            therapistStutter: { type: Number },
            therapistFluency: { type: Number },
            therapistRemark: { type: String },
        },
    ],
    status: { type: String, required: true, default: "Incomplete" },
});

export const TaskModel = mongoose.model("tasks", TaskSchema);
