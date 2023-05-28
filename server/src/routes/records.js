import express from 'express';
import * as dotenv from "dotenv";
dotenv.config();

import { RecordsModel } from "../models/Records.js";

const router = express.Router();

// Retrieve all records
router.get('/records', async (req, res) => {
  try {
    const records = await RecordsModel.find();
    res.json(records);
  } catch (error) {
    console.error('Error retrieving records', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve a specific record
router.get('/records/:recordId', async (req, res) => {
  const { recordId } = req.params;
  try {
    const record = await RecordsModel.findById(recordId);
    res.json(record);
  } catch (error) {
    console.error('Error retrieving record', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve therapist feedback for a specific record
router.get('/records/:recordId/feedback', async (req, res) => {
  const { recordId } = req.params;
  try {
    const record = await RecordsModel.findById(recordId);
    res.json({ feedback: record.feedback });
  } catch (error) {
    console.error('Error retrieving therapist feedback', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as recordRouter };
