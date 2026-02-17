"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSameHost = isSameHost;
exports.normalizeUrl = normalizeUrl;
function isSameHost(baseUrl, candidateUrl) {
    try {
        const a = new URL(baseUrl);
        const b = new URL(candidateUrl);
        return a.host === b.host;
    }
    catch {
        return false;
    }
}
function normalizeUrl(url) {
    const u = new URL(url);
    u.hash = "";
    return u.toString();
}
//# sourceMappingURL=url.js.map