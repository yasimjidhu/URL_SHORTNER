export class Analytics {
  constructor(
    public userId:string,
    public alias: string,
    public topic:string,
    public totalClicks: number,
    public uniqueClicks: number,
    public clicksByDate: Array<{ date: string; count: number }>,
    public osType?: Array<{ osName: string; uniqueClicks: number; uniqueUsers: number }>,
    public deviceType?: Array<{ deviceName: string; uniqueClicks: number; uniqueUsers: number }>
  ) {}
}