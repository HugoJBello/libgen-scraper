import {DataTypes, Model} from 'sequelize';

export interface ScrapingUrlsSqlI {
    id: string
    scraperId: string;
    search: string;
    url: string
}

export const scrapingUrlSqlAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    scraperId: {
        type: DataTypes.STRING,
    },
    url: {
        type: DataTypes.STRING,
    },
    search: {
        type: DataTypes.STRING,
    }
}


export class ScrapingUrlsSql extends Model<ScrapingUrlsSql> {
}

