import { CrawlService } from "./crawl.service";
export declare class CrawlController {
    private readonly crawl;
    constructor(crawl: CrawlService);
    crawlUrls(body: {
        seedUrl: string;
        maxPages?: number;
        maxDepth?: number;
    }): Promise<{
        seedUrl: string;
        count: number;
        urls: string[];
    }>;
}
