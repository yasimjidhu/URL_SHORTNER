import shortid from 'shortid';
import config from '../../config/env'
import { IUrlShortnerService } from "../interfaces/IUrlShortnerService";
import { IUrlRepository } from '../../domain/repositories/IUrlRepository';

export class UrlShortenerService implements IUrlShortnerService {
  private static readonly BASE_URL = config.baseUrl;


  constructor(private urlRepository: IUrlRepository) {
    this.urlRepository = urlRepository
  }

  async shortenUrl(longUrl: string, customAlias?: string, topic: string = 'general'): Promise<string> {

    // Validate the input URL
    if (!this.isValidUrl(longUrl)) {
      throw new Error('Invalid URL provided');
    }

    // Use the provided alias or generate a new one
    const alias = customAlias || shortid.generate();

    const shortUrl = `${UrlShortenerService.BASE_URL}/${alias}`;

    try {

      await this.urlRepository.create(
        longUrl,
        alias,
        shortUrl,
        topic,
      );

      return shortUrl;
    } catch (error: any) {
      console.error('Error creating shortened URL:', error.message);
      throw new Error('Could not create the shortened URL. Please try again.');
    }
  }


  async redirectUrl(alias: string): Promise<string> {
    if (!alias) {
      throw new Error('alias is required for redirection');
    }

    try {
      // Fetch the original URL from the repository
      const urlMapping = await this.urlRepository.findByAlias(alias);

      if (!urlMapping) {
        throw new Error('Shortened URL not found');
      }

      // Increment the clicks field
      urlMapping.clicks = (urlMapping.clicks || 0) + 1;

      // Increment the clicks field
      await this.urlRepository.updateClicks(alias);

      return urlMapping.longUrl;
    } catch (error: any) {
      console.error('Error fetching original URL:', error.message);
      throw new Error('Could not fetch the original URL. Please try again.');
    }
  }

  private isValidUrl(urlString: string): boolean {
    try {
      new URL(urlString);
      return true;
    } catch (_) {
      return false;
    }
  }
}
