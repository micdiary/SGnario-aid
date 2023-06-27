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
            const { name, dob, gender, issue, therapistName, therapistEmail } =
                fields;

            updatedUser = await UserModel.findOne({ _id: id });

            // if therapist changed and not in prev therapist array
            // push current therapist into array
            console.log(!updatedUser.prevTherapists.includes(therapistEmail));
            console.log(updatedUser.therapistEmail !== therapistEmail);
            if (
                !updatedUser.prevTherapists.includes(
                    updatedUser.therapistEmail
                ) &&
                updatedUser.therapistEmail !== therapistEmail
            ) {
                updatedUser.prevTherapists.push(updatedUser.therapistEmail);
            }

            updatedUser.name = name;
            updatedUser.dob = dob;
            updatedUser.gender = gender;
            updatedUser.issue = issue;
            updatedUser.therapistName = therapistName;
            updatedUser.therapistEmail = therapistEmail;

            await updatedUser.save();
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
    const { token, fields } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        const { clientEmail, privateKey, rootFolderId } = fields;

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
                    rootFolderId: rootFolderId,
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
            users = await UserModel.find(
                { therapistEmail: email },
                { password: 0 }
            );
        } else if (role === "admin") {
            users = await UserModel.find({}, { password: 0 });
        }

        return res.status(200).json({ users });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// User can add himself back
// Remove patient from therapist
router.post("/remove-user", async (req, res) => {
    const { token, userId } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        if (role !== "therapist" || role == "educator") {
            return res.status(401).json({ error: "Unauthorised" });
        }

        const therapist = await SuperuserModel.findOne({ _id: id });
        const user = await UserModel.findOne({ _id: userId });

        if (user.therapistEmail !== therapist.email) {
            return res
                .status(401)
                .json({ error: "Unauthorised. Patient not under therapist" });
        }

        user.therapistEmail = "";
        user.therapistName = "";
        await user.save();

        return res.status(200).json({ message: "User successfully removed" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/", async (req, res) => {
    const { token, userId } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        if (role !== "admin") {
            return res.status(401).json({ error: "Unauthorised" });
        }

        let deleted;

        const deletedUser = await UserModel.findByIdAndDelete(userId);
        const deletedSuperuser = await SuperuserModel.findByIdAndDelete(userId);

        deleted = deletedUser || deletedSuperuser;

        if (!deleted) {
            return res.status(404).json({ error: "User does not exist" });
        }

        return res.status(200).json({ message: "User successfully deleted" });
    } catch (err) {
        console.log(err);
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: "Invalid token" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
});

// create and delete folder APIs
export { router as userRouter };
