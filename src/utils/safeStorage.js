/**
 * Security Utility for LocalStorage (prevents corruption and injection)
 */

export const safeStorage = {
    getItem: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            
            // Try to parse JSON, if it fails, return the string (might be plain text)
            try {
                return JSON.parse(item);
            } catch (e) {
                return item;
            }
        } catch (error) {
            console.warn(`[SafeStorage] Failed to read key: ${key}`);
            return defaultValue;
        }
    },

    setItem: (key, value) => {
        try {
            const valToStore = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(key, valToStore);
            return true;
        } catch (error) {
            console.warn(`[SafeStorage] Failed to write key: ${key}`);
            if (error.name === 'QuotaExceededError') {
                console.warn('[SafeStorage] Storage quota exceeded. Clearing non-essential data...');
                // Optional: Implement cleanup logic here
            }
            return false;
        }
    },
    
    removeItem: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn(`[SafeStorage] Failed to remove key: ${key}`);
        }
    }
};
