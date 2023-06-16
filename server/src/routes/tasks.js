import express from "express";
import jwt, { verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

import { UserModel } from "../models/Users.js";
import { SuperuserModel } from "../models/Superusers.js";
import { TaskModel } from "../models/Tasks.js";
import { TempModel } from "../models/Temp.js";

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

// Get tasks by patient
router.get("/user/:token", async (req, res) => {
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

router.post("/create-temp", async (req, res) => {
    const { category, scenario, videoName, videoId, dateAdded } = req.body;
    try {
        const scenarios = await TempModel.find({ scenario: scenario });
        const videoIds = await TempModel.find({ videoId: videoId });

        if (scenarios.length !== 0) {
            return res.status(404).json({ "error": "Duplicate scenario name" });
        }

        if (videoIds.length !== 0) {
            return res.status(404).json({
                "error": "Duplicate video ID",
            });
        }

        const newScenario = new TempModel({
            category: category,
            scenario: scenario,
            videoName: videoName,
            videoId: videoId,
            dateAdded: dateAdded,
        });
        newScenario.save();
        return res.status(201).json({ "message": "Scenario created" });
    } catch (err) {
        console.log(err);
    }
});

//

router.get("/scenarios", async (req, res) => {
    try {
        const scenarios = await TempModel.find();

        let scenarioDetails = {};
        scenarios.forEach((scenario) => {
            scenarioDetails[scenario.scenario] = scenario._id;
        });
        return res.status(200).json(scenarioDetails);
    } catch (err) {
        console.log(err);
    }
});

export { router as taskRouter };
