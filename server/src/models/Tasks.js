import mongoose, { Schema } from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    therapist: { type: String, required: true },
    patient: { type: String, required: true },
    patientName: { type: String, required: true },
    dateAssigned: { type: Date, required: true, default: Date.now },
    recommendedLength: [
        {
            videoName: { type: String, required: true },
            length: { type: Number, required: true },
        },
    ],
    videos: [
        {
            category: { type: String, required: true },
            scenario: { type: String, required: true },
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
