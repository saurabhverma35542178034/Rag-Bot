import { IngestService } from "./ingest.service";
export declare class IngestController {
    private readonly ingest;
    constructor(ingest: IngestService);
    ingestUrl(body: {
        url: string;
        namespace?: string;
        documentType?: string;
    }): Promise<{
        url: string;
        ingested: number;
        reason: string;
        title?: undefined;
        namespace?: undefined;
    } | {
        url: string;
        title: string;
        ingested: number;
        namespace: string;
        reason?: undefined;
    }>;
    ingestUrls(body: {
        urls: string[];
        namespace?: string;
        documentType?: string;
    }): Promise<{
        total: number;
        results: ({
            url: string;
            ingested: number;
            reason: string;
        } | {
            url: string;
            title: string;
            ingested: number;
            namespace: string;
        } | {
            url: string;
            ingested: number;
            error: string;
        })[];
    }>;
}
