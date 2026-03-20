import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPrediction extends Document {
  name: string;
  phone: string;
  email: string;
  finalsMVP: string;
  finalScore: string;
  playInSelections: {
    westSunsVsClippersWinner: string;
    westWarriorsVsBlazersWinner: string;
    westEighthSeedWinner: string;
    eastHeatVsHawksWinner: string;
    east76ersVsHornetsWinner: string;
    eastEighthSeedWinner: string;
  };
  bracketSelections: any; 
  champion: string;
  createdAt: Date;
}

const PredictionSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  finalsMVP: { type: String, required: true },
  finalScore: { type: String, required: true },
  playInSelections: {
    westSunsVsClippersWinner: { type: String, required: true },
    westWarriorsVsBlazersWinner: { type: String, required: true },
    westEighthSeedWinner: { type: String, required: true },
    eastHeatVsHawksWinner: { type: String, required: true },
    east76ersVsHornetsWinner: { type: String, required: true },
    eastEighthSeedWinner: { type: String, required: true },
  },
  bracketSelections: { type: Schema.Types.Mixed, required: true },
  champion: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Prediction || mongoose.model<IPrediction>('Prediction', PredictionSchema);
