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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let OpenAIService = class OpenAIService {
    constructor(config) {
        this.config = config;
        this.client = new openai_1.default({
            apiKey: this.config.getOrThrow("OPENAI_API_KEY"),
        });
        this.model = this.config.getOrThrow("OPENAI_MODEL");
    }
    async chatAnswer(args) {
        const { question, context } = args;
        const resp = await this.client.chat.completions.create({
            model: this.model,
            temperature: 0.2,
            max_completion_tokens: 450,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant. Use ONLY the provided sources. If the answer is not in the sources, say you do not know.",
                },
                {
                    role: "user",
                    content: `Question:\n${question}\n\nSources:\n${context}`,
                },
            ],
        });
        return resp.choices?.[0]?.message?.content ?? "";
    }
};
exports.OpenAIService = OpenAIService;
exports.OpenAIService = OpenAIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenAIService);
//# sourceMappingURL=openai.service.js.map