import express from "express";
import * as dotenv from "dotenv";
import { ScenariosModel } from "../models/Scenarios.js";

dotenv.config();
const router = express.Router();

// Retrieve all records with filtering, sorting, pagination, and search
router.get("/all", async (req, res) => {
  try {
    const { category, sortBy, sortOrder, page, limit, search } = req.query;

    // Build the filter object
    const filter = {};
    if (category) {
      filter.category = category;
    }

    // Build the sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Calculate skip and limit for pagination
    const skip = (page - 1) * limit;
    const total = await ScenariosModel.countDocuments(filter);

    // Perform the search
    const searchRegex = new RegExp(search, "i");

    // Query the database with filtering, sorting, pagination, and search
    const scenarios = await ScenariosModel.find({
      ...filter,
      $or: [
        { scenario: searchRegex },
        { videoName: searchRegex },
        { category: searchRegex },
      ],
    })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      scenarios,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve scenarios" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const scenario = await ScenariosModel.findById(req.params.id);
    if (scenario) {
      res.json(scenario);
    } else {
      res.status(404).json({ error: "Scenario not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve scenario" });
  }
});

router.post("/create-scenario", async (req, res) => {
  try {
    const newScenario = req.body;

    // Check if videoId already exists
    const existingScenario = await ScenariosModel.findOne({ videoId: newScenario.videoId });
    if (existingScenario) {
      return res.status(400).json({ error: "Duplicate video ID" });
    }

    const createdScenario = await ScenariosModel.create(newScenario);
    res.status(201).json(createdScenario);
  } catch (error) {
    res.status(500).json({ error: "Failed to create scenario" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updatedScenario = req.body;
    const scenario = await ScenariosModel.findByIdAndUpdate(
      req.params.id,
      updatedScenario,
      { new: true }
    );
    if (scenario) {
      res.json(scenario);
    } else {
      res.status(404).json({ error: "Scenario not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update scenario" });
  }
});

router.delete("/scenarios/:id", async (req, res) => {
  try {
    const scenario = await ScenariosModel.findByIdAndRemove(req.params.id);
    if (scenario) {
      res.json({ message: "Scenario deleted" });
    } else {
      res.status(404).json({ error: "Scenario not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete scenario" });
  }
});

export { router as scenariosRouter };
