npm run build
pm2 stop puppeteer_libgen_scraper
pm2 delete puppeteer_libgen_scraper
pm2 start npm --name "puppeteer_libgen_scraper" -- start
npm run jobRunner
