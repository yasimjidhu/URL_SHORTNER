import { IAnalyticsService } from "../interfaces/IAnalyticsService";

export class GetUrlAnalyticsUseCase{
    constructor(private analyticsService:IAnalyticsService){}
    
    async execute(alias:string):Promise<any>{
        return this.analyticsService.getUrlAnalytics(alias)
    }
}