import { IUrlShortnerService } from "../interfaces/IUrlShortnerService";

export class RedirectUrlUseCase{
    constructor(private urlShortnerService:IUrlShortnerService){}

    async execute(alias:string):Promise<string>{
        return this.urlShortnerService.redirectUrl(alias)
    }
}