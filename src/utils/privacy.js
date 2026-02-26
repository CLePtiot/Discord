// Simple obfuscation to prevent casual reading of localStorage
// Not cryptographically secure, but enough to stop shoulder surfers

const OBFUSCATION_KEY = 'freedom_layer_key';

export const obfuscateData = (data) => {
    try {
        const jsonString = JSON.stringify(data);
        // Simple base64 encoding to obfuscate text
        return btoa(unescape(encodeURIComponent(jsonString)));
    } catch (e) {
        console.error("Error obfuscating data", e);
        return null;
    }
};

export const deobfuscateData = (obfuscatedString) => {
    try {
        if (!obfuscatedString) return null;
        const decoded = decodeURIComponent(escape(atob(obfuscatedString)));
        return JSON.parse(decoded);
    } catch (e) {
        console.error("Error deobfuscating data", e);
        return null;
    }
};
