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
exports.PineconeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pinecone_1 = require("@pinecone-database/pinecone");
let PineconeService = class PineconeService {
    constructor(config) {
        this.config = config;
        this.pc = new pinecone_1.Pinecone({
            apiKey: this.config.getOrThrow("PINECONE_API_KEY"),
        });
    }
    async index(namespace) {
        const indexName = this.config.getOrThrow("PINECONE_INDEX");
        const defaultNs = this.config.getOrThrow("PINECONE_NAMESPACE");
        const desc = await this.pc.describeIndex(indexName);
        const idx = this.pc.index({ host: desc.host });
        return idx.namespace(namespace ?? defaultNs);
    }
};
exports.PineconeService = PineconeService;
exports.PineconeService = PineconeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PineconeService);
//# sourceMappingURL=pinecone.service.js.map