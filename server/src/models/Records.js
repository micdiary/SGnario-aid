import mongoose from "mongoose";

const RecordSchema = new mongoose.Schema({
  video_id: {
    type: String,
    required: true
  },
  self_score: {
    type: Number,
    required: true
  },
  therapist_score: {
    type: Number,
    required: true
  },
  feedback: {
    type: String,
    required: true
  }
});

export const RecordsModel = mongoose.model("records", RecordSchema);
