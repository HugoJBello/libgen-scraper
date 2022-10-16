import {DataTypes, Model} from 'sequelize';

export interface GlobalConfigSqlSqlI {
    lastActive: Date;
    scraperId: string;
    lastSearch: string;
    deviceId: string;
    id: number;
    parentPath: string;
    baseLibgenUrl: string;
}

export const globalConfigSqlAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lastActive: {
        type: DataTypes.DATE,
    },
    scraperId: {
        type: DataTypes.STRING,
    },
    parentPath: {
        type: DataTypes.STRING,
    },
    deviceId: {
        type: DataTypes.STRING,
    },
    lastSearch: {
        type: DataTypes.STRING,
    },
    baseLibgenUrl: {
        type: DataTypes.STRING,
    }
}

export class GlobalConfigSql extends Model<GlobalConfigSqlSqlI> {
}