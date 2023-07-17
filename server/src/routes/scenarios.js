import express from "express";
import * as dotenv from "dotenv";
import { ScenariosModel } from "../models/Scenarios.js";

dotenv.config();
const router = express.Router();

// Retrieve all records with filtering, sorting, pagination, and search
router.get("/all", async (req, res) => {
    try {
        const { category, scenario, sortBy, sortOrder, page, limit, search } = req.query;

        // Build the filter object
        const filter = {};
        if (scenario && category) {
            filter.scenario = scenario;
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

router.post("/create-scenario", async (req, res) => {
  const { category, scenario, videos } = req.body;

  try {
    // Check for duplicate videoId or videoName within the array
    const duplicateVideos = videos.filter((video, index, self) => {
      const foundIndex = self.findIndex(
        (v) => v.videoId === video.videoId || v.videoName === video.videoName
      );
      return foundIndex !== index;
    });

    if (duplicateVideos.length > 0) {
      return res.status(400).json({ error: "Duplicate videos found" });
    }

    // Check for duplicate category and scenario
    const existingScenario = await ScenariosModel.findOneAndUpdate(
      { category, scenario },
      { $push: { videos: { $each: videos } } },
      { new: true }
    );

    if (existingScenario) {
      return res.json(existingScenario);
    }

    // No duplicates found, create a new scenario
    const newScenario = await ScenariosModel.create({
      category,
      scenario,
      videos,
    });

    res.json(newScenario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { videos } = req.body;

  try {
    // Find the scenario by ID and update the scenario field
    const updatedScenario = await ScenariosModel.findByIdAndUpdate(
      id,
      { $set: { videos } },
      { new: true, runValidators: true }
    );

    if (!updatedScenario) {
      return res.status(404).json({ error: "Scenario not found" });
    }

    return res.json(updatedScenario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the scenario by ID and delete it
    const deletedScenario = await ScenariosModel.findByIdAndDelete(id);

    if (!deletedScenario) {
      return res.status(404).json({ error: "Scenario not found" });
    }

    return res.json({ message: "Scenario deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /:id/video/:videoId
router.delete("/:id/video/:videoId", async (req, res) => {
  const { id, videoId } = req.params;

  try {
    // Find the scenario by ID and video ID
    const scenario = await ScenariosModel.findOneAndUpdate(
      { _id: id },
      { $pull: { videos: { videoId: videoId } } },
      { new: true }
    );

    if (!scenario) {
      return res.status(404).json({ error: "Scenario or video not found" });
    }

    return res.json(scenario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


export { router as scenariosRouter };