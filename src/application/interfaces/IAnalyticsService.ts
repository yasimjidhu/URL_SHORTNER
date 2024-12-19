import { Analytics } from "../../domain/entities/Analytics";
import { TopicAnalytics } from "../../domain/entities/TopicAnalytics";

export interface IAnalyticsService {
  create(analytics:Analytics):Promise<Analytics>
  logRedirectEvent(data: {
    alias: string;
    timestamp: string;
    userAgent: string;
    ip: string;
    geolocation: any;
    userExist:boolean;
  }): Promise<void>
  getUrlAnalytics(alias: string): Promise<Analytics>;
  getTopicAnalytics(topic: string): Promise<TopicAnalytics>;
  getOverallAnalytics(userId: string): Promise<any>;
}