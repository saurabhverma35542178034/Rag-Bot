import { Body, Controller, Post } from "@nestjs/common";
import { CrawlService } from "./crawl.service";

@Controller("crawl")
export class CrawlController {
  constructor(private readonly crawl: CrawlService) {}

  @Post("urls")
  async crawlUrls(
    @Body()
    body: {
      seedUrl: string;
      maxPages?: number;
      maxDepth?: number;
    },
  ) {
    return this.crawl.collectUrls(
      body.seedUrl,
      body.maxPages ?? 30,
      body.maxDepth ?? 2,
    );
  }
}
