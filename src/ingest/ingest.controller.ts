import { Body, Controller, Post } from "@nestjs/common";
import { IngestService } from "./ingest.service";

@Controller("ingest")
export class IngestController {
  constructor(private readonly ingest: IngestService) {}

  @Post("url")
  async ingestUrl(
    @Body()
    body: {
      url: string;
      namespace?: string;
      documentType?: string;
    },
  ) {
    return this.ingest.ingestSingleUrl(
      body.url,
      body.namespace,
      body.documentType ?? "webpage",
    );
  }

  @Post("urls")
  async ingestUrls(
    @Body()
    body: {
      urls: string[];
      namespace?: string;
      documentType?: string;
    },
  ) {
    return this.ingest.ingestManyUrls(
      body.urls,
      body.namespace,
      body.documentType ?? "webpage",
    );
  }
}
