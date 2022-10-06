import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {LibgenUrlContentScraper} from "../src/scrapers/LibgenUrlContentScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('LibgenUrlContentScraper 1', function () {
    describe('LibgenUrlContentScraper 2', function () {
        this.timeout(9999999);

        const scraper = new LibgenUrlContentScraper();

        it('LibgenUrlContentScraper', async function () {

            const url = "http://library.lol/main/9799EA26FC187C607FF2EF7A1C62D9FD"
            const result = await scraper.extractNewInUrl(url, "", "", 0, 0);
            console.log(result);
            expect(result).to.have.property("downloadUrl")


            expect(result.downloadUrl).not.equal(null)
            
        });
    });
});