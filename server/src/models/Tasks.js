import mongoose from "mongoose";

// const PatientGradeSchema = new mongoose.Schema({
//     video: { type: Number, required: true },
//     stutter: { type: Number, required: true },
//     fluency: { type: Number, required: true },
//     remark: { type: String },
// });

// const TherapistGradeSchema = new mongoose.Schema({
//     video: { type: Number, required: true },
//     stutter: { type: Number, required: true },
//     fluency: { type: Number, required: true },
//     remark: { type: String },
// });

const TaskSchema = new mongoose.Schema({
    therapist: { type: String, required: true },
    patient: { type: String, required: true },
    dateAssigned: { type: Date, required: true },
    scenario: { type: String, required: true },
    patientGrade: [
        {
            video: { type: Number, required: true },
            stutter: { type: Number, required: true },
            fluency: { type: Number, required: true },
            remark: { type: Number, required: true },
        },
    ],
    therapistGrade: [
        {
            video: { type: Number, required: true },
            stutter: { type: Number, required: true },
            fluency: { type: Number, required: true },
            remark: { type: Number, required: true },
        },
    ],
    recordings: { type: String },
    status: { type: String, required: true, default: "Incomplete" },
});

export const TaskModel = mongoose.model("tasks", TaskSchema);
