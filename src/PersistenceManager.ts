import {
    ScrapingIndexI,
} from './models/ScrapingIndex';

import {ScrapingConfigI} from "./models/ScrapingConfig";
import {
    convertScrapingIndexSqlI,
    convertToScrapingIndexSqlI, 
    ScrapingIndexSql,
    ScrapingIndexSqlI
} from "./models/ScrapingIndexSql";
import {convertToNewsScrapedSqlI, DocumentUrlContentSql} from "./models/DocumentUrlContentSql";
import {DocumentUrlContentI} from "./models/DocumentUrlContentI";
import {ScrapingUrlsSql, ScrapingUrlsSqlI} from "./models/ScrapingUrlSql";
import {GlobalConfigSql} from "./models/GlobalConfigSql";
import {GlobalConfigI} from "./models/GlobalConfig";

require('dotenv').config();

export default class PersistenceManager {
    public config: ScrapingConfigI = {} as ScrapingConfigI

    constructor(config: ScrapingConfigI) {
        this.config = config
    }

    async updateIndex(index: ScrapingIndexI) {
        index.scraperId = this.config.scraperId

        const indexDb = {...index}
        const conditions = {
            scraperId: indexDb.scraperId,
            search: indexDb.search
        }
        indexDb.dateScraping = new Date()



        if (this.config.useSqliteDb) {
            try {
                const indexSql = convertToScrapingIndexSqlI(indexDb)

                const found = await ScrapingIndexSql.findOne({where: conditions})

                if (found) {
                    await ScrapingIndexSql.update(indexSql, {where: conditions})
                } else {
                    await ScrapingIndexSql.create(indexSql)
                
                }
            } catch (e) {
                console.log("ERROR UPDATING INDEX sqlite")
                throw e
            }
        }

    }

    async findCurrentIndex(search: string): Promise<ScrapingIndexI> {
        let index: ScrapingIndexI

        const conditions = {
            scraperId: this.config.scraperId,
            search: search
        }

        if (this.config.useSqliteDb) {
            try {
                const startingUrlsSql = await ScrapingUrlsSql.findAll({where: conditions})

                const scrapingIndexDocumentM = await ScrapingIndexSql.findOne({where: conditions})
                if (scrapingIndexDocumentM && startingUrlsSql) {
                    const startingUrls = startingUrlsSql.map(item => item.toJSON() as unknown) as Array<ScrapingUrlsSqlI>
                    index = convertScrapingIndexSqlI(scrapingIndexDocumentM.toJSON() as ScrapingIndexSqlI, startingUrls)
                } else {
                    index = null
                }
            } catch (e) {
                console.log("error saving using sqlite")
                throw e
            }

        }

        return index
    }



    async findCurrentGlogalConfig(): Promise<GlobalConfigI> {
        let globalConfig: GlobalConfigI

        const conditions = {
            scraperId: this.config.scraperId,
        }
        if (this.config.useSqliteDb) {
            try {
                const globalConfigSql = await GlobalConfigSql.findOne({where: conditions})

                if (globalConfigSql) {
                    globalConfig =  globalConfigSql.toJSON() as GlobalConfigI
                } else {
                    globalConfig = null
                }
            } catch (e) {
                console.log("error saving global config using sqlite")
                throw e
            }

        }

        return globalConfig
    }

    async updateGlobalConfig(globalConfig: GlobalConfigI) {
        const conditions = {
            scraperId: this.config.scraperId,
        }

        if (this.config.useSqliteDb) {
            const found = await GlobalConfigSql.findOne({where: conditions})
            if (found) {
                await GlobalConfigSql.update(globalConfig, {where: conditions})
            } else {
                await GlobalConfigSql.create(globalConfig)
            }
        }

    }

    async saveNewsScraped(newItem: DocumentUrlContentI) {

        // if (!newItem.content || newItem.content == "" || newItem.content == null) {
        //     console.log("News not saved because does not have content", newItem)
        //     return
        // }

        //await this.apiManager.saveNewsScraped(newItem)

        const conditions = {url: newItem.documentUrl || ""}
        if (this.config.useSqliteDb && newItem.documentUrl) {
            newItem = this.cleanUpForSaving(newItem)
            try {
                const newsSql = convertToNewsScrapedSqlI(newItem)
                const found = await DocumentUrlContentSql.findOne({where: conditions})
                if (found) {
                    await DocumentUrlContentSql.update(newsSql, {where: conditions})
                } else {
                    await DocumentUrlContentSql.create(newsSql)
                }
            } catch (e) {
                console.log("ERROR SAVING sqlite")
                throw e
            }
        }

    }

    cleanUpForSaving(newItem: DocumentUrlContentI) {
        if (!newItem.id || newItem.id==null) newItem.id = "error"
        if (!newItem.documentUrl || newItem.documentUrl==null) newItem.documentUrl = ""
        return newItem
    }

}
