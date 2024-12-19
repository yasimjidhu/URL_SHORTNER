import { Request, Response } from 'express';
import geoip from 'geoip-lite'
import { ShortenUrlUseCase } from '../../application/use-cases/ShortenUrlUseCase';
import { RedirectUrlUseCase } from '../../application/use-cases/RedirectUrlUseCase';
import { CreateShortUrlDTO } from '../../application/dtos/CreateShortUrlDTO';
import { IAnalyticsService } from '../../application/interfaces/IAnalyticsService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class UrlController {
  constructor(
    private shortenUrlUseCase: ShortenUrlUseCase,
    private redirectUrlUseCase: RedirectUrlUseCase,
    private analyticsService:IAnalyticsService,
    private userRepository:IUserRepository
  ) {}

  async shortenUrl(req: Request, res: Response): Promise<void> {
    const createShortUrlDTO: CreateShortUrlDTO = req.body;
    const userId = (req.user as { id: string })?.id;

    try {
      const shortUrl = await this.shortenUrlUseCase.execute(createShortUrlDTO,userId);
      res.json({ shortUrl });
    } catch (err:any) {
      res.status(500).json({ error: err.message });
    }
  }

  async redirectUrl(req: Request, res: Response): Promise<void> {
    const  alias  = req.query.alias as string;
    try {

      const originalUrl = await this.redirectUrlUseCase.execute(alias);

      // log analytics data
      const userAgent = req.headers["user-agent"]||"unknown";
      const ip = req.ip || "0.0.0.0";
      const geo = geoip.lookup(ip)

      const email = (req.user as { email: string })?.email;

      const existingUser = await this.userRepository.findByEmail(email)

      const analytics = {
        alias,
        timestamp:new Date().toISOString(),
        userAgent,
        ip,
        geolocation:geo||null,
        userExist:existingUser?true:false
      } 

      await this.analyticsService.logRedirectEvent(analytics)
      res.redirect(originalUrl);
    } catch (err:any) {
      console.log(err)
      res.status(404).json({ error: 'Alias not found' });
    }
  }
}
