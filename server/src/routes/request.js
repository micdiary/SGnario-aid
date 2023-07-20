import express from "express";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/Users.js";
import { SuperuserModel } from "../models/Superusers.js";
import { decrypt } from "../utils/cryptography.js";
import { getDrive, createFolder } from "../utils/driveHelper.js";

import { JWT_SECRET, INTERNAL_SERVER_ERROR } from "../constants.js";

const router = express.Router();

// Get all patients IDs without therapist
router.get("/newPatientsId/:token", async (req, res) => {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { id, role } = decodedToken;

        // Validate authorisation
        if (role == "user" || role == "admin") {
            return res.status(401).json({ error: "Unauthorised" });
        }

        const therapist = await SuperuserModel.findOne({ _id: id });

        // Find patients without a therapist
        const patients = await UserModel.find({
            therapistEmail: { $in: ["", null] },
        });

        // Create an array of patients ID
        const patientArray = patients.map((obj) => obj._id);

        // Remove patients that have already been sent requests
        const processedArray = patientArray.filter(
            (patientId) => !therapist.pendingRequests.includes(patientId)
        );

        return res.status(200).json({ patientArray: processedArray });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

// Send therapist request
router.post("/send-request", async (req, res) => {
    const { token, userIds } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { id, role } = decodedToken;

        // Find therapist
        const therapist = await SuperuserModel.findOne({ _id: id });

        if (!therapist) {
            return res.status(404).json({ error: "Therapist not found" });
        }

        // Check if therapist configured drive
        if (!therapist.privateKey) {
            return res
                .status(404)
                .json({ error: "Drive has not been configured yet." });
        }

        let userCount = 0;
        let usersRequested = [];
        for (const userId of userIds) {
            const user = await UserModel.findOne({ _id: userId });

            // Check if requests exists
            if (user.therapistRequests.includes(therapist.email)) {
                // go to next user
                continue;
            }

            // Add therapist to therapistRequests array
            user.therapistRequests.push(therapist.email);
            await user.save();

            // Add patient to pendingRequests array
            therapist.pendingRequests.push(user.id);
            await therapist.save();

            userCount++;
            usersRequested.push(user.id);
        }

        return res.status(200).json({
            message: `${userCount} requests have been succesfully sent`,
            usersRequested: usersRequested,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

// Request action (accept/decline)
router.post("/request-action", async (req, res) => {
    const { token, fields } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { id, role } = decodedToken;
        const user = await UserModel.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { therapistEmail, action } = fields;

        // Find therapist
        const therapist = await SuperuserModel.findOne({
            email: therapistEmail,
        });

        if (!therapist) {
            return res.status(404).json({ error: "Therapist not found" });
        }

        // User declines request
        if (action === "no") {
            // Remove therapist from patient therapist requests list
            const newTherapistRequests = user.therapistRequests.filter(
                (therapist) => therapist !== therapistEmail
            );
            user.therapistRequests = newTherapistRequests;
            await user.save();

            // Remove user from therapist pending requests list
            const newPendingRequests = therapist.pendingRequests.filter(
                (patient) => patient !== id
            );
            therapist.pendingRequests = newPendingRequests;
            await therapist.save();

            return res
                .status(200)
                .json({ message: `Declined ${therapistEmail}'s request` });
        } else if (action === "yes") {
            // Check if new therapist
            const formerTherapist = user.prevTherapists.find(
                (prevTherapist) => prevTherapist.email === therapist.email
            );

            let folderId;
            let email;
            if (!formerTherapist) {
                // Create new folder
                const { clientEmail, rootFolderId } = therapist;
                const privateKey = decrypt(therapist.privateKey);

                const data = await createFolder(
                    user.email,
                    rootFolderId,
                    await getDrive(clientEmail, privateKey)
                );

                folderId = data.id;
                email = therapist.email;

                // push into prevTherapists
                user.prevTherapists.push({
                    "email": email,
                    "folderId": folderId,
                });
            } else {
                ({ email, folderId } = formerTherapist);
            }

            // Remove user from all therapist pending requests list
            for (const therapistEmail of user.therapistRequests) {
                const therapist = await SuperuserModel.findOne({
                    email: therapistEmail,
                });
                const newPendingRequests = therapist.pendingRequests.filter(
                    (patient) => patient !== id
                );
                therapist.pendingRequests = newPendingRequests;
                await therapist.save();
            }

            // Set new user details
            user.currentFolder = folderId;
            user.therapistEmail = therapist.email;
            user.therapistName = therapist.name;
            user.therapistRequests = [];
            await user.save();

            return res
                .status(200)
                .json({ message: `Accepted ${therapistEmail}'s request` });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

router.post("/delete-request", async (req, res) => {
    const { token, userId } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { id, role } = decodedToken;

        // Find therapist
        const therapist = await SuperuserModel.findOne({ _id: id });

        // Remove user from pending requests lis
        const newPendingRequests = therapist.pendingRequests.filter(
            (patient) => patient !== userId
        );
        therapist.pendingRequests = newPendingRequests;
        await therapist.save();

        // Find user
        const user = await UserModel.findOne({ _id: userId });

        // Remove therapist from patient therapist requests list
        const newTherapistRequests = user.therapistRequests.filter(
            (therapist) => therapist !== therapist.email
        );
        user.therapistRequests = newTherapistRequests;
        await user.save();

        return res
            .status(200)
            .json({ message: `Request to user ${userId} deleted. ` });
    } catch (err) {
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

export { router as requestRouter };
