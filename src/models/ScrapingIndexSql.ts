import { DataTypes, Model } from 'sequelize';
import { ScrapingIndexI } from './ScrapingIndex';
import { ScrapingUrlsSqlI } from './ScrapingUrlSql';

export interface ScrapingIndexSqlI {
  dateScraping: Date;
  urlIndex: number;
  pageNewIndex: number;
  pageIndexSection: number;
  maxPages: number;
  search: string;
  reviewsSource: string;
  currentScrapingUrlList: string;
  scraperId: string;
  deviceId: string;
  id: number;
  scrapingIteration: number;
}

export const scrapingIndexSqlAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dateScraping: {
    type: DataTypes.DATE
  },
  urlIndex: {
    type: DataTypes.NUMBER
  },
  pageNewIndex: {
    type: DataTypes.NUMBER
  },
  pageIndexSection: {
    type: DataTypes.NUMBER
  },
  maxPages: {
    type: DataTypes.NUMBER
  },
  search: {
    type: DataTypes.STRING
  },
  reviewsSource: {
    type: DataTypes.STRING
  },
  currentScrapingUrlList: {
    type: DataTypes.STRING
  },
  scraperId: {
    type: DataTypes.STRING
  },
  deviceId: {
    type: DataTypes.STRING
  },
  scrapingIteration: {
    type: DataTypes.NUMBER
  }
};

export const joiningStrUrls = '=====';

export class ScrapingIndexSql extends Model<ScrapingIndexSqlI> {}

export const convertToScrapingIndexSqlI = (
  index: ScrapingIndexI
): ScrapingIndexSqlI => {
  const indexSql = index as any;
  if (indexSql.startingUrls && Array.isArray(indexSql.startingUrls)) {
    const urls = indexSql.startingUrls;
    indexSql.startingUrls = urls.join(joiningStrUrls);
  }
  if (
    indexSql.currentScrapingUrlList &&
    Array.isArray(indexSql.currentScrapingUrlList)
  ) {
    const urls = indexSql.currentScrapingUrlList;
    indexSql.currentScrapingUrlList = urls.join(joiningStrUrls);
  }
  return indexSql as ScrapingIndexSqlI;
};

export const convertScrapingIndexSqlI = (
  indexSql: ScrapingIndexSqlI,
  startingUrls: ScrapingUrlsSqlI[]
): ScrapingIndexI => {
  const index = indexSql as any;
  const starting = startingUrls.map((url) => url.url);
  index.startingUrls = starting;

  if (
    index.currentScrapingUrlList &&
    index.currentScrapingUrlList.includes(joiningStrUrls)
  ) {
    index.currentScrapingUrlList =
      index.currentScrapingUrlList.split(joiningStrUrls);
  }

  return index as ScrapingIndexI;
};

export const convertScrapingIndexSqlIApi = (
  indexSql: ScrapingIndexSql
): ScrapingIndexI => {
  const index = indexSql as any;

  if (
    index.currentScrapingUrlList &&
    index.currentScrapingUrlList.includes(joiningStrUrls)
  ) {
    index.currentScrapingUrlList =
      index.currentScrapingUrlList.split(joiningStrUrls);
  } else {
    index.currentScrapingUrlList = [index.currentScrapingUrlList]
  }

  if (index.startingUrls && index.startingUrls.includes(joiningStrUrls)) {
    index.startingUrls = index.startingUrls.split(joiningStrUrls);
  } else {
    index.startingUrls = [index.startingUrls]
  }

  return index as ScrapingIndexI;
};

