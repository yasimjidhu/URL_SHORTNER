import { IAnalyticsRepository } from "../../domain/repositories/IAnalyticsRepository";
import { Analytics } from "../../domain/entities/Analytics";
import { TopicAnalytics } from "../../domain/entities/TopicAnalytics";
import { AnalyticsData } from "../database/models/AnalyticsModel";

export class AnalyticsRepository implements IAnalyticsRepository {

    async create(analytics: Analytics): Promise<Analytics> {
        const newAnalyticsData = new AnalyticsData({
            userId:analytics.userId,
            alias: analytics.alias,
            topic:analytics.topic,
            totalClicks: analytics.totalClicks,
            uniqueClicks: analytics.uniqueClicks,
            clicksByDate: analytics.clicksByDate,
            osType: analytics.osType || [],
            deviceType: analytics.deviceType || [],
        });

        const savedData = await newAnalyticsData.save();

        return new Analytics(
            savedData.userId,
            savedData.alias,
            savedData.topic,
            savedData.totalClicks,
            savedData.uniqueClicks,
            savedData.clicksByDate,
            savedData.osType,
            savedData.deviceType
        );
    }

    async update(data: {
        alias: string;
        timestamp: string;
        userAgent: string;
        ip: string;
        geolocation: any;
        userExist: boolean;
    }): Promise<void> {
        const osName = this.parseOS(data.userAgent);
        const deviceName = this.parseDevice(data.userAgent);
    
        const updateFields: any = {
            $push: {
                clicksByDate: {
                    date: data.timestamp,
                    count: 1,
                },
            },
            // Increment totalClicks for every click
            $inc: {
                totalClicks: 1,
            },
        };
    
        if (data.userExist) {
            // For existing users, we should NOT increment uniqueClicks for that user
            updateFields.$addToSet = {
                osType: {
                    osName,
                    uniqueClicks: 1, 
                    uniqueUsers: 1,   
                },
                deviceType: {
                    deviceName,
                    uniqueClicks: 1,  
                    uniqueUsers: 1,   
                },
            };
        } else {
            // For new users, initialize uniqueClicks to 1 and increment uniqueUsers and global uniqueClicks
            updateFields.$inc.uniqueClicks = 1;  
            updateFields.$inc.uniqueUsers = 1;   
    
            updateFields.$addToSet = {
                osType: {
                    osName,
                    uniqueClicks: 1,  
                    uniqueUsers: 1,  
                },
                deviceType: {
                    deviceName,
                    uniqueClicks: 1,  
                    uniqueUsers: 1,   
                },
            };
        }
    
        // Update the analytics collection
        await AnalyticsData.updateOne(
            { alias: data.alias },
            updateFields,
            { upsert: true }
        );
    }
    
    
    private parseOS(userAgent: string): string {
        if (/windows/i.test(userAgent)) {
            return "Windows";
        } else if (/macintosh|mac os x/i.test(userAgent)) {
            return "MacOS";
        } else if (/linux/i.test(userAgent)) {
            return "Linux";
        } else if (/android/i.test(userAgent)) {
            return "Android";
        } else if (/iphone|ipad|ipod/i.test(userAgent)) {
            return "iOS";
        } else {
            return "Unknown OS";
        }
    }

    private parseDevice(userAgent: string): string {
        if (/mobile/i.test(userAgent)) {
            if (/iphone|ipad|ipod/i.test(userAgent)) {
                return "Apple Mobile Device";
            } else if (/android/i.test(userAgent)) {
                return "Android Mobile Device";
            } else {
                return "Other Mobile Device";
            }
        } else if (/tablet/i.test(userAgent)) {
            return "Tablet";
        } else if (/desktop|macintosh|windows|linux/i.test(userAgent)) {
            return "Desktop";
        } else {
            return "Unknown Device";
        }
    }

    async getAnalyticsForUrl(alias: string): Promise<Analytics | null> {
        const data = await AnalyticsData.findOne({ alias });
        if (!data) return null;

        return new Analytics(
            data.userId,
            data.alias,
            data.topic,
            data.totalClicks,
            data.uniqueClicks,
            data.clicksByDate,
            data.osType,
            data.deviceType
        );
    }

    async getAnalyticsByTopic(topic: string): Promise<TopicAnalytics | null> {

        const data = await AnalyticsData.aggregate([
            { $match: { topic } },
            {
                $group: {
                    _id: "$topic",
                    totalClicks: { $sum: "$totalClicks" },
                    uniqueClicks: { $sum: "$uniqueClicks" },
                    clicksByDate: { $push: "$clicksByDate" },
                    urls: {
                        $push: {
                            shortUrl: "$alias",
                            totalClicks: "$totalClicks",
                            uniqueClicks: "$uniqueClicks",
                        },
                    },
                },
            },
        ]);

        if (!data[0]) return null;
        return new TopicAnalytics(
            topic,
            data[0].totalClicks,
            data[0].uniqueClicks,
            data[0].clicksByDate,
            data[0].urls
        );
    }

    async getOverallAnalytics(userId: string): Promise<any> {

        return await AnalyticsData.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: "$userId",
                    totalUrls: { $sum: 1 },
                    totalClicks: { $sum: "$totalClicks" },
                    uniqueClicks: { $sum: "$uniqueClicks" },
                    clicksByDate: { $push: "$clicksByDate" },
                    osType: { $push: "$osType" },
                    deviceType: { $push: "$deviceType" },
                },
            },
        ]);
    }
}