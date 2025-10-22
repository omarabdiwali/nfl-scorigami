import mongoose from "mongoose";

const NBAScoreSchema = new mongoose.Schema({
  score: {
    type: String,
    required: true,
    unique: true
  },
  versus: String,
  date: Date,
  count: Number
});

export default mongoose.models.NBAScores || mongoose.model("NBAScores", NBAScoreSchema);