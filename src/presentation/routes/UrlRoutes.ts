import { Router } from 'express';
import UrlModel from '../../infrastructure/database/models/UrlModel';
import { authenticate } from '../middleware/AuthMiddleware';
import { rateLimiter } from '../middleware/RateLimitter';
import { UrlController } from '../controllers/UrlController';
import { RedisCache } from '../../infrastructure/cache/RedisCache';
import { ShortenUrlUseCase } from '../../application/use-cases/ShortenUrlUseCase';
import { RedirectUrlUseCase } from '../../application/use-cases/RedirectUrlUseCase';
import { UrlShortenerService } from '../../application/services/UrlShortnerService';
import { UrlRepository } from '../../infrastructure/repositories/ShortUrlRepository';
import { AnalyticsData } from '../../infrastructure/database/models/AnalyticsModel';
import { AnalyticsService } from '../../application/services/AnalyticsService';
import { AnalyticsRepository } from '../../infrastructure/repositories/AnalyticalRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepositoryImpl';

const router = Router();

//repositories
const urlRepository = new UrlRepository(AnalyticsData,UrlModel)
const userRepository = new UserRepository()
const analyticsRepository = new AnalyticsRepository()

// services
const urlShortnerService = new UrlShortenerService(urlRepository)
const analyticsService = new AnalyticsService(analyticsRepository)
const cacheService = new RedisCache()


// use cases
const shortenUrlUseCase = new ShortenUrlUseCase(urlShortnerService,cacheService,analyticsService)
const redirectUrlUseCase = new RedirectUrlUseCase(urlShortnerService)
const urlController = new UrlController(shortenUrlUseCase,redirectUrlUseCase,analyticsService,userRepository)


// routes for URL shortening and redirection
router.post('/shorten',authenticate,rateLimiter, urlController.shortenUrl.bind(urlController));
router.get('/shorten',authenticate,rateLimiter,urlController.redirectUrl.bind(urlController));

export default router;
