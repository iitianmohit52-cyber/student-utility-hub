import { createElement } from '../utils/dom.js';
import { categories, tools } from '../tools/toolRegistry.js';
import { getFavorites, getRecentlyUsed } from '../utils/userStorage.js';
import { navigate } from '../router.js';
import { Analytics, AnalyticsEvents } from '../analytics/analytics.js';

export const renderHero = (container) => {
    const heroSection = createElement('section', 'hero-section');
    
    // Check for returning user data (Favorites & Recents)
    const favIds = getFavorites();
    const recentIds = getRecentlyUsed();
    const hasRetentionData = favIds.length > 0 || recentIds.length > 0;

    let retentionHTML = '';
    if (hasRetentionData) {
        const topRecentIds = [...new Set([...recentIds, ...favIds])].slice(0, 5);
        const retentionTools = tools.filter(t => topRecentIds.includes(t.id));

        if (retentionTools.length > 0) {
            retentionHTML = `
                <div class="retention-user-panel" role="region" aria-label="Recent and Favorite Tools">
                    <div class="retention-header">
                        <strong class="retention-title">👋 Welcome Back!</strong>
                        <span class="retention-subtitle">Quick jump to your recent and favorited tools:</span>
                    </div>
                    <div class="retention-pills">
                        ${retentionTools.map(t => `
                            <button type="button" class="retention-pill-btn" data-slug="${t.slug}" aria-label="Open ${t.name}">
                                <span>${t.icon}</span> <span>${t.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    // Category counts derived directly from actual tool registry
    const categoryCounts = {};
    tools.forEach(t => {
        categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });

    const activeCategories = categories.filter(c => c.id !== 'all');

    heroSection.innerHTML = `
        <div class="hero-ambient-glow" aria-hidden="true">
            <div class="ambient-orb ambient-orb-1"></div>
            <div class="ambient-orb ambient-orb-2"></div>
        </div>
        
        <div class="hero-content">
            ${retentionHTML}
            
            <div class="hero-badge-wrapper">
                <span class="hero-badge">
                    <span class="badge-dot"></span>
                    ${tools.length}+ Free Online Tools
                </span>
            </div>
            
            <h1 class="hero-title">
                Powerful Online Tools. <span class="gradient-text">Made Simple.</span>
            </h1>
            
            <p class="hero-description">
                Fast, browser-friendly tools for students, creators, developers and everyday tasks. 
                Zero registration, privacy-first processing, and 100% free to use.
            </p>
            
            <!-- Hero Search-First Bar -->
            <div class="hero-search-wrapper" role="search" aria-label="Search all tools">
                <div class="hero-search-box">
                    <span class="hero-search-icon" aria-hidden="true">🔍</span>
                    <input 
                        type="text" 
                        id="heroSearchInput" 
                        class="hero-search-input" 
                        placeholder="Search for a tool... e.g. Compress PDF, QR Generator, GST Calculator" 
                        autocomplete="off" 
                        spellcheck="false"
                        aria-label="Search all online tools"
                        aria-autocomplete="list"
                        aria-controls="heroSearchResults"
                    />
                    <button type="button" class="hero-search-clear-btn" id="heroSearchClearBtn" aria-label="Clear search query" style="display: none;">✕</button>
                    <span class="hero-search-shortcut" aria-hidden="true">Ctrl K</span>
                </div>
                
                <!-- Live Search Dropdown Suggestions -->
                <div class="hero-search-results" id="heroSearchResults" role="listbox" aria-label="Tool search results" style="display: none;"></div>
            </div>

            <!-- Hero Action Buttons -->
            <div class="hero-cta-group">
                <button type="button" class="primary-btn hero-cta-btn" id="heroExploreBtn" aria-label="Explore all tools">
                    <span>⚡ Explore All Tools</span>
                </button>
                <button type="button" class="secondary-btn hero-secondary-btn" id="heroBrowseCatBtn" aria-label="Browse categories">
                    <span>📂 Browse Categories</span>
                </button>
            </div>
        </div>
        
        <!-- Quick Category Strip -->
        <div class="hero-category-strip-container" id="categories-nav">
            <div class="hero-category-strip" role="navigation" aria-label="Quick Category Navigation">
                ${activeCategories.map(cat => {
                    const count = categoryCounts[cat.id] || 0;
                    const catSlug = cat.id === 'calculator' ? 'calculators' : `${cat.id}-tools`;
                    return `
                        <a href="/${catSlug}" class="category-strip-pill" data-category="${cat.id}">
                            <span class="cat-pill-icon">${cat.icon}</span>
                            <span class="cat-pill-name">${cat.name}</span>
                            <span class="cat-pill-count">${count}</span>
                        </a>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    // Retention Pill Click Handlers
    heroSection.querySelectorAll('.retention-pill-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const slug = btn.getAttribute('data-slug');
            if (slug) navigate(`/tools/${slug}`);
        });
    });

    // Category Strip Click Handlers (SPA Navigation)
    heroSection.querySelectorAll('.category-strip-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            const href = pill.getAttribute('href');
            if (href) navigate(href);
        });
    });

    // Hero Action Buttons
    const exploreBtn = heroSection.querySelector('#heroExploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const targetEl = document.getElementById('popular-tools-section') || document.querySelector('.tool-grid');
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    const browseCatBtn = heroSection.querySelector('#heroBrowseCatBtn');
    if (browseCatBtn) {
        browseCatBtn.addEventListener('click', () => {
            const targetEl = document.getElementById('category-showcase-section') || document.getElementById('categories-nav');
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Hero Live Search Logic
    const searchInput = heroSection.querySelector('#heroSearchInput');
    const searchResults = heroSection.querySelector('#heroSearchResults');
    const clearBtn = heroSection.querySelector('#heroSearchClearBtn');

    let activeSuggestionIndex = -1;

    const renderHeroSearchResults = (query) => {
        const cleanQuery = query.trim().toLowerCase();
        activeSuggestionIndex = -1;

        if (!cleanQuery) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            if (clearBtn) clearBtn.style.display = 'none';
            return;
        }

        if (clearBtn) clearBtn.style.display = 'flex';

        const matchedTools = tools.filter(tool => {
            const nameMatch = tool.name.toLowerCase().includes(cleanQuery);
            const descMatch = tool.description.toLowerCase().includes(cleanQuery);
            const kwMatch = tool.keywords && tool.keywords.some(k => k.toLowerCase().includes(cleanQuery));
            const catMatch = tool.category.toLowerCase().includes(cleanQuery);
            return nameMatch || descMatch || kwMatch || catMatch;
        }).slice(0, 7); // Max 7 suggestions in hero dropdown

        if (matchedTools.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <span class="no-results-emoji">🔍</span>
                    <span>No tools found matching "<strong>${escapeHtml(query)}</strong>"</span>
                    <button type="button" class="btn-link-sm" id="heroSearchBrowseAll">Browse all ${tools.length}+ tools →</button>
                </div>
            `;
            searchResults.style.display = 'block';

            const browseAll = searchResults.querySelector('#heroSearchBrowseAll');
            if (browseAll) {
                browseAll.addEventListener('click', () => {
                    searchResults.style.display = 'none';
                    const targetEl = document.getElementById('popular-tools-section') || document.querySelector('.tool-grid');
                    if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                });
            }
            return;
        }

        searchResults.innerHTML = matchedTools.map((tool, idx) => `
            <div class="search-suggestion-item" role="option" data-slug="${tool.slug}" data-index="${idx}" tabindex="-1">
                <div class="suggestion-item-icon">${tool.icon}</div>
                <div class="suggestion-item-content">
                    <div class="suggestion-item-title">${highlightMatch(tool.name, cleanQuery)}</div>
                    <div class="suggestion-item-desc">${escapeHtml(tool.description)}</div>
                </div>
                <span class="suggestion-item-category">${tool.category.toUpperCase()}</span>
            </div>
        `).join('');

        searchResults.style.display = 'block';

        // Add Click Handlers to Suggestion Items
        searchResults.querySelectorAll('.search-suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const slug = item.getAttribute('data-slug');
                if (slug) {
                    searchResults.style.display = 'none';
                    navigate(`/tools/${slug}`);
                }
            });
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderHeroSearchResults(e.target.value);
            // Also sync with global search if present
            const globalSearch = document.getElementById('globalSearch');
            if (globalSearch && globalSearch !== searchInput) {
                globalSearch.value = e.target.value;
            }
        });

        searchInput.addEventListener('keydown', (e) => {
            const items = searchResults.querySelectorAll('.search-suggestion-item');
            if (searchResults.style.display !== 'none' && items.length > 0) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
                    updateActiveSuggestion(items);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length;
                    updateActiveSuggestion(items);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (activeSuggestionIndex >= 0 && items[activeSuggestionIndex]) {
                        const slug = items[activeSuggestionIndex].getAttribute('data-slug');
                        if (slug) {
                            searchResults.style.display = 'none';
                            navigate(`/tools/${slug}`);
                        }
                    } else if (items[0]) {
                        const slug = items[0].getAttribute('data-slug');
                        if (slug) {
                            searchResults.style.display = 'none';
                            navigate(`/tools/${slug}`);
                        }
                    }
                } else if (e.key === 'Escape') {
                    searchResults.style.display = 'none';
                }
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
                renderHeroSearchResults('');
            }
        });
    }

    // Close search dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!heroSection.contains(e.target)) {
            if (searchResults) searchResults.style.display = 'none';
        }
    });

    const updateActiveSuggestion = (items) => {
        items.forEach((item, idx) => {
            if (idx === activeSuggestionIndex) {
                item.classList.add('active');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    };

    container.appendChild(heroSection);
};

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[m]));
}

function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const escapedText = escapeHtml(text);
    const lower = escapedText.toLowerCase();
    const index = lower.indexOf(query);
    if (index === -1) return escapedText;
    const match = escapedText.substring(index, index + query.length);
    return `${escapedText.substring(0, index)}<mark class="search-highlight">${match}</mark>${escapedText.substring(index + query.length)}`;
}
