export interface AnalyticsResponseDTO {
    totalClicks: number;
    uniqueClicks: number;
    clicksByDate: Array<{ date: string; count: number }>;
  }
  