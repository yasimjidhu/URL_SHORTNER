import { Schema, model, Document } from 'mongoose';

export interface IAnalytics extends Document {
  userId:string;
  alias: string;
  totalClicks: number;
  uniqueClicks: number;
  clicksByDate: Array<{ date: string; count: number }>;
  osType: Array<{ osName: string; uniqueClicks: number; uniqueUsers: number }>;
  deviceType: Array<{ deviceName: string; uniqueClicks: number; uniqueUsers: number }>;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  userId:{type:String,required:true},
  alias: { type: String, required: true },
  totalClicks: { type: Number, required: true },
  uniqueClicks: { type: Number, required: true },
  clicksByDate: [
    {
      date: { type: String, required: true },
      count: { type: Number, required: true },
    },
  ],
  osType: [
    {
      osName: { type: String, required: true },
      uniqueClicks: { type: Number, required: true },
      uniqueUsers: { type: Number, required: true },
    },
  ],
  deviceType: [
    {
      deviceName: { type: String, required: true },
      uniqueClicks: { type: Number, required: true },
      uniqueUsers: { type: Number, required: true },
    },
  ],
});

export const AnalyticsData = model<IAnalytics>('AnalyticsData', AnalyticsSchema);
