import { Request, Response } from "express";
import { IAnalyticsService } from "../../application/interfaces/IAnalyticsService";

export class AnalyticsController {
  constructor(private analyticsService: IAnalyticsService) {}

  async getUrlAnalytics(req: Request, res: Response): Promise<any> {
    try {
      const alias = req.query.alias as string;
      const analytics = await this.analyticsService.getUrlAnalytics(alias);
      return res.status(200).json(analytics);
    } catch (error:any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async getTopicAnalytics(req: Request, res: Response): Promise<any> {
    try {
      const topic = req.query.topic as string;
      const topicAnalytics = await this.analyticsService.getTopicAnalytics(topic);
      return res.status(200).json(topicAnalytics);
    } catch (error:any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async getOverallAnalytics(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req.user as { id: string })?.id;
      const overallAnalytics = await this.analyticsService.getOverallAnalytics(userId);
      return res.status(200).json(overallAnalytics);
    } catch (error:any) {
      return res.status(404).json({ error: error.message });
    }
  }
}
