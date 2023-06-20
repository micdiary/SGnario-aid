import express from "express";
import jwt, { verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

import { UserModel } from "../models/Users.js";
import { SuperuserModel } from "../models/Superusers.js";
import { TaskModel } from "../models/Tasks.js";
import { TempModel } from "../models/Temp.js";
import { ScenariosModel } from "../models/Scenarios.js";

const router = express.Router();

// Create Task
router.post("/create", async (req, res) => {
    const { token, fields } = req.body;
    console.log(fields);
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        if (role !== "therapist") {
            return res.status(401).json({ "error": "Unauthorised" });
        }

        const { email, scenario, dateAssigned } = fields;
        const therapist = await SuperuserModel.findOne({ _id: id });

        const newTask = new TaskModel({
            therapist: therapist.email,
            patient: email,
            dateAssigned: dateAssigned,
            scenario: scenario,
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

        for (const task of tasks) {
            const temp = await ScenariosModel.findOne({ videoId: task.scenario });
            task.scenario = temp.scenario
            task.category = temp.category
            task.videoName = temp.videoName
        }

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

// // Get tasks by therapist with token
// router.get("/superuser/:token", async (req, res) => {
//     const token = req.params.token;
//     try {
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//         const { id, role } = decodedToken;

//         const { email } = await SuperuserModel.findOne({ _id: id });
//         const tasks = await TaskModel.find({ therapist: email });
//         res.status(200).json(tasks);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ "error": "Internal Server Error" });
//     }
// });

export { router as taskRouter };
