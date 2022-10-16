

export interface ScrapingConfigI{
    scraperId: string;
    apiUrl: string;
    appId: string;
    deviceId:string;
    searches:string[];
    useSqliteDb: boolean;
    useMongoDb: boolean;
    scrapingSettings: Map<string, ScrapingSettings>;

}

export interface ScrapingSettings{
    maxPages: number;
    startingUrls:string[];
}
