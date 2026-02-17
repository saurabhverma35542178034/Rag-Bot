export declare function validateEnv(config: Record<string, unknown>): {
    OPENAI_API_KEY: string;
    OPENAI_MODEL: string;
    PINECONE_API_KEY: string;
    PINECONE_INDEX: string;
    PINECONE_NAMESPACE: string;
    PORT?: string | undefined;
};
