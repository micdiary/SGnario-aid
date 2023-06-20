import mongoose, { Schema } from "mongoose";

const TaskSchema = new mongoose.Schema({
    therapist: { type: String, required: true },
    patient: { type: String, required: true },
    dateAssigned: { type: Date, required: true },
    scenario: { type: String, required: true },
    videoIds: { type: [String], required: true },
    submission: [
        {
            title: { type: Number, required: true },
            recordingLink: { type: Number, required: true },
            dateSubmitted: { type: Date, required: true },
            patientStutter: { type: Number, required: true },
            patientFluency: { type: Number, required: true },
            patientRemark: { type: String, required: true },
            therapistStutter: { type: Number },
            therapistFluency: { type: Number },
            therapistRemark: { type: String },
        },
    ],
    status: { type: String, required: true, default: "Incomplete" },
});

export const TaskModel = mongoose.model("tasks", TaskSchema);
