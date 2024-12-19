import { IUrlShortnerService } from "../interfaces/IUrlShortnerService";
import { ICacheService } from "../interfaces/ICacheService";
import { CreateShortUrlDTO } from "../dtos/CreateShortUrlDTO";
import { IAnalyticsService } from "../interfaces/IAnalyticsService";

export class ShortenUrlUseCase {
  constructor(
    private urlShortnerService: IUrlShortnerService,
    private cacheService: ICacheService,
    private analyticsService: IAnalyticsService
  ) {}

  async execute(createShortUrlDTO: CreateShortUrlDTO,userId:string): Promise<string> {
    const { longUrl, customAlias, topic } = createShortUrlDTO;

    // Check for cached URL
    const cachedUrl = await this.cacheService.get(longUrl);
    if (cachedUrl) {
      return cachedUrl;
    }

    // Shorten URL
    const shortUrl = await this.urlShortnerService.shortenUrl(longUrl, customAlias, topic);

    // Create initial analytics record
    await this.analyticsService.create({
      userId,
      alias: customAlias || shortUrl.split("/").pop()!, 
      topic,
      totalClicks: 1,
      uniqueClicks: 1,
      clicksByDate: [],
      osType: [],
      deviceType: [],
    });

    // Cache the shortened URL
    await this.cacheService.set(longUrl, shortUrl, 60 * 60); // Cache for 1 hour

    return shortUrl;
  }
}
