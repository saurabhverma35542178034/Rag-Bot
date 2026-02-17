import { PineconeService } from "../pinecone/pinecone.service";
export declare class IngestService {
    private readonly pinecone;
    constructor(pinecone: PineconeService);
    private fetchPage;
    private makeId;
    ingestSingleUrl(url: string, namespace?: string, documentType?: string): Promise<{
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
    ingestManyUrls(urls: string[], namespace?: string, documentType?: string): Promise<{
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
