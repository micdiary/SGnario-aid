import express from "express";
import jwt, { verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

import { UserModel } from "../models/Users.js";
import { SuperuserModel } from "../models/Superusers.js";
import { TaskModel } from "../models/Tasks.js";
import { ScenariosModel } from "../models/Scenarios.js";

const router = express.Router();

// Create Task
router.post("/create", async (req, res) => {
    const { token, fields } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        if (role !== "therapist") {
            return res.status(401).json({ "error": "Unauthorised" });
        }

        const { email, scenario } = fields;
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
            videos: videos,
            submissions: submissions,
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
router.post("/user/submission", async (req, res) => {
    const { token, fields } = req.body;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        const { taskId, submissionId, videoName, stutter, fluency, remark } =
            fields;

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
        // New submission
        if (!submissionId) {
            console.log("here1");

            const newSubmission = {
                "title": videoName,
                "recordingLink": "temp",
                "dateSubmitted": new Date(),
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
            // Existing submission
            console.log("here2");
            updatedTask = await TaskModel.findOneAndUpdate(
                { _id: taskId, "submissions._id": submissionId },
                {
                    $set: {
                        "submissions.$.recordingLink": "temp",
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
    }
});

// // User edit ratings
// router.put("/user/evaluation", async (req, res) => {
//     const { token, fields } = req.body;
//     try {
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//         const { id, role } = decodedToken;

//         if (role !== "user") {
//             return res.status(401).json({ error: "Unauthorised" });
//         }

//         const { taskId, submissionId, stutter, fluency, remark } = fields;
//         updatedTask = await Task.findOneAndUpdate(
//             { _id, taskId, "submissions._id": submissionId },
//             {
//                 $set: {
//                     "submissions.$.patientStutter": stutter,
//                     "submissions.$.patientFluency": fluency,
//                     "submissions.$.patientRemark": remark,
//                 },
//             },
//             { new: true }
//         );

//         return res.status(200).json({
//             "message": "Task succesfully updated",
//             "task": updatedTask,
//         });
//     } catch (err) {
//         console.log(err);
//     }
// });

export { router as taskRouter };
