import { PineconeService } from "../pinecone/pinecone.service";
import { OpenAIService } from "../openai/openai.service";
export declare class ChatService {
    private readonly pinecone;
    private readonly openai;
    constructor(pinecone: PineconeService, openai: OpenAIService);
    ask(question: string, namespace?: string, topK?: number): Promise<{
        answer: string;
        sources: any[];
        retrieved: number;
        error?: undefined;
    } | {
        answer: string;
        sources: any[];
        retrieved: number;
        error: any;
    }>;
}
