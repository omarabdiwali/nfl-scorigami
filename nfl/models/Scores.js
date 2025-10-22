import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
  score: {
    type: String,
    required: true,
    unique: true
  },
  versus: String,
  date: Date,
  count: Number
});

export default mongoose.models.Scores || mongoose.model("Scores", ScoreSchema);