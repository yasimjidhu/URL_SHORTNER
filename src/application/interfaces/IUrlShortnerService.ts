export interface IUrlShortnerService{
    shortenUrl(longUrl:string,customAlias?:string,topic?:string):Promise<string>;
    redirectUrl(alias:string):Promise<string>
}