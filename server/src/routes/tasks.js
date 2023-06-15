import express from "express";
import jwt, { verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

import { UserModel } from "../models/Users.js";
import { SuperuserModel } from "../models/Superusers.js";
import { TaskModel } from "../models/Tasks.js";

const router = express.Router();

// Create Task
router.post("/assign", async (req, res) => {
    const { token, fields } = req.body;

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        if (role !== "therapist") {
            return res.status(401).json({ "error": "Unauthorised" });
        }

        const { email, scenarioId, dateAssigned } = fields;
        const therapist = await SuperuserModel.findOne({ _id: id });

        const newTask = new TaskModel({
            therapist: therapist.email,
            patient: email,
            dateAssigned: dateAssigned,
            scenarioId: scenarioId,
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

export { router as taskRouter };
