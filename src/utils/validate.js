/**
 * Security Utility for Input Validation
 */

/**
 * Validates if a file is safe for processing
 * @param {File} file 
 * @param {Array<string>} allowedTypes - e.g., ['image/png', 'image/jpeg']
 * @param {number} maxSizeMB 
 * @returns {boolean}
 */
export const isSafeFile = (file, allowedTypes, maxSizeMB = 50) => {
    if (!file) return false;
    
    // Check MIME type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
        return false;
    }
    
    // Check size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes || file.size === 0) {
        return false;
    }
    
    return true;
};

/**
 * Validates a number input
 * @param {any} val 
 * @param {number} min 
 * @param {number} max 
 * @returns {number|null} Valid number or null
 */
export const validateNumber = (val, min = -Infinity, max = Infinity) => {
    const num = Number(val);
    if (isNaN(num)) return null;
    if (num < min || num > max) return null;
    return num;
};
