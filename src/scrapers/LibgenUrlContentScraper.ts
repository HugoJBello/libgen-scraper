import {PuppeteerScraper} from './PuppeteerScraper'
import htmlToText from 'html-to-text'
import {DocumentUrlContentI} from "../models/DocumentUrlContentI";
import {ScrapingIndexI} from "../models/ScrapingIndex";
import {ContentScraper} from "./ContentScraper";
import {v4} from 'uuid'
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown'
import http from 'http'; // or 'https' for https:// URLs
import fs from 'fs';


export class LibgenUrlContentScraper extends ContentScraper {
    public timeWaitStart: number
    public timeWaitClick: number
    public search: string
    public scraperId: string

    constructor() {
        super();
        this.timeWaitStart = 1 * 1000
        this.timeWaitClick = 500
    }

    checkCorrectUrl(url:string) {
            return true
    }

    async extractNewInUrl(documentUrl: string, search: string, scrapingId:string, newsIndex:number, scrapingIteration: number): Promise<DocumentUrlContentI> {

        console.log("\n---");
        console.log("extracting full new in url:")
        console.log(documentUrl);
        console.log("---");

        if (!this.checkCorrectUrl(documentUrl)){
            console.log("INCORRECT url ", documentUrl);
            return {} as DocumentUrlContentI
        }




        try {
            await this.initializePuppeteer();
        } catch (e) {
            console.log("error initializing")
        }



        try {
            try {
                await this.page.goto(documentUrl, {waitUntil: 'load', timeout: 0});
            } catch (e) {
                return {} as DocumentUrlContentI
            }


        const urls = await this.extractUrlsFromPage()
        console.log(urls)
        const downloadUrl = urls[0]

        const filename = decodeURI(downloadUrl.split("/")[ downloadUrl.split("/").length -1])

        const date = new Date
        const id = v4()
        
        const result = {id, search, documentUrl, date, scrapedAt: date, downloadUrl, filename} as DocumentUrlContentI

        console.log(result)

        return result
        
        } catch (err) {
            console.log(err);
            await this.page.screenshot({path: 'error_extract_new.png'});
            await this.browser.close();
            return null;
        }
    }


    delay(time:number) {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
     }

    async extractUrlsFromPage(): Promise<string[]>{
        //await this.page.waitForSelector('h2')
        //await this.delay(4000)
        let hrefs = await this.page.$$('h2>a')
        const urls = []
        for (const hrefv of hrefs){
            let url = await this.page.evaluate((a:any) => a.href, hrefv);
            urls.push(url)
        }
        
        return urls
    }

     async download(url:string, filename:string): Promise<void>{
        console.log("---------------------------------")
        console.log("starting downloading url ", url)
        console.log("---------------------------------")

        const file = fs.createWriteStream(filename);
        const request = http.get(url, function(response) {
        response.pipe(file)
        return new Promise((resolve, reject) => {
            file.on("finish", () => {
                file.close();
                console.log("---------------------------------")
                console.log("Download Completed");
                console.log("---------------------------------")
        
                resolve("OK")
            });
        })
        });
     }

}
