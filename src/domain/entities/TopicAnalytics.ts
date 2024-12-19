export class TopicAnalytics{
    constructor(
        public topic:string,
        public totalClicks:number,
        public uniqueClicks:number,
        public clicksByDate:Array<{date:string;count:number}>,
        public urls:Array<{shortUrl:string;totalClicks:number;uniqueClicks:number}>
    ){}
}