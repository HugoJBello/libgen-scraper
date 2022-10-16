
import {ScrapingIndexI} from "../models/ScrapingIndex";
import {IndexScraper} from "./IndexScraper";

export class LibgenIndexScraper extends IndexScraper {
    public timeWaitStart: number
    public timeWaitClick: number
    public maxPages: number

    public urls:string[] = []
    public urlPrefixes:string[] = []

    constructor() {
        super();
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
    }

    async extractNewsUrlsInSectionPageFromIndexOneIteration (scrapingIndex: ScrapingIndexI): Promise<string[]> {
        this.scrapingIndex.pageIndexSection = 1
    
        const currentUrl = scrapingIndex.currentScrapingUrlList[this.scrapingIndex.urlIndex]
        const extractedUrls = await this.extractUrlsFromStartingUrl(currentUrl)
        const uniqUrls = [...new Set(extractedUrls)];
        return uniqUrls
    }

    checkCorrectUrl(url:string) {
            return true
    }

    async extractUrlsFromStartingUrl(url: string): Promise<string[]> {
            try {
                const urls = await this.extractUrlsInPage(url)
                //this.urls = this.urls.concat(urls)
                this.urls = urls
            } catch (e) {
                console.log(e)
                return this.urls
            }

        return this.urls
    }

    async extractUrlsInPage (url: string):Promise<string[]>{
        // https://www.eldiario.es/
        const pageUrl = url

        console.log("\n************");
        console.log("extracting full index in url:")
        console.log(pageUrl);
        console.log("************");
        const urls: string[] = []

        await this.initializePuppeteer();

        try {
            await this.page.goto(pageUrl, {waitUntil: 'load', timeout: 0});

            const urlsInPage = await  this.extractUrlsFromPage();

            await this.browser.close();

            return urlsInPage

        } catch (err) {
            console.log(err);
            await this.page.screenshot({ path: 'error_extract_new.png' });
            await this.browser.close();
            throw err
        }
    }

    async clickOkButtonCookie () {
        try {
            const frame = this.page.frames()
            //frame[2].click('button[title="Fine By Me!"]');
        } catch (e) {

        }
    }

    async extractUrlsFromPage(): Promise<string[]>{
        let hrefs = await this.page.$$('h2>a')
        const urls = []
        for (const hrefv of hrefs){
            let url = await this.page.evaluate((a:any) => a.href, hrefv);
            urls.push(url)
        }
 
        const date_regex = /[0-9]{7}.html$/
        //_9282003.html

        return urls.filter((href: string) => {
            return date_regex.test(href) && this.checkCorrectUrl(href)
        })
    }

}
