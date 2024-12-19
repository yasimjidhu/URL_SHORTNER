// Routes/AnalyticsRoutes.ts
import { Router } from "express";
import { AnalyticsController } from "../controllers/AnalyticsController";
import { AnalyticsService } from "../../application/services/AnalyticsService";
import { AnalyticsRepository } from "../../infrastructure/repositories/AnalyticalRepository";
import { authenticate } from "../middleware/AuthMiddleware";

const analyticsRepository = new AnalyticsRepository();
const analyticsService = new AnalyticsService(analyticsRepository);
const analyticsController = new AnalyticsController(analyticsService);

const router = Router();

router.get("/",authenticate, analyticsController.getUrlAnalytics.bind(analyticsController));
router.get("/topic",authenticate, analyticsController.getTopicAnalytics.bind(analyticsController));
router.get("/overall",authenticate, analyticsController.getOverallAnalytics.bind(analyticsController));

export default router