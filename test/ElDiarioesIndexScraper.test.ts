
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {LibgenIndexScraper} from "../src/scrapers/LibgenIndexScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('ElDiarioesIndexScraper 1', function () {
    describe('ElDiarioesIndexScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {
            urlIndex: 1, pageNewIndex: 2, startingUrls: ["https://www.eldiario.es/",]
        } as unknown as ScrapingIndexI

        const scraper = new LibgenIndexScraper();
        scraper.maxPages=1


        it('ElDiarioesIndexScraper', async function () {
            testIndex.pageNewIndex = 1
            testIndex.urlIndex = 0
            const result = await scraper.extractNewsUrlsInSectionPageFromIndexOneIteration(testIndex);
            console.log(result);
            console.log(scraper.scrapingIndex);
            expect(result).not.to.equal(undefined)
            expect(scraper.scrapingIndex.pageNewIndex).to.greaterThan(2)
        });
    });
});