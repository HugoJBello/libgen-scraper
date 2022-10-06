



export interface ScrapingIndexI {
    dateScraping: Date;
    urlIndex: number;
    pageNewIndex: number;
    pageIndexSection: number;
    maxPages: number;
    search: string;
    reviewsSource: string;
    currentScrapingUrlList: string[];
    scraperId: string;
    deviceId: string;
    id:number;
    scrapingIteration:number;
}

export const joiningStr = "====="

