export class Url {
    constructor(
      public longUrl: string,
      public shortUrl: string,
      public alias: string,
      public clicks: number,
      public createdAt: Date,
      public topic: string
    ) {}
  }
  