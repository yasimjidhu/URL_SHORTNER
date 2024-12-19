import { Analytics } from '../entities/Analytics';
import { TopicAnalytics } from '../entities/TopicAnalytics';

export interface IAnalyticsRepository {
  create(analytics:Analytics):Promise<Analytics>
  update(data: {
    alias: string;
    timestamp: string;
    userAgent: string;
    ip: string;
    geolocation: any;
    userExist:boolean;
  }): Promise<void>;
  getAnalyticsForUrl(alias: string): Promise<Analytics | null>;
  getAnalyticsByTopic(topic: string): Promise<TopicAnalytics | null>;
  getOverallAnalytics(userId: string): Promise<any>;
}