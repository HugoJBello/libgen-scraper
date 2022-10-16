
import {ScrapingIndexI} from "../models/ScrapingIndex";
import {IndexScraper} from "./IndexScraper";

export class LibgenIndexScraper extends IndexScraper {
    public maxPages: number

    public urls:string[] = []
    public urlPrefixes:string[] = []
    public baseLibgenUrl: string = "http://libgen.st/search.php?req="

    constructor(baseLibgenUrl: string) {
        super();
        this.baseLibgenUrl = baseLibgenUrl
    }

    async extractNewsUrlsInSectionPageFromIndexOneIteration (scrapingIndex: ScrapingIndexI): Promise<string[]> {    
        const currentUrl = this.getCurrentUrl(scrapingIndex.search)
        const extractedUrls = await this.extractUrlsFromStartingUrl(currentUrl)
        const uniqUrls = [...new Set(extractedUrls)];
        return uniqUrls
    }

    getCurrentUrl(search: string): string{
        let searchParam = search
        if(search.includes(" ")){
            searchParam = search.replace("/\s/g", "+")
        }
        return this.baseLibgenUrl + searchParam
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
        //http://libgen.st/search.php?req=karl+jung

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


    async extractUrlsFromPage(): Promise<string[]>{

        const hrefs = await this.page.$x("//a[contains(text(), '[1]')]");

        const urls = []
        for (const hrefv of hrefs){
            let url = await this.page.evaluate((a:any) => a.href, hrefv);
            urls.push(url)
        }
 
        //return urls.filter((href: string) => {
        //    return date_regex.test(href) && this.checkCorrectUrl(href)
        //})

        return urls
    }

}
