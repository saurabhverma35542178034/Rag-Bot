import { ChatService } from "./chat.service";
export declare class ChatController {
    private readonly chat;
    constructor(chat: ChatService);
    ask(body: {
        question: string;
        namespace?: string;
        topK?: number;
    }): Promise<{
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
