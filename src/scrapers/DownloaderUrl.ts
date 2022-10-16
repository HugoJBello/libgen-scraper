
import http from 'http'; // or 'https' for https:// URLs
import fs from 'fs';


export class DownloaderUrl {
    public path: string

    constructor() {
        
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
                console.log("Download Completed", filename);
                console.log("---------------------------------")
        
                resolve("OK")
            });
        })
        });
     }

}
