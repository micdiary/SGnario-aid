import express from "express";
import jwt, { verify } from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import { getVideoDurationInSeconds } from "get-video-duration";
import * as dotenv from "dotenv";
dotenv.config();

import { encrypt, decrypt } from "../utils/cryptography.js";
import { getDrive } from "../utils/driveHelper.js";
import { UserModel } from "../models/Users.js";
import { SuperuserModel } from "../models/Superusers.js";
import { TaskModel } from "../models/Tasks.js";
import { ScenariosModel } from "../models/Scenarios.js";

const router = express.Router();

// Configure Multer to handle file uploads
const upload = multer({ dest: "uploads/" });

// Create Task
router.post("/create", async (req, res) => {
    const { token, fields } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        if (role !== "therapist") {
            return res.status(401).json({ "error": "Unauthorised" });
        }

        const { email, scenario, recommendedLength } = fields;
        const therapist = await SuperuserModel.findOne({ _id: id });

        const scenarioFound = await ScenariosModel.findOne({
            scenario: scenario,
        });

        // Scenario does not exist
        if (!scenarioFound) {
            return res
                .status(400)
                .json({ "message": "Scenario does not exist" });
        }

        const { videos } = scenarioFound;

        let submissions = [];
        for (let i = 0; i < videos.length; i++) {
            const tempSubmission = { "title": videos[i].videoName };
            submissions.push(tempSubmission);
        }

        const newTask = new TaskModel({
            therapist: therapist.email,
            patient: email,
            scenario: scenario,
            category: scenarioFound.category,
            videos: videos,
            submissions: submissions,
            recommendedLength: recommendedLength,
        });

        await newTask.save();
        return res
            .status(201)
            .json({ "message": "Task assigned succesfully!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get tasks by patient with token
router.get("/user/token/:token", async (req, res) => {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        const { email } = await UserModel.findOne({ _id: id });
        const tasks = await TaskModel.find({ patient: email });

        res.status(200).json(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

// Get tasks by patient with ID
router.get("/user/id/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const { email } = await UserModel.findOne({ _id: id });
        const tasks = await TaskModel.find({ patient: email });
        res.status(200).json(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

// Get task by task ID
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const task = await TaskModel.find({ _id: id });
        res.status(200).json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

// Add/Edit submission patient
router.post("/user/submission", upload.single("file"), async (req, res) => {
    const { token, fields } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;
        const { taskId, submissionId, videoName, stutter, fluency, remark } =
            JSON.parse(fields);

        // Check if task belongs to user
        const task = await TaskModel.findOne({ _id: taskId });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        const user = await UserModel.findOne({ _id: id });

        if (task.patient !== user.email) {
            return res.status(401).json({ error: "Unauthorised" });
        }

        let updatedTask;
        if (req.file) {
            // New or existing submission

            // Find folder to upload
            const therapist = await SuperuserModel.findOne({
                email: task.therapist,
            });

            const patientFolderId = therapist.patientFolders.find((folder) => {
                return folder.patient === user.email;
            }).folderId;

            // Folder does not exist
            if (!patientFolderId) {
                return res
                    .status(404)
                    .json({ error: "Folder does not exist!" });
            }

            // Upload file
            const clientEmail = therapist.clientEmail;
            const privateKey = decrypt(
                therapist.privateKey,
                process.env.ENCRYPTION_KEY
            );

            const uploadDetails = await doUpload(
                req.file,
                patientFolderId,
                clientEmail,
                privateKey
            );

            // User uploaded file that is not a video
            if (!uploadDetails) {
                return res
                    .status(400)
                    .json({ error: "Only video files are accepted" });
            }

            const recordingWebLink = uploadDetails.responseData.webViewLink;
            const videoDuration = uploadDetails.duration;
            const dateSubmitted = new Date();

            if (!submissionId) {
                // Pre-created submission
                const newSubmission = {
                    "title": videoName,
                    "recordingLink": recordingWebLink,
                    "videoDuration": videoDuration,
                    "dateSubmitted": dateSubmitted,
                    "patientStutter": stutter,
                    "patientFluency": fluency,
                    "patientRemark": remark,
                };

                updatedTask = await TaskModel.findByIdAndUpdate(
                    taskId,
                    {
                        $push: { submissions: newSubmission },
                    },
                    { new: true }
                );

                if (!updatedTask) {
                    return res.status(404).json({ error: "Task not found" });
                }

                return res.status(200).json({
                    "message": "Task successfully updated",
                    "task": updatedTask,
                });
            } else {
                // New submission
                updatedTask = await TaskModel.findOneAndUpdate(
                    {
                        _id: taskId,
                        "submissions._id": submissionId,
                    },
                    {
                        $set: {
                            "submissions.$.recordingLink": recordingWebLink,
                            "submissions.$.videoDuration": videoDuration,
                            "submissions.$.dateSubmitted": dateSubmitted,
                            "submissions.$.patientStutter": stutter,
                            "submissions.$.patientFluency": fluency,
                            "submissions.$.patientRemark": remark,
                        },
                    },
                    { new: true }
                );
                return res.status(200).json({
                    message: "Task successfully updated",
                    "task": updatedTask,
                });
            }
        } else {
            // Modify score/feedback
            updatedTask = await TaskModel.findOneAndUpdate(
                {
                    _id: taskId,
                    "submissions._id": submissionId,
                },
                {
                    $set: {
                        "submissions.$.patientStutter": stutter,
                        "submissions.$.patientFluency": fluency,
                        "submissions.$.patientRemark": remark,
                    },
                },
                { new: true }
            );
            return res.status(200).json({
                message: "Task successfully updated",
                "task": updatedTask,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Edit evaluation therapist
router.post("/therapist/evaluation", async (req, res) => {
    const { token, fields } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;
        const { taskId, submissionId, stutter, fluency, remark } = fields;

        if (role !== "therapist" && role !== "educator") {
            return res.status(401).json({ error: "Unauthorised" });
        }

        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id: taskId, "submissions._id": submissionId },
            {
                $set: {
                    "submissions.$.therapistStutter": stutter,
                    "submissions.$.therapistFluency": fluency,
                    "submissions.$.therapistRemark": remark,
                },
            },
            { new: true }
        );
        return res.status(200).json({
            message: "Task successfully updated",
            "task": updatedTask,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get task status count
router.get("/status/:identifier", async (req, res) => {
    // if called by therapist, id === id
    // if called by patient, id === token
    const identifier = req.params.identifier;
    try {
        let userId;
        try {
            const decodedToken = jwt.verify(identifier, process.env.JWT_SECRET);
            const { id } = decodedToken;
            userId = id;
        } catch (err) {
            userId = identifier;
        }
        let user = await UserModel.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // find tasks assigned to user
        const tasks = await TaskModel.find({ patient: user.email });

        // count status
        const totalCount = tasks.length;
        const statusCounts = tasks.reduce((counts, obj) => {
            counts[obj.status] = (counts[obj.status] || 0) + 1;
            return counts;
        }, {});

        return res.status(200).json({
            "total": totalCount,
            "status": statusCounts,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get the duration of the uploading video in seconds
const getDuration = async (filePath) => {
    try {
        const duration = await getVideoDurationInSeconds(filePath);
        return Math.round(duration);
    } catch (error) {
        console.log(error);
        throw "Not a video";
    }
};

// Perform file uploading to google drive in the given folderId
const doUpload = async (file, folderId, clientEmail, privateKey) => {
    try {
        // Check if a file was uploaded
        if (!file) {
            return null;
        }

        const drive = await getDrive(clientEmail, privateKey);

        // Define the uploadToDrive function
        const uploadToDrive = async (fileData, folderId) => {
            try {
                //Get video duration
                const duration = await getDuration(fileData.path);

                // Create a file metadata object
                const fileMetadata = {
                    name: fileData.originalname,
                    parents: [folderId],
                };

                // Create the media upload object
                const media = {
                    mimeType: fileData.mimetype,
                    body: fs.createReadStream(fileData.path),
                };

                // Upload the file
                const response = await drive.files.create({
                    requestBody: fileMetadata,
                    media: media,
                    fields: "kind, id, name, mimeType, webViewLink",
                });

                // Append permissions to make it readable by everyone and editable by uploader
                await drive.permissions.create({
                    fileId: response.data.id,
                    requestBody: {
                        role: "reader",
                        type: "anyone",
                    },
                    supportsAllDrives: true,
                });

                const finalResponse = {
                    "responseData": response.data,
                    "duration": duration,
                };

                console.log("File uploaded successfully:", finalResponse);
                return finalResponse;
            } catch (error) {
                console.log("Error uploading file to Google Drive:", error);
                throw error;
            }
        };

        // Call the uploadToDrive function with the uploaded file
        const uploadedFile = await uploadToDrive(file, folderId);

        // Delete the temporary file
        fs.unlinkSync(file.path);

        return uploadedFile;
    } catch (error) {
        console.error("Error handling file upload:", error);
        return null;
    }
};

export { router as taskRouter };
