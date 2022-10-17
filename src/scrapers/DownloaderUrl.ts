
import http from 'http'; // or 'https' for https:// URLs
import fs from 'fs';


export class DownloaderUrl {
    public parentPath: string

    constructor(parentPath: string) {
        this.parentPath = parentPath
        if (!fs.existsSync(this.parentPath)){
            fs.mkdirSync(this.parentPath, { recursive: true });
        }
    }

     async download(url:string, filename:string, path:string): Promise<void>{
        if (!fs.existsSync(path)){
            fs.mkdirSync(path, { recursive: true });
        }

        const filenameFull = path + "/" + filename

        console.log("---------------------------------")
        console.log("starting downloading url ", url)
        console.log("---------------------------------")

        const file = fs.createWriteStream(filenameFull);
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
