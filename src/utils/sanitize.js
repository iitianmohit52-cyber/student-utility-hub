/**
 * Security Utility for Sanitization
 */

/**
 * Escapes HTML characters in a string to prevent DOM-based XSS
 * @param {string} str - The string to escape
 * @returns {string} - Escaped string safe for innerHTML
 */
export const escapeHTML = (str) => {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
};

/**
 * Validates and sanitizes a URL
 * @param {string} url - The URL to check
 * @returns {string|null} - The safe URL or null if malicious
 */
export const sanitizeURL = (url) => {
    try {
        const parsedUrl = new URL(url, window.location.origin);
        // Only allow http, https, and mailto protocols (prevent javascript:)
        if (['http:', 'https:', 'mailto:'].includes(parsedUrl.protocol)) {
            return parsedUrl.href;
        }
        return null;
    } catch (e) {
        return null; // Invalid URL
    }
};
