import mongoose, { Schema, Document } from 'mongoose';

// IUrl interface representing the Mongoose document shape
export interface IUrl extends Document {
  longUrl: string;
  shortUrl: string; 
  alias: string;  
  clicks: number;
  topic: string;
  createdAt: Date;
}

// URL schema definition
const urlSchema = new Schema<IUrl>({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  alias: { type: String },
  clicks: { type: Number, default: 0 },
  topic: { type: String, required: false },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});


// URL model
const UrlModel = mongoose.model<IUrl & Document>('Url', urlSchema);

export default UrlModel;
