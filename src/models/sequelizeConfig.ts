import {Sequelize} from 'sequelize';

import {DataTypes} from "sequelize";
import {DocumentUrlContentSql, newScrapedSqlAttributes} from "./DocumentUrlContentSql";
import {
    ScrapingIndexSql,
    scrapingIndexSqlAttributes,
} from "./ScrapingIndexSql";
import {scrapingUrlSqlAttributes, ScrapingUrlsSql} from "./ScrapingUrlSql";
import {GlobalConfigSql, globalConfigSqlAttributes} from "./GlobalConfigSql";

export const sequelize =  new Sequelize({
    storage: './database_libgen.sqlite3',
    dialect: 'sqlite',
    logging: true
})

export const initDb = async () => {
    DocumentUrlContentSql.init(
        newScrapedSqlAttributes,
        {
            tableName: "DocumentUrlScraped",
            sequelize: sequelize, // this bit is important
        }
    )

    ScrapingIndexSql.init(
        scrapingIndexSqlAttributes,
        {
            tableName: "ScrapingIndex",
            sequelize: sequelize, // this bit is important
        }
    )

    ScrapingUrlsSql.init(
        scrapingUrlSqlAttributes as any,
        {
            tableName: "ScrapingUrl",
            sequelize: sequelize, // this bit is important
        }
    )

    GlobalConfigSql.init(
        globalConfigSqlAttributes,
        {
            tableName: "GlobalConfig",
            sequelize: sequelize, // this bit is important
        }
    )

    await DocumentUrlContentSql.sync({force: false})
    await ScrapingIndexSql.sync({force: false})
    await ScrapingUrlsSql.sync({force: false})
    await GlobalConfigSql.sync({force: false})
}
