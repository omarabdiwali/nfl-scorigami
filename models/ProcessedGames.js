import mongoose from 'mongoose';

const ProcessedGamesSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
});

export default mongoose.models.ProcessedGames || mongoose.model('ProcessedGames', ProcessedGamesSchema);