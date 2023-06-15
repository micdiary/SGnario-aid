import express from "express";
import * as dotenv from "dotenv";
dotenv.config();

import { RecordsModel } from "../models/Records.js";

const router = express.Router();

// Retrieve all records
router.get("/records", async (req, res) => {
    try {
        const { page, search, sort, order } = req.query;
        const perPage = 6; // Number of records per page

        let query = RecordsModel.find();

        // Apply search query if provided
        if (search) {
            query = query.find({
                video_name: { $regex: new RegExp(search, "i") },
            });
        }

        // Apply sorting
        if (sort) {
            query = query.sort({ [sort]: order === "desc" ? -1 : 1 });
        }

        // Apply pagination
        if (page) {
            const pageNumber = parseInt(page);
            const skip = (pageNumber - 1) * perPage;
            const totalRecords = await RecordsModel.countDocuments(query);
            const totalPages = Math.ceil(totalRecords / perPage);
            query = query.skip(skip).limit(perPage);

            return res.json({
                records: await query.exec(),
                currentPage: pageNumber,
                totalPages: totalPages,
            });
        }

        const records = await query.exec();
        res.json(records);
    } catch (error) {
        console.error("Error retrieving records", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Retrieve a specific record
router.get("/records/:recordId", async (req, res) => {
    const { recordId } = req.params;
    try {
        const record = await RecordsModel.findById(recordId);
        res.json(record);
    } catch (error) {
        console.error("Error retrieving record", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Retrieve therapist feedback for a specific record
router.get("/records/:recordId/feedback", async (req, res) => {
    const { recordId } = req.params;
    try {
        const record = await RecordsModel.findById(recordId);
        res.json({ feedback: record.feedback });
    } catch (error) {
        console.error("Error retrieving therapist feedback", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export { router as recordRouter };
