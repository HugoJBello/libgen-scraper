
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {LibgenIndexScraper} from "../src/scrapers/LibgenIndexScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('LibgenIndexScraper 1', function () {
    describe('LibgenIndexScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {
            urlIndex: 0, pageNewIndex: 0, currentScrapingUrlList: ["http://libgen.st/search.php?req=karl+jung"]
        } as unknown as ScrapingIndexI

        const scraper = new LibgenIndexScraper();
        scraper.maxPages=1


        it('LibgenIndexScraper', async function () {
            testIndex.pageNewIndex = 1
            testIndex.urlIndex = 0
            testIndex.pageIndexSection = 0
            const result = await scraper.extractNewsUrlsInSectionPageFromIndexOneIteration(testIndex);
            console.log(result);
            console.log(scraper.scrapingIndex);
            expect(result).not.to.equal(undefined)
            //expect(scraper.scrapingIndex.pageNewIndex).to.greaterThan(2)
        });
    });
});