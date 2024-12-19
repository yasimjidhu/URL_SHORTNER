import { IAnalyticsService } from "../interfaces/IAnalyticsService";
import { IAnalyticsRepository } from "../../domain/repositories/IAnalyticsRepository";
import { Analytics } from "../../domain/entities/Analytics";
import { TopicAnalytics } from "../../domain/entities/TopicAnalytics";

export class AnalyticsService implements IAnalyticsService {
  constructor(private analyticsRepository: IAnalyticsRepository) {}

  async create(analytics: Analytics): Promise<Analytics> {
    return await this.analyticsRepository.create(analytics);
  }
  
  async logRedirectEvent(data: {
    alias: string;
    timestamp: string;
    userAgent: string;
    ip: string;
    geolocation: any;
    userExist:boolean;
  }): Promise<void> {
    await this.analyticsRepository.update(data);
  }

  async getUrlAnalytics(alias: string): Promise<Analytics> {
    const analytics = await this.analyticsRepository.getAnalyticsForUrl(alias);
    if (!analytics) {
      throw new Error("Analytics data not found for this alias.");
    }
    return analytics;
  }

  async getTopicAnalytics(topic: string): Promise<TopicAnalytics> {
    const topicAnalytics = await this.analyticsRepository.getAnalyticsByTopic(topic);
    if (!topicAnalytics) {
      throw new Error("Analytics data not found for this topic.");
    }
    return topicAnalytics;
  }

  async getOverallAnalytics(userId: string): Promise<any> {
    return await this.analyticsRepository.getOverallAnalytics(userId);
  }
}