import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";

import { UserModel } from "../models/Users.js";
import { SuperuserModel } from "../models/Superusers.js";
import { TaskModel } from "../models/Tasks.js";
import { decrypt } from "../utils/cryptography.js";
import { doUpload } from "../utils/driveHelper.js";

import { JWT_SECRET, INTERNAL_SERVER_ERROR } from "../constants.js";

const router = express.Router();

// Configure Multer to handle file uploads
const maxMB = 100;
const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: maxMB*1024*1024
    }
});

// Custom error handling function for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size limit exceeded. Maximum file size allowed is" + maxMB + "MB." });
    }
    // Handle other multer errors if needed
    return res.status(500).json({ error: "File upload error" });
  }
  next(err);
};

// Create a Task
router.post("/create", async (req, res) => {
    const { token, fields } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { id, role } = decodedToken;

        if (role !== "therapist") {
            return res.status(401).json({ error: "Unauthorised" });
        }

        const { title, name, email, videos, recommendedLength } = fields;

        const therapist = await SuperuserModel.findOne({ _id: id });

        let submissions = [];
        for (let i = 0; i < videos.length; i++) {
            const tempSubmission = {
                "category": videos[i].category,
                "scenario": videos[i].scenario,
                "title": videos[i].videoName,
            };
            submissions.push(tempSubmission);
        }

        const newTask = new TaskModel({
            title: title,
            therapist: therapist.email,
            patient: email,
            patientName: name,
            videos: videos,
            submissions: submissions,
            recommendedLength: recommendedLength,
        });

        await newTask.save();
        return res.status(201).json({ message: "Task assigned succesfully!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
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
        res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

// Get tasks by patient with token
router.get("/user/token/:token", async (req, res) => {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { id, role } = decodedToken;

        const { email } = await UserModel.findOne({ _id: id });
        const tasks = await TaskModel.find({ patient: email });

        res.status(200).json(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: INTERNAL_SERVER_ERROR });
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
        res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

// Add/Edit submission patient
router.post("/user/submission", upload.single("file"), async (req, res) => {
    const { token, fields } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
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
            const patientFolderId = user.currentFolder;
            const therapist = await SuperuserModel.findOne({
                email: task.therapist,
            });

            // Folder does not exist
            if (!patientFolderId) {
                return res
                    .status(404)
                    .json({ error: "Folder does not exist!" });
            }

            // Upload file
            const clientEmail = therapist.clientEmail;
            const privateKey = decrypt(therapist.privateKey);

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
                    .json({ error: "Only video/audio files are accepted" });
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
                    message: "Task successfully updated",
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
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

// Edit evaluation therapist
router.post("/therapist/evaluation", async (req, res) => {
    const { token, fields } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
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
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
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
            const decodedToken = jwt.verify(identifier, JWT_SECRET);
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
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

// Change status
router.post("/status", async (req, res) => {
    const { token, fields } = req.body;
    try {
        const { newStatus, taskId } = fields;

        // Check if valid status
        if (!["Incomplete", "Pending", "Completed"].includes(newStatus)) {
            return res.status(404).json({ error: "Invalid status" });
        }

        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { id, role } = decodedToken;

        // Check if valid user
        const user =
            (await UserModel.findOne({ _id: id })) ||
            (await SuperuserModel.findOne({ _id: id }));
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if valid task
        const task = await TaskModel.findOne({ _id: taskId });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        // Check if task belongs to user
        if (
            (role === "user" && user.email !== task.patient) ||
            (role !== "user" && user.email !== task.therapist)
        ) {
            return res.status(401).json({ error: "Unauthorised" });
        }

        // Change status
        task.status = newStatus;
        await task.save();

        return res
            .status(200)
            .json({ message: "Status successfully updated", task });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

router.use(handleMulterError);

export { router as taskRouter };
