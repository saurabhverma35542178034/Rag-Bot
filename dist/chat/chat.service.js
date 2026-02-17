"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const pinecone_service_1 = require("../pinecone/pinecone.service");
const openai_service_1 = require("../openai/openai.service");
let ChatService = class ChatService {
    constructor(pinecone, openai) {
        this.pinecone = pinecone;
        this.openai = openai;
    }
    async ask(question, namespace, topK = 6) {
        const index = await this.pinecone.index(namespace);
        const results = await index.searchRecords({
            query: {
                topK,
                inputs: { text: question },
            },
            fields: ["chunk_text", "url", "title"],
        });
        const hits = results?.result?.hits ?? [];
        const context = hits
            .map((h, i) => {
            const url = h?.fields?.url ?? "";
            const title = h?.fields?.title ?? "";
            const text = h?.fields?.chunk_text ?? "";
            return `Source ${i + 1}:\nTitle: ${title}\nURL: ${url}\nContent: ${text}`;
        })
            .join("\n\n");
        const answer = await this.openai.chatAnswer({ question, context });
        const sources = hits
            .map((h) => h?.fields?.url)
            .filter(Boolean)
            .filter((v, i, a) => a.indexOf(v) === i);
        try {
            const answer = await this.openai.chatAnswer({ question, context });
            return { answer, sources, retrieved: hits.length };
        }
        catch (error) {
            console.error("Error generating answer:", error);
            return { answer: "Sorry, I couldn't generate an answer.", sources, retrieved: hits.length, error: error.message };
        }
        return { answer, sources, retrieved: hits.length };
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pinecone_service_1.PineconeService,
        openai_service_1.OpenAIService])
], ChatService);
//# sourceMappingURL=chat.service.js.map