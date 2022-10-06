
import {PuppeteerScraper} from "./PuppeteerScraper";
import {ScrapingIndexI} from "../models/ScrapingIndex";

export class IndexScraper extends PuppeteerScraper {
    public scrapingIndex: ScrapingIndexI

    async extractNewsUrlsInSectionPageFromIndexOneIteration (scrapingIndex: ScrapingIndexI): Promise<string[]> {
        return []
    }
}