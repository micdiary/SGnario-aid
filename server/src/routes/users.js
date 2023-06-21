import express from "express";
import jwt, { verify } from "jsonwebtoken";
import { encrypt, decrypt } from "../utils/cryptography.js";
import * as dotenv from "dotenv";
dotenv.config();

import { UserModel } from "../models/Users.js";
import { SuperuserModel } from "../models/Superusers.js";

const router = express.Router();

// Get User Profile
router.get("/profile/:token", async (req, res) => {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        const userFound = await UserModel.findOne({ _id: id }, { password: 0 });
        const superuserFound = await SuperuserModel.findOne(
            {
                _id: id,
            },
            { password: 0 }
        );

        const user = userFound || superuserFound;
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Edit User Profile
router.post("/edit-profile", async (req, res) => {
    const { token, fields } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        let updatedUser;
        if (role === "user") {
            const { name, dob, gender, issue } = fields;
            updatedUser = await UserModel.findByIdAndUpdate(
                id,
                {
                    name: name,
                    dob: dob,
                    gender: gender,
                    issue: issue,
                    therapist: therapist,
                },
                { new: true }
            );
        } else if (role === "therapist" || role === "educator") {
            const { name, purpose, organisation } = fields;
            updatedUser = await SuperuserModel.findByIdAndUpdate(
                id,
                {
                    name: name,
                    purpose: purpose,
                    organisation: organisation,
                },
                { new: true }
            );
        }

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            "message": "User succesfully updated",
            "user": updatedUser,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Set Drive Credentials
router.post("/set-drive-credentials", async (req, res) => {
    const { token, clientEmail, privateKey } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        if (role == "therapist") {
            const encryptedKey = encrypt(
                privateKey,
                process.env.ENCRYPTION_KEY
            );
            const updatedUser = await SuperuserModel.findByIdAndUpdate(
                id,
                {
                    clientEmail: clientEmail,
                    privateKey: encryptedKey,
                },
                { new: true }
            );

            return res.status(200).json({
                "message": "User succesfully updated",
                "user": updatedUser,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get therapists
router.get("/therapists", async (req, res) => {
    try {
        const therapists = await SuperuserModel.find({ role: "therapist" });
        let therapistsNames = {};

        therapists.forEach((therapist) => {
            therapistsNames[therapist.email] = therapist.name;
        });
        return res.status(200).json({ "therapists": therapistsNames });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all therapists
router.post("/therapists", async (req, res) => {
    const { token } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { role } = decodedToken;

        // Validate authorisation
        if (role !== "admin") {
            return res.status(401).json({ error: "Unauthorised" });
        }

        // Find all therapists
        const therapists = await SuperuserModel.find(
            { role: "therapist" },
            { password: 0 }
        );
        return res.status(200).json({ therapists });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all patients by therapist
router.get("/patients/:token", async (req, res) => {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        // Validate authorisation
        if (role == "user") {
            return res.status(401).json({ error: "Unauthorised" });
        }

        let users;
        if (role === "therapist" || role === "educator") {
            // Get therapist email
            const therapist = await SuperuserModel.findOne(
                { _id: id },
                { email: 1 }
            );
            const { email } = therapist;

            // Find users with matching therapist
            users = await UserModel.find({ therapist: email }, { password: 0 });
        } else if (role === "admin") {
            users = await UserModel.find({}, { password: 0 });
        }

        return res.status(200).json({ users });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export { router as userRouter };
