import { ConfigService } from "@nestjs/config";
export declare class PineconeService {
    private readonly config;
    private pc;
    constructor(config: ConfigService);
    index(namespace?: string): Promise<import("@pinecone-database/pinecone").Index<import("@pinecone-database/pinecone").RecordMetadata>>;
}
