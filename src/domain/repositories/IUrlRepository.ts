import { Url } from '../entities/Url';

export interface IUrlRepository {
  create(longUrl:string,alias:string,shortUrl:string,topic:string): Promise<Url>;
  findByAlias(alias: string): Promise<Url | null>;
  findByLongUrl(longUrl: string): Promise<Url | null>;
  updateClicks(alias: string): Promise<Url | null>;
}
