
import {PuppeteerScraper} from "./PuppeteerScraper";
import {DocumentUrlContentI} from "../models/DocumentUrlContentI";
import {ScrapingIndexI} from "../models/ScrapingIndex";

export class ContentScraper extends PuppeteerScraper {

    async extractNewInUrl(documentUrl: string, search: string, scrapingId:string, newsIndex:number, scrapingIteration: number): Promise<DocumentUrlContentI> {
        return {} as DocumentUrlContentI
    }
}