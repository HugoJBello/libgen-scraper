

import {DataTypes, Model} from 'sequelize';
import {DocumentUrlContentI} from "./DocumentUrlContentI";

export interface DocumentUrlContentSqlI {
    search: string
    documentUrl: string,
    downloadUrl: string
    filename: string
    date: Date
    scrapedAt: Date
    content: string
    scraperId: string
    scrapingIteration: number
    id: string
    newsIndex: number
}

export class DocumentUrlContentSql extends Model<DocumentUrlContentSqlI> {
}

export const newScrapedSqlAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    DocumentUrlContentSqlI: {
        type: DataTypes.STRING,
    },
    documentUrl: {
        type: DataTypes.STRING,
    },
    filename: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.DATE,
    },
    scrapedAt: {
        type: DataTypes.DATE,
    },
    content: {
        type: DataTypes.STRING,
    },
    scraperId: {
        type: DataTypes.STRING,
    },
    newsIndex: {
        type: DataTypes.NUMBER,
    },
    scrapingIteration: {
        type: DataTypes.NUMBER,
    }
} as any

export const joiningStrtags = ","


export const convertToNewsScrapedSqlI = (newScrapedI: DocumentUrlContentI): DocumentUrlContentSqlI => {
    const newScrapedSql = newScrapedI as any
    return newScrapedSql as DocumentUrlContentSqlI
}

export const convertNewsScrapedSqlI = (newScrapedSqlI: DocumentUrlContentSqlI): DocumentUrlContentI => {
    const index = newScrapedSqlI as any
    
    return index as DocumentUrlContentI
}