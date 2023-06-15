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
            res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            "message": "User succesfully updated",
            "user": updatedUser,
        });
    } catch (err) {
        console.log(err);
    }
});

router.post("/add-api-key", async (req, res) => {
    const { token, apiKey } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        if (role == "therapist") {
            const encryptedApiKey = encrypt(apiKey, process.env.ENCRYPTION_KEY);
            const updatedUser = await SuperuserModel.findByIdAndUpdate(
                id,
                { apiKey: encryptedApiKey },
                { new: true }
            );

            return res.status(200).json({
                "message": "User succesfully updated",
                "user": updatedUser,
            });
        }
    } catch (err) {
        console.log(err);
    }
});

// Get therapists
router.get("/therapists", async (req, res) => {
    const therapists = await SuperuserModel.find({ role: "therapist" });
    let therapistsNames = {};

    therapists.forEach((therapist) => {
        therapistsNames[therapist.email] = therapist.name;
    });
    res.status(200).json({ "therapists": therapistsNames });
});

// Get all therapists
router.post("/therapists", async (req, res) => {
    const { token } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { role } = decodedToken;

        if (role !== "admin") {
            return res.status(401).json({ "error": "Unauthorised" });
        }

        const therapists = await SuperuserModel.find(
            { role: "therapist" },
            { password: 0 }
        );
        res.status(200).json({ therapists });
    } catch (err) {
        console.log(err);
    }
});

// Get all patients
router.post("/patient", async (req, res) => {
    const { token } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { role } = decodedToken;

        if (role !== "therapist" || role !== "educator") {
            return res.status(401).json({ "error": "Unauthorised" });
        }

        const therapists = await SuperuserModel.find(
            { role: "therapist" },
            { password: 0 }
        );
        res.status(200).json({ therapists });
    } catch (err) {
        console.log(err);
    }
});

router.post("/test", async (req, res) => {
    const test = encrypt("xd", process.env.ENCRYPTION_KEY);
    console.log(decrypt(test, process.env.ENCRYPTION_KEY));
});

export { router as userRouter };
