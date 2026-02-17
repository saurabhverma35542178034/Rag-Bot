"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestService = void 0;
const common_1 = require("@nestjs/common");
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio = __importStar(require("cheerio"));
const chunker_1 = require("../common/utils/chunker");
const pinecone_service_1 = require("../pinecone/pinecone.service");
let IngestService = class IngestService {
    constructor(pinecone) {
        this.pinecone = pinecone;
    }
    async fetchPage(url) {
        const res = await (0, node_fetch_1.default)(url, {
            headers: { "User-Agent": "RAGBot/1.0 (learning project)" },
        });
        if (!res.ok)
            throw new Error(`Fetch failed ${res.status} for ${url}`);
        const html = await res.text();
        const $ = cheerio.load(html);
        const title = $("title").text().trim() || url;
        $("script, style, nav, footer, header, noscript, svg").remove();
        const mainText = $("main").text() || $("article").text() || $("body").text();
        const text = mainText.replace(/\s+/g, " ").trim();
        return { title, text };
    }
    makeId(url, chunkNo) {
        const path = new URL(url).pathname
            .replace(/\/+/g, "/")
            .replace(/[^\w/.-]+/g, "_");
        const safe = path === "/" ? "home" : path.replace(/\//g, "_");
        return `web#${safe}#chunk${String(chunkNo).padStart(4, "0")}`;
    }
    async ingestSingleUrl(url, namespace, documentType = "webpage") {
        const { title, text } = await this.fetchPage(url);
        if (!text || text.length < 50)
            return { url, ingested: 0, reason: "Too little text" };
        const chunks = (0, chunker_1.chunkText)(text, 1500, 200);
        const index = await this.pinecone.index(namespace);
        const records = chunks.map((chunk, i) => ({
            _id: this.makeId(url, i),
            chunk_text: chunk,
            url,
            title,
            document_type: documentType,
            chunk_number: i,
            created_at: new Date().toISOString(),
        }));
        await index.upsertRecords({ records });
        return {
            url,
            title,
            ingested: records.length,
            namespace: namespace ?? "default",
        };
    }
    async ingestManyUrls(urls, namespace, documentType = "webpage") {
        const results = [];
        for (const url of urls) {
            try {
                results.push(await this.ingestSingleUrl(url, namespace, documentType));
            }
            catch (e) {
                results.push({
                    url,
                    ingested: 0,
                    error: e?.message ?? "unknown error",
                });
            }
        }
        return { total: urls.length, results };
    }
};
exports.IngestService = IngestService;
exports.IngestService = IngestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pinecone_service_1.PineconeService])
], IngestService);
//# sourceMappingURL=ingest.service.js.map