"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkText = chunkText;
function chunkText(text, chunkSize = 1500, overlap = 200) {
    const cleaned = text.replace(/\s+/g, " ").trim();
    const chunks = [];
    let i = 0;
    while (i < cleaned.length) {
        chunks.push(cleaned.slice(i, i + chunkSize));
        i += Math.max(1, chunkSize - overlap);
    }
    return chunks.filter((c) => c.trim().length > 0);
}
//# sourceMappingURL=chunker.js.map