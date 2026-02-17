import { ConfigService } from "@nestjs/config";
export declare class OpenAIService {
    private readonly config;
    private client;
    private model;
    constructor(config: ConfigService);
    chatAnswer(args: {
        question: string;
        context: string;
    }): Promise<string>;
}
