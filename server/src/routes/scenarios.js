import express from "express";
import * as dotenv from "dotenv";
import { ScenariosModel } from "../models/Scenarios.js";

dotenv.config();
const router = express.Router();

// Retrieve all records
router.get("/all", async (req, res) => {
  try {
    const { page, search, sort, order } = req.query;
    const perPage = 6; // Number of records per page

    let query = ScenariosModel.find();

    // Apply search query if provided
    if (search) {
      query = query.find({
        videoName: { $regex: new RegExp(search, "i") },
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
      const totalScenarios = await ScenariosModel.countDocuments(query);
      const totalPages = Math.ceil(totalScenarios / perPage);
      query = query.skip(skip).limit(perPage);

      const scenarios = await query.exec();

      return res.json({
        data: {
          scenarios,
          totalPages,
        },
      });
    }

    const scenarios = await query.exec();
    res.json({
      data: scenarios,
    });
  } catch (error) {
    console.error("Error retrieving scenarios", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST route to create a new scenario
router.post("/create-scenario", async (req, res) => {
  try {
    const { category, scenario, videoId, videoName, dateAdded } = req.body;

    // Create a new instance of the ScenariosModel
    const newScenario = new ScenariosModel({
      category,
      scenario,
      videoId,
      videoName,
      dateAdded,
    });

    // Save the new scenario to the database
    await newScenario.save();

    res.status(201).json({ success: true, scenario: newScenario });
  } catch (error) {
    console.error("Error creating scenario", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as scenariosRouter };
