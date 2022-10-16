import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {LibgenUrlContentScraper} from "../src/scrapers/LibgenUrlContentScraper";
import {DownloaderUrl} from "../src/scrapers/DownloaderUrl";
import { expect } from 'chai';

require('dotenv').config();

describe('LibgenUrlContentScraper 1', function () {
    describe('LibgenUrlContentScraper 2', function () {
        this.timeout(9999999);

        const scraper = new LibgenUrlContentScraper();
        const downloader = new DownloaderUrl()

        it('LibgenUrlContentScraper', async function () {

            const url = "http://library.lol/main/9799EA26FC187C607FF2EF7A1C62D9FD"
            const result = await scraper.extractNewInUrl(url, "", "", 0, 0);
            console.log(result);


            await scraper.browser.close();

            await downloader.download(result.downloadUrl, result.filename)
            
            expect(result).to.have.property("downloadUrl")
            

            expect(result.downloadUrl).not.equal(null)
            
        });
    });
});