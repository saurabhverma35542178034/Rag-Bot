import { Injectable } from "@nestjs/common";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { chunkText } from "../common/utils/chunker";
import { PineconeService } from "../pinecone/pinecone.service";

@Injectable()
export class IngestService {
  constructor(private readonly pinecone: PineconeService) {}

  private async fetchPage(url: string) {
    const res = await fetch(url, {
      headers: { "User-Agent": "RAGBot/1.0 (learning project)" },
    });
    if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $("title").text().trim() || url;

    // Remove obvious junk
    $("script, style, nav, footer, header, noscript, svg").remove();

    // Prefer main/article, fallback body
    const mainText =
      $("main").text() || $("article").text() || $("body").text();
    const text = mainText.replace(/\s+/g, " ").trim();

    return { title, text };
  }

  private makeId(url: string, chunkNo: number) {
    const path = new URL(url).pathname
      .replace(/\/+/g, "/")
      .replace(/[^\w/.-]+/g, "_");
    const safe = path === "/" ? "home" : path.replace(/\//g, "_");
    return `web#${safe}#chunk${String(chunkNo).padStart(4, "0")}`;
  }

  async ingestSingleUrl(
    url: string,
    namespace?: string,
    documentType = "webpage",
  ) {
    const { title, text } = await this.fetchPage(url);
    if (!text || text.length < 50)
      return { url, ingested: 0, reason: "Too little text" };

    const chunks = chunkText(text, 1500, 200);
    const index = await this.pinecone.index(namespace);

    // IMPORTANT: "chunk_text" must match the integrated index fieldMap (embed.fieldMap)
    const records = chunks.map((chunk, i) => ({
      _id: this.makeId(url, i),
      chunk_text: chunk,
      url,
      title,
      document_type: documentType,
      chunk_number: i,
      created_at: new Date().toISOString(),
    }));

    await index.upsertRecords({records});

    return {
      url,
      title,
      ingested: records.length,
      namespace: namespace ?? "default",
    };
  }

  async ingestManyUrls(
    urls: string[],
    namespace?: string,
    documentType = "webpage",
  ) {
    type IngestResult =
      | { url: string; ingested: number; reason: string }
      | { url: string; title: string; ingested: number; namespace: string }
      | { url: string; ingested: number; error: string };

    const results: IngestResult[] = [];
    for (const url of urls) {
      try {
        results.push(await this.ingestSingleUrl(url, namespace, documentType));
      } catch (e: any) {
        results.push({
          url,
          ingested: 0,
          error: e?.message ?? "unknown error",
        });
      }
    }
    return { total: urls.length, results };
  }
}
