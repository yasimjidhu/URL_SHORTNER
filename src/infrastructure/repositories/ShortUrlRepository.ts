import { Model } from 'mongoose';
import { Analytics } from '../../domain/entities/Analytics';
import { IUrlRepository } from '../../domain/repositories/IUrlRepository';
import { IAnalytics } from '../database/models/AnalyticsModel';
import { Url as DomainUrl, Url } from '../../domain/entities/Url';
import { IUrl } from '../database/models/UrlModel';

export class UrlRepository implements IUrlRepository {

  private analyticsModel: Model<IAnalytics>;
  private shortUrlModel: Model<IUrl>;

  constructor(analyticsModel: Model<IAnalytics>, shortUrlModel: Model<IUrl>) {
    this.analyticsModel = analyticsModel;
    this.shortUrlModel = shortUrlModel;
  }

  // Create a new short URL entry in the database
  async create(longUrl:string,alias:string,shortUrl:string,topic:string): Promise<DomainUrl> {
    const newUrl = await this.shortUrlModel.create({
      longUrl: longUrl,
      shortUrl: shortUrl,
      alias,
      topic: topic,
      createdAt: new Date(),
    });

    return new DomainUrl(
      newUrl.longUrl,
      newUrl.shortUrl,
      newUrl.alias,
      newUrl.clicks,
      newUrl.createdAt,
      newUrl.topic,
    );
  }

   // Method to increment the clicks
   async updateClicks(alias: string): Promise<Url | null> {
    const url = await this.shortUrlModel.findOneAndUpdate(
      { alias },
      { $inc: { clicks: 1 } },  // Increment clicks by 1
      { new: true }  
    ).exec();

    if (url) {
      return new Url(url.longUrl, url.shortUrl, url.alias, url.clicks, url.createdAt, url.topic);
    }
    return null;
  }

  // Find URL by alias (shortUrl)
  async findByAlias(alias: string): Promise<Url | null> {
    const url = await this.shortUrlModel.findOne({ alias }).exec();

    if (url) {
      return new Url(url.longUrl, url.shortUrl, url.alias,url.clicks, url.createdAt,url.topic);
    }
    return null;
  }

  async findByLongUrl(longUrl: string): Promise<Url | null> {
    const url = await this.shortUrlModel.findOne({ longUrl }).exec();
    if (url) {
      return new Url(url.longUrl, url.shortUrl, url.alias,url.clicks, url.createdAt, url.topic);
    }
    return null;
  }

  // Get analytics data for a specific alias (shortUrl)
  async getAnalyticsByAlias(alias: string): Promise<Analytics | null> {
    const analyticsDoc = await this.analyticsModel.findOne({ alias }).exec();
    if (analyticsDoc) {
      return new Analytics(
        analyticsDoc.userId,
        analyticsDoc.alias,
        analyticsDoc.totalClicks,
        analyticsDoc.uniqueClicks,
        analyticsDoc.clicksByDate,
        analyticsDoc.osType,
        analyticsDoc.deviceType
      );
    }
    return null;
  }

  // Get total clicks within a date range for a specific alias
  async getTotalClicksByDate(alias: string, startDate: string, endDate: string): Promise<number> {
    const result = await this.analyticsModel.aggregate([
      {
        $match: {
          alias,
          date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: '$clicks' }
        }
      }
    ]);

    return result[0]?.totalClicks || 0;
  }

  // Get unique clicks by OS for a specific alias
  async getUniqueClicksByOS(alias: string): Promise<{ osName: string; uniqueClicks: number; uniqueUsers: number }[]> {
    return await this.analyticsModel.aggregate([
      { $match: { alias } },
      {
        $group: {
          _id: '$osName',
          uniqueClicks: { $sum: 1 },
          uniqueUsers: { $sum: '$uniqueUsers' }
        }
      }
    ]);
  }

  // Get unique clicks by Device for a specific alias
  async getUniqueClicksByDevice(alias: string): Promise<{ deviceName: string; uniqueClicks: number; uniqueUsers: number }[]> {
    return await this.analyticsModel.aggregate([
      { $match: { alias } },
      {
        $group: {
          _id: '$deviceName',
          uniqueClicks: { $sum: 1 },
          uniqueUsers: { $sum: '$uniqueUsers' }
        }
      }
    ]);
  }

  // Get total clicks for a specific alias
  async getTotalClicks(alias: string): Promise<number> {
    const result = await this.analyticsModel.aggregate([
      { $match: { alias } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: '$clicks' }
        }
      }
    ]);
    return result[0]?.totalClicks || 0;
  }

  // Get unique clicks (distinct users) for a specific alias
  async getUniqueClicks(alias: string): Promise<number> {
    const result = await this.analyticsModel.aggregate([
      { $match: { alias } },
      {
        $group: {
          _id: null,
          uniqueClicks: { $sum: '$uniqueUsers' }
        }
      }
    ]);
    return result[0]?.uniqueClicks || 0;
  }
}
