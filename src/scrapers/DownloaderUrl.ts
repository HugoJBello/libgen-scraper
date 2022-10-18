
import http from 'http'; // or 'https' for https:// URLs
import fs from 'fs';
import Https from 'https'
import { threadId } from 'worker_threads';

export class DownloaderUrl {
    public parentPath: string

    constructor(parentPath: string) {
        this.parentPath = parentPath
        if (!fs.existsSync(this.parentPath)){
            fs.mkdirSync(this.parentPath, { recursive: true });
        }
    }


    async wait(seconds: number){
        await new Promise(resolve => setTimeout(resolve, seconds*1000));
    }

    async downloadFile (url:string, targetFile:string): Promise<string>  {  
        return new Promise((resolve, reject) => {
          http.get(url, response => {
            const code = response.statusCode ?? 0
      
            if (code >= 400) {
              return reject(new Error(response.statusMessage))
            }
      
            // handle redirects
            if (code > 300 && code < 400 && !!response.headers.location) {
              return this.downloadFile(response.headers.location, targetFile)
            }
      
            // save the file to disk
            const fileWriter = fs
              .createWriteStream(targetFile)
              .on('finish', () => {
                resolve("Ok")
              })
      
            response.pipe(fileWriter)
          }).on('error', error => {
            reject(error)
          })
        })
      }

     async download(url:string, filename:string, path:string): Promise<string>{
        if (!fs.existsSync(path)){
            fs.mkdirSync(path, { recursive: true });
        }

        const filenameFull = path + "/" + filename

        console.log("---------------------------------")
        console.log("starting downloading url ", url)
        console.log("---------------------------------")

        return this.downloadFile(url, filenameFull)
     }

}
