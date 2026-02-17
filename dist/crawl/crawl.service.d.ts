export declare class CrawlService {
    private fetchHtml;
    private extractLinks;
    collectUrls(seedUrl: string, maxPages?: number, maxDepth?: number): Promise<{
        seedUrl: string;
        count: number;
        urls: string[];
    }>;
}
