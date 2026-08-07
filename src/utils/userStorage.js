/**
 * userStorage.js
 * Privacy-first LocalStorage utility for managing user favorites,
 * recently used tools, recently read guides, and search term logs.
 */

const STORAGE_KEYS = {
    FAVORITES: 'suh_favorites',
    RECENT_TOOLS: 'suh_recent_tools',
    RECENT_GUIDES: 'suh_recent_guides',
    SEARCH_TERMS: 'suh_search_terms'
};

const safeGet = (key, defaultVal = []) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
        console.warn(`LocalStorage read failed for ${key}:`, e);
        return defaultVal;
    }
};

const safeSet = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn(`LocalStorage write failed for ${key}:`, e);
    }
};

// Favorites
export const getFavorites = () => safeGet(STORAGE_KEYS.FAVORITES, []);

export const isFavorite = (toolId) => {
    const favs = getFavorites();
    return favs.includes(toolId);
};

export const toggleFavorite = (toolId) => {
    let favs = getFavorites();
    if (favs.includes(toolId)) {
        favs = favs.filter(id => id !== toolId);
    } else {
        favs.push(toolId);
    }
    safeSet(STORAGE_KEYS.FAVORITES, favs);
    return favs.includes(toolId);
};

// Recently Used Tools
export const getRecentlyUsed = () => safeGet(STORAGE_KEYS.RECENT_TOOLS, []);

export const addRecentlyUsed = (toolId) => {
    let recent = getRecentlyUsed().filter(id => id !== toolId);
    recent.unshift(toolId); // Add to beginning
    if (recent.length > 10) recent = recent.slice(0, 10);
    safeSet(STORAGE_KEYS.RECENT_TOOLS, recent);
};

// Recently Read Guides
export const getRecentlyRead = () => safeGet(STORAGE_KEYS.RECENT_GUIDES, []);

export const addRecentlyRead = (guideSlug) => {
    let recent = getRecentlyRead().filter(slug => slug !== guideSlug);
    recent.unshift(guideSlug);
    if (recent.length > 10) recent = recent.slice(0, 10);
    safeSet(STORAGE_KEYS.RECENT_GUIDES, recent);
};

// Search Term Logger
export const logSearchQuery = (query) => {
    if (!query || query.trim().length < 2) return;
    const clean = query.trim().toLowerCase();
    let terms = safeGet(STORAGE_KEYS.SEARCH_TERMS, []);
    terms = terms.filter(t => t !== clean);
    terms.unshift(clean);
    if (terms.length > 20) terms = terms.slice(0, 20);
    safeSet(STORAGE_KEYS.SEARCH_TERMS, terms);
};

export const getSearchHistory = () => safeGet(STORAGE_KEYS.SEARCH_TERMS, []);
