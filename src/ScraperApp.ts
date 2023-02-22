import {
    ScrapingIndexI,
} from './models/ScrapingIndex';

import {ContentScraper} from "./scrapers/ContentScraper";
import {IndexScraper} from "./scrapers/IndexScraper";

import scrapingConfig from './config/scrapingConfigFull.json';

import PersistenceManager from "./PersistenceManager";
import {GlobalConfigI} from "./models/GlobalConfig";

import { initDb } from './models/sequelizeConfig';
import { LibgenIndexScraper } from './scrapers/LibgenIndexScraper';
import { LibgenUrlContentScraper } from './scrapers/LibgenUrlContentScraper';
import { DownloaderUrl } from './scrapers/DownloaderUrl';
import ConfigManager from './ConfigManager';

require('dotenv').config();


export interface ScraperTuple {
    pageScraper: ContentScraper;
    urlSectionExtractorScraper: IndexScraper;
}

export default class ScraperApp {
    public config: any = scrapingConfig as any

    public scrapers: ScraperTuple[] = [];
    public joiningStr = "===="
    public globalConfig: GlobalConfigI;
    public persistenceManager: PersistenceManager
    public configManager: ConfigManager

    public pageScraper: ContentScraper
    public urlSectionExtractorScraper: IndexScraper
    public downloader: DownloaderUrl

    constructor() {
        this.configManager = new ConfigManager()
    }


    async startScraper() {
        await initDb()

        const indexes = await this.loadIndexAndScrapers()
        let continueScraping = true;
        while (continueScraping) for (let index of indexes) {
            try {
                await this.scrapOneIterationFromOneScraper(index)
            } catch (e) {
                console.log("----------------------------------")
                console.log("ERROR")
                console.log(e)
                console.log("----------------------------------")

                await this.setUpNextIteration(index)
            }
        }
    }

    async scrapOneIterationFromOneScraper(scrapingIndex: ScrapingIndexI) {
        console.log("-----------------")
        console.log(scrapingIndex)

        await this.refreshGlobalConfigFromIndex(scrapingIndex)
        const urls = await this.urlSectionExtractorScraper.extractNewsUrlsInSectionPageFromIndexOneIteration(scrapingIndex)
        scrapingIndex.currentScrapingUrlList = urls

        console.log("--->  starting scraping urls ")
        console.log(urls)

        if (scrapingIndex.pageNewIndex >= urls.length - 1) {
            scrapingIndex.pageNewIndex = 0
        }

        await this.persistenceManager.updateIndex(scrapingIndex)

        while (scrapingIndex.pageNewIndex <= urls.length - 1) {

            const url = urls[scrapingIndex.pageNewIndex]

            try{
                if (url) {
                        console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
                        console.log("scraping url " + "page: " + scrapingIndex.pageNewIndex + " url number: " + scrapingIndex.urlIndex + " search: " +  scrapingIndex.search)
                        console.log(url)
                        console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")

                        let extractedNews = await this.pageScraper.extractNewInUrl(url, scrapingIndex.search, scrapingIndex.scraperId, 
                            scrapingIndex.pageNewIndex, scrapingIndex.scrapingIteration)
                        console.log(extractedNews)
                        await this.persistenceManager.saveNewsScraped(extractedNews)

                        try{
                            await this.downloader.download(extractedNews.downloadUrl, extractedNews.filename, this.globalConfig.parentPath + "/" + 
                            this.config.searchesFile.replace(".txt", "") +"/"+ extractedNews.search)

                        } catch (err){
                            console.log("error downloading")  
                            throw err
                        }
                }
            } catch (err){
                console.log(err)
            }

            scrapingIndex.pageNewIndex = scrapingIndex.pageNewIndex + 1
            await this.persistenceManager.updateIndex(scrapingIndex)
            await this.refreshGlobalConfigFromIndex(scrapingIndex)
        }

        await this.setUpNextIteration(scrapingIndex)
    }


    async loadIndexAndScrapers(): Promise<ScrapingIndexI[]> {

        this.persistenceManager = new PersistenceManager(this.config)
        
        await this.prepareGlobalConfig()

        const searchessReordered = this.reorderSearchArrayStartingWithLastScraped()
        this.pageScraper = new LibgenUrlContentScraper(),
        this.urlSectionExtractorScraper =  new LibgenIndexScraper(this.globalConfig.baseLibgenUrl)

        const indexes = [] as ScrapingIndexI[]
        for (let search of searchessReordered) {
            console.log("loading index for " + search)
            
            
      
            const indexScraper = await this.prepareIndex(search)
            console.log(indexScraper)
            indexes.push(indexScraper)

        }
        return indexes
        

    }
    async prepareGlobalConfig() {
        let globalConfig = await this.persistenceManager.findCurrentGlogalConfig()
        if (globalConfig) {
            this.globalConfig = globalConfig
            this.globalConfig.searches = await this.configManager.extractSearchesList(globalConfig)

        } else {
            console.log("global config nof found, starting new one");
            
            globalConfig = {} as GlobalConfigI
            globalConfig.parentPath = this.config.parentPath
            globalConfig.scraperId = this.config.scraperId
            globalConfig.deviceId = this.config.deviceId
            globalConfig.baseLibgenUrl = this.config.baseLibgenUrl
            globalConfig.lastActive = new Date()

            globalConfig.searchesFile = this.config.searchesFile

            globalConfig.searches = await this.configManager.extractSearchesList(globalConfig)
            globalConfig.lastSearch = globalConfig.searches[0]

            await this.persistenceManager.updateGlobalConfig(globalConfig)
            this.globalConfig = globalConfig
        }
        this.downloader = new DownloaderUrl(globalConfig.parentPath)
    }

    reorderSearchArrayStartingWithLastScraped():string[] {
        const currentSearch = this.globalConfig.lastSearch
        const index = this.globalConfig.searches.indexOf(currentSearch)
        const searchesReordered = this.globalConfig.searches.slice(index).concat(this.globalConfig.searches.slice(0, index))
        return searchesReordered
    }

    async refreshGlobalConfigFromIndex(index: ScrapingIndexI) {
        this.globalConfig.lastSearch = index.search
        this.globalConfig.lastActive = new Date()
        await this.persistenceManager.updateGlobalConfig(this.globalConfig)

    }

    async prepareIndex(search: string): Promise<ScrapingIndexI> {
        let indexScraper = await this.persistenceManager.findCurrentIndex(search)
        if (!indexScraper || !indexScraper.scraperId) {
            console.log("not found index", indexScraper)
            indexScraper = this.loadIndexFromConfig(search)
        }

        await this.persistenceManager.updateIndex(indexScraper)
        return indexScraper

    }


    loadIndexFromConfig(search: string): ScrapingIndexI {
        console.log("@---------------------------------------@")
        console.log("loading from config")
        console.log("@---------------------------------------@")
        const indexScraper = {} as ScrapingIndexI
        indexScraper.urlIndex = 0
        indexScraper.scrapingIteration = 0
        indexScraper.pageNewIndex = 0
        indexScraper.search = search
        indexScraper.scraperId =this.globalConfig.scraperId
        indexScraper.deviceId = this.globalConfig.deviceId
        indexScraper.maxPages = this.config.scrapingSettings.maxPages 
        
        return indexScraper
    }

    async setUpNextIteration(scrapingIndex: ScrapingIndexI) {
        console.log("---> Preparing for next iteration")
        scrapingIndex.urlIndex = scrapingIndex.urlIndex + 1
        scrapingIndex.pageNewIndex = 1
        scrapingIndex.pageIndexSection = 1
        scrapingIndex.scrapingIteration = scrapingIndex.scrapingIteration + 1
        await this.persistenceManager.updateIndex(scrapingIndex)
    }


} 