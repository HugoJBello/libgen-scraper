import { GlobalConfigI } from "./models/GlobalConfig";
import  fs  from 'fs';


export default class ConfigManager {

    async extractSearchesList(config: GlobalConfigI):Promise<string[]>{
        const path = "./src/config/" + config.searchesFile

        const strSearches = await fs.readFileSync(path, "utf8")
        const result =  strSearches.split("\n")
        return result.filter(item => item !== "")
    }
}