import mongoose from "mongoose";

const SuperuserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    purpose: { type: [String], default: undefined, required: true },
    organisation: { type: String, required: true },
});

export const SuperuserModel = mongoose.model("superusers", SuperuserSchema);
