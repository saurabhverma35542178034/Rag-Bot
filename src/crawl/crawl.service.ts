import { Injectable } from "@nestjs/common";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { isSameHost, normalizeUrl } from "../common/utils/url";

@Injectable()
export class CrawlService {
  private async fetchHtml(url: string) {
    const res = await fetch(url, {
      headers: { "User-Agent": "RAGBot/1.0 (learning project)" },
    });
    if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
    return res.text();
  }

  private extractLinks(baseUrl: string, html: string): string[] {
    const $ = cheerio.load(html);
    const links = new Set<string>();

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      try {
        const abs = new URL(href, baseUrl).toString();
        if (isSameHost(baseUrl, abs)) links.add(normalizeUrl(abs));
      } catch {
        // ignore invalid urls
      }
    });

    return Array.from(links);
  }

  async collectUrls(seedUrl: string, maxPages = 30, maxDepth = 2) {
    const start = normalizeUrl(seedUrl);
    const visited = new Set<string>();
    const queue: Array<{ url: string; depth: number }> = [
      { url: start, depth: 0 },
    ];

    while (queue.length && visited.size < maxPages) {
      const { url, depth } = queue.shift()!;
      if (visited.has(url)) continue;
      visited.add(url);

      if (depth >= maxDepth) continue;

      let html = "";
      try {
        html = await this.fetchHtml(url);
      } catch {
        continue;
      }

      const links = this.extractLinks(start, html);
      for (const link of links) {
        if (!visited.has(link)) queue.push({ url: link, depth: depth + 1 });
      }
    }

    return { seedUrl: start, count: visited.size, urls: Array.from(visited) };
  }
}
