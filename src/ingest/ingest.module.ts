import { Module } from "@nestjs/common";
import { IngestController } from "./ingest.controller";
import { IngestService } from "./ingest.service";
import { PineconeModule } from "../pinecone/pinecone.module";

@Module({
  imports: [PineconeModule],
  controllers: [IngestController],
  providers: [IngestService],
})
export class IngestModule {}
