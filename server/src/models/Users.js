import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    issue: { type: [String], default: undefined },
    therapist: { type: String, default: undefined },
});

export const UserModel = mongoose.model("users", UserSchema);
