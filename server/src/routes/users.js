import express from "express";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/Users.js";
import { SuperuserModel } from "../models/Superusers.js";
import { TaskModel } from "../models/Tasks.js";
import { encrypt, decrypt } from "../utils/cryptography.js";
import { getDrive, createFolder, deleteFolder } from "../utils/driveHelper.js";

import { JWT_SECRET, INTERNAL_SERVER_ERROR } from "../constants.js";

const router = express.Router();

// Get User Profile
router.get("/profile/:token", async (req, res) => {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
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
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

// Edit User Profile
router.post("/edit-profile", async (req, res) => {
    const { token, fields } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { id, role } = decodedToken;

        let updatedUser;
        if (role === "user") {
            const { name, dob, gender, issue } = fields;

            updatedUser = await UserModel.findOne({ _id: id });

            updatedUser.name = name;
            updatedUser.dob = dob;
            updatedUser.gender = gender;
            updatedUser.issue = issue;

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
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

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
            return res.stat;
            us(404).json({ error: "Therapist not found" });
        }

        // User declines request
        if (action === "no") {
            // Remove therapist from patient therapist requests list
            const newTherapistRequests = user.therapistRequests.filter(
                (therapist) => therapist !== therapistEmail
            );
            await user.save();

            // Remove user from therapist pending requests list
            const newPendingRequests = therapist.pendingRequests.filter(
                (patient) => patient !== id
            );
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

router.post("/set-therapist", async (req, res) => {
    const { token, userIds } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { id, role } = decodedToken;

        // Find therapist
        const therapist = await SuperuserModel.findOne({ _id: id });

        // Check if therapist configured drive
        if (!therapist.privateKey) {
            return res
                .status(404)
                .json({ error: "Drive has not been configured yet." });
        }

        let userCount = 0;
        let usersAdded = [];
        // Set therapist
        for (const userId of userIds) {
            const user = await UserModel.findOne({ _id: userId });

            // To prevent race conditions
            if (!user.therapistEmail) {
                let email;
                let folderId;

                // Check if new therapist
                const formerTherapist = user.prevTherapists.find(
                    (prevTherapist) => prevTherapist.email === therapist.email
                );

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

                user.currentFolder = folderId;
                user.therapistEmail = therapist.email;
                user.therapistName = therapist.name;
                await user.save();

                userCount++;
                usersAdded.push(user.email);
            }
        }
        return res.status(200).json({
            message: `${userCount} user(s) have been succesfully added`,
            usersAdded: usersAdded,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Interal Server Error" });
    }
});

// Set Drive Credentials
router.post("/set-drive-credentials", async (req, res) => {
    const { token, fields } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { id, role } = decodedToken;

        const { clientEmail, privateKey, rootFolderId } = fields;
        const cleanedPrivateKey = privateKey
            .replaceAll("\\n", "\n")
            .replaceAll('"', "");
        console.log(cleanedPrivateKey);
        if (role == "therapist") {
            const encryptedKey = encrypt(cleanedPrivateKey);
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
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

// Get therapists name and email
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
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

// Get all therapists
router.post("/therapists", async (req, res) => {
    const { token } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
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
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

// Get all patients without therapist
// Deprecated
router.get("/newPatients/:token", async (req, res) => {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { id, role } = decodedToken;

        // Validate authorisation
        if (role == "user" || role == "admin") {
            return res.status(401).json({ error: "Unauthorised" });
        }

        // Find patients without a therapist
        const patients = await UserModel.find({
            therapistEmail: { $in: ["", null] },
        });

        const patientArray = patients.map((obj) => ({
            id: obj._id,
            name: obj.name,
            email: obj.email,
        }));

        return res.status(200).json({ patientArray });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

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

// Get all patients by therapist
router.get("/patients/:token", async (req, res) => {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
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
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

// Remove patient from therapist
router.post("/remove-user", async (req, res) => {
    const { token, userId } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
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
        user.currentFolder = "";
        await user.save();

        return res.status(200).json({ message: "User successfully removed" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

router.delete("/", async (req, res) => {
    const { token, userId } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { id, role } = decodedToken;

        if (role !== "admin") {
            return res.status(401).json({ error: "Unauthorised" });
        }

        const deletedUser = await UserModel.findOne({ _id: userId });

        // User
        if (deletedUser) {
            const { prevTherapists } = deletedUser;
            for (const prevTherapist of prevTherapists) {
                // Get therapist drive credentials
                const therapist = await SuperuserModel.findOne({
                    email: prevTherapist.email,
                });
                const { clientEmail, rootFolderId } = therapist;
                const privateKey = decrypt(therapist.privateKey);

                // Delete folders
                if (
                    !deleteFolder(
                        prevTherapist.folderId,
                        await getDrive(clientEmail, privateKey)
                    )
                ) {
                    return res.status(500).json({
                        error: "Internal Server Error. Could not delete folder.",
                    });
                }

                // Delete all tasks
                const tasks = await TaskModel.deleteMany({
                    patient: deletedUser.email,
                });
            }
            await deletedUser.deleteOne();
        } else {
            const deletedSuperuser = await SuperuserModel.findOne({
                _id: userId,
            });

            // Remove from patients
            const { email } = deletedSuperuser;
            console.log(email);
            const patients = await UserModel.find({ therapistEmail: email });

            for (const patient of patients) {
                patient.therapistEmail = "";
                patient.therapistName = "";
                await patient.save();
            }

            await deletedSuperuser.deleteOne();
        }

        return res.status(200).json({ message: "User successfully deleted" });
    } catch (err) {
        console.log(err);
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: "Invalid token" });
        } else {
            return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
        }
    }
});

export { router as userRouter };
