import { Worker, Job } from "bullmq";
import { BaseJobPayload } from "@/lib/bullmq/bullmq.types";
import { parsePdfFromUrl } from "@/lib/pdf-parse/";
import { chunkDocument } from "@/services/rag-service/rag.chunker";
import { generateDocumentEmbeddings } from "@/services/embedding-service/embeddings.generate";
import { logger } from "@/lib/logger";
import type { Document } from "../documents.types";

const COLLECTION_NAME = "legal_questions";

export const documentsWorker = async (
    job: Job<BaseJobPayload<{ document: Document }>>,
) => {
    const { id, storageUrl } = job.data.payload.document;
    try {
        await job.updateProgress(10);
        // 1. Download document and extract text
        const fileContent = await parsePdfFromUrl(storageUrl);
        await job.updateProgress(30);

        // 2. Chunk document into sections
        const chunks = await chunkDocument({
            id,
            text: fileContent,
        }, {
            chunkSize: 1000, // tokens
            overlapSize: 200,
        });
        await job.updateProgress(60);

        // 3. Generate and store embeddings
        const embeddings = await generateDocumentEmbeddings(chunks, {
            collectionName: COLLECTION_NAME,
            limit: 20
        });
        await job.updateProgress(100);

        return { success: true, id, chunksCreated: chunks.length };
    } catch (error) {
        logger.error({error}, `Failed to process document ${id}:`);
        throw error;
    }
}