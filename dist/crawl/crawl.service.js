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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlService = void 0;
const common_1 = require("@nestjs/common");
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio = __importStar(require("cheerio"));
const url_1 = require("../common/utils/url");
let CrawlService = class CrawlService {
    async fetchHtml(url) {
        const res = await (0, node_fetch_1.default)(url, {
            headers: { "User-Agent": "RAGBot/1.0 (learning project)" },
        });
        if (!res.ok)
            throw new Error(`Fetch failed ${res.status} for ${url}`);
        return res.text();
    }
    extractLinks(baseUrl, html) {
        const $ = cheerio.load(html);
        const links = new Set();
        $("a[href]").each((_, el) => {
            const href = $(el).attr("href");
            if (!href)
                return;
            try {
                const abs = new URL(href, baseUrl).toString();
                if ((0, url_1.isSameHost)(baseUrl, abs))
                    links.add((0, url_1.normalizeUrl)(abs));
            }
            catch {
            }
        });
        return Array.from(links);
    }
    async collectUrls(seedUrl, maxPages = 30, maxDepth = 2) {
        const start = (0, url_1.normalizeUrl)(seedUrl);
        const visited = new Set();
        const queue = [
            { url: start, depth: 0 },
        ];
        while (queue.length && visited.size < maxPages) {
            const { url, depth } = queue.shift();
            if (visited.has(url))
                continue;
            visited.add(url);
            if (depth >= maxDepth)
                continue;
            let html = "";
            try {
                html = await this.fetchHtml(url);
            }
            catch {
                continue;
            }
            const links = this.extractLinks(start, html);
            for (const link of links) {
                if (!visited.has(link))
                    queue.push({ url: link, depth: depth + 1 });
            }
        }
        return { seedUrl: start, count: visited.size, urls: Array.from(visited) };
    }
};
exports.CrawlService = CrawlService;
exports.CrawlService = CrawlService = __decorate([
    (0, common_1.Injectable)()
], CrawlService);
//# sourceMappingURL=crawl.service.js.map