import './styles/variables.css';
import './styles/main.css';

import { tools, categories, toKebabCase } from './tools/toolRegistry.js';
import { renderHeader } from './components/Header.js';
import { renderHero } from './components/Hero.js';
import { renderFooter } from './components/Footer.js';
import { createToolCard } from './utils/dom.js';
import { safeStorage } from './utils/safeStorage.js';
import { initErrorHandling } from './utils/errorHandler.js';
import { Analytics, AnalyticsEvents } from './analytics/analytics.js';
import { updateSEO } from './seo.js';
import { initRouter, navigate } from './router.js';
import { renderToolPage } from './components/LandingPage.js';
import { renderCategoryPage } from './components/CategoryPage.js';
import { renderArticlePage } from './components/ArticlePage.js';
import { renderContentHubPage } from './components/ContentHubPage.js';
import { renderAdminDashboard } from './components/AdminDashboard.js';
import { renderPrivacyPolicy } from './components/legal/PrivacyPolicy.js';
import { renderTermsOfService } from './components/legal/TermsOfService.js';
import { renderDisclaimer } from './components/legal/Disclaimer.js';
import { renderContact } from './components/legal/Contact.js';
import { articles } from './tools/articleRegistry.js';
import { initWebVitals } from './utils/webVitals.js';
import { getFavorites, getRecentlyUsed, isFavorite, logSearchQuery } from './utils/userStorage.js';

// Initialize Web Vitals observer
initWebVitals();

// Update SEO dynamically based on central config
updateSEO(window.location.pathname);

// Initialize Global Security Error Boundaries
initErrorHandling();

// Initialize Analytics
Analytics.init();
Analytics.pageView();

// PWA Service Worker Registration
let newWorker;
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
            reg.addEventListener('updatefound', () => {
                newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        Analytics.event(AnalyticsEvents.PWA_UPDATE_AVAILABLE);
                        showUpdateBanner();
                    }
                });
            });
        }).catch((error) => {
            console.error('ServiceWorker registration failed:', error);
        });
        
        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    });
}

function showUpdateBanner() {
    if (document.querySelector('.update-banner')) return;
    const banner = document.createElement('div');
    banner.className = 'pwa-banner update-banner';
    banner.innerHTML = `
        <div class="banner-content">
            <strong>New version available</strong>
            <span>Update to get the latest features.</span>
        </div>
        <div class="banner-actions">
            <button id="pwa-refresh-btn" class="btn-primary">Refresh</button>
            <button id="pwa-dismiss-update" class="btn-secondary">Skip</button>
        </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-refresh-btn').addEventListener('click', () => {
        if (newWorker) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
        }
    });

    document.getElementById('pwa-dismiss-update').addEventListener('click', () => {
        banner.remove();
    });
}
const getCategoryByPath = (path) => {
    const clean = path.toLowerCase().replace(/^\/+/, '').replace(/\/+$/, '');
    if (clean === 'calculators' || clean === 'calculator') {
        return categories.find(c => c.id === 'calculator');
    }
    if (clean === 'dev-tools' || clean === 'developer-tools' || clean === 'developer') {
        return categories.find(c => c.id === 'developer');
    }
    const suffixIndex = clean.indexOf('-tools');
    if (suffixIndex !== -1) {
        const catId = clean.substring(0, suffixIndex);
        return categories.find(c => c.id === catId);
    }
    return categories.find(c => c.id === clean);
};

const getCategoryCanonicalPath = (category) => {
    if (category.id === 'calculator') {
        return '/calculators';
    }
    return `/${category.id}-tools`;
};

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    app.innerHTML = ''; // Clear prerendered HTML
    
    // 1. Render static Header
    const header = renderHeader();
    app.appendChild(header);

    // 2. Main content wrapper (the Router view)
    const mainContent = document.createElement('main');
    mainContent.id = 'router-view';
    app.appendChild(mainContent);

    // 3. Render static Footer
    const footer = renderFooter();
    app.appendChild(footer);

    // 4. Initialize History Router
    initRouter((rawPath) => {
        // Track analytics page view on route transition
        Analytics.pageView(rawPath);

        // Remove pre-rendered SEO content silo to prevent duplicate H1 tags and content
        const seoSilo = document.getElementById('seo-content-silo');
        if (seoSilo) {
            seoSilo.remove();
        }

        // Normalize path: trim whitespace and strip trailing slash (except homepage)
        let path = rawPath.trim();
        if (path.length > 1 && path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        // Silent browser URL rewrite if it has trailing slashes
        if (rawPath !== path) {
            window.history.replaceState({}, '', path);
        }

        // Update SEO dynamically (Canonical, OG URL, JSON-LD) using normalized path
        updateSEO(path);
        
        if (path === '/' || path === '/index.html') {
            document.title = 'Student Utility Hub - 50+ Free Online Tools & Calculators';
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', 'Student Utility Hub offers 75+ free online client-side tools for PDF, images, calculators, and developers. Fast, secure, and processes all files locally.');
            }
            renderHomePage(mainContent);
        } else if (path.startsWith('/tools/')) {
            const slug = path.split('/tools/')[1];
            const cleanSlug = slug.toLowerCase().replace(/\/+$/, '');
            const tool = tools.find(t => {
                const tSlug = (t.slug || '').toLowerCase();
                const tId = (t.id || '').toLowerCase();
                return tSlug === cleanSlug || 
                       tId === cleanSlug ||
                       toKebabCase(tSlug) === toKebabCase(cleanSlug) ||
                       toKebabCase(tId) === toKebabCase(cleanSlug);
            });
            if (tool) {
                const canonicalPath = `/tools/${tool.slug}`;
                if (path !== canonicalPath) {
                    window.history.replaceState({}, '', canonicalPath);
                }
                renderToolPage(mainContent, tool);
            } else {
                render404(mainContent);
            }
        } else if (path === '/blog') {
            renderContentHubPage(mainContent);
        } else if (path === '/analytics-dashboard') {
            renderAdminDashboard(mainContent);
        } else if (path.startsWith('/guides/')) {
            const slug = path.split('/guides/')[1];
            const cleanSlug = slug.toLowerCase().replace(/\/+$/, '');
            const article = articles.find(a => 
                (a.slug || '').toLowerCase() === cleanSlug || 
                (a.id || '').toLowerCase() === cleanSlug
            );
            if (article) {
                const canonicalPath = `/guides/${article.slug}`;
                if (path !== canonicalPath) {
                    window.history.replaceState({}, '', canonicalPath);
                }
                renderArticlePage(mainContent, article);
            } else {
                render404(mainContent);
            }
        } else if (path === '/privacy-policy') {
            renderPrivacyPolicy(mainContent);
        } else if (path === '/terms-of-service') {
            renderTermsOfService(mainContent);
        } else if (path === '/disclaimer') {
            renderDisclaimer(mainContent);
        } else if (path === '/contact') {
            renderContact(mainContent);
        } else {
            const category = getCategoryByPath(path);
            if (category) {
                const canonicalPath = getCategoryCanonicalPath(category);
                if (path !== canonicalPath) {
                    window.history.replaceState({}, '', canonicalPath);
                }
                renderCategoryPage(mainContent, category);
            } else {
                render404(mainContent);
            }
        }
    });
});

// Render Home Page Layout
const renderHomePage = (container) => {
    container.innerHTML = `
        <div class="ad-placeholder top-ad" style="margin-top:1rem;"></div>
        <div id="hero-section"></div>
        <div class="ad-placeholder inline-ad" style="margin: 1.5rem 0;"></div>
        <div class="tool-grid"></div>
    `;

    const heroSection = container.querySelector('#hero-section');
    renderHero(heroSection);

    const toolGrid = container.querySelector('.tool-grid');

    const renderSkeleton = () => {
        toolGrid.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            toolGrid.innerHTML += `
                <div class="skeleton-card">
                    <div class="skeleton skeleton-header"></div>
                    <div class="skeleton skeleton-icon"></div>
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text short"></div>
                    <div class="skeleton skeleton-button"></div>
                </div>
            `;
        }
    };

    const renderTools = (categoryFilter = 'all', searchQuery = '') => {
        toolGrid.innerHTML = '';
        const lowerQuery = searchQuery.toLowerCase();
        if (searchQuery) logSearchQuery(searchQuery);

        const favsList = getFavorites();
        const recentList = getRecentlyUsed();

        const filteredTools = tools.filter(tool => {
            const matchesCategory = categoryFilter === 'all' ? true :
                                  categoryFilter === 'favorites' ? favsList.includes(tool.id) :
                                  tool.category === categoryFilter;
            const matchesSearch = tool.name.toLowerCase().includes(lowerQuery) || 
                                  tool.description.toLowerCase().includes(lowerQuery) ||
                                  (tool.keywords && tool.keywords.some(k => k.toLowerCase().includes(lowerQuery)));
            return matchesCategory && matchesSearch;
        });

        // Search Ranking Prioritization: Favorites & Recently Used sorted to top
        filteredTools.sort((a, b) => {
            const scoreA = (favsList.includes(a.id) ? 10 : 0) + (recentList.includes(a.id) ? 5 : 0);
            const scoreB = (favsList.includes(b.id) ? 10 : 0) + (recentList.includes(b.id) ? 5 : 0);
            return scoreB - scoreA;
        });

        const filteredArticles = articles.filter(art => {
            const matchesCategory = categoryFilter === 'all' || art.category === categoryFilter;
            const matchesSearch = art.title.toLowerCase().includes(lowerQuery) || 
                                  art.summary.toLowerCase().includes(lowerQuery) ||
                                  (art.keywords && art.keywords.some(k => k.toLowerCase().includes(lowerQuery)));
            return matchesCategory && matchesSearch;
        });

        const totalItemsCount = filteredTools.length + filteredArticles.length;

        const isInitialRender = toolGrid.children.length === 0 || toolGrid.querySelector('.skeleton-card');
        
        if (isInitialRender) {
            renderSkeleton();
            setTimeout(() => {
                populateGrid();
            }, 300); // Premium skeleton delay
        } else {
            populateGrid();
        }
        
        function populateGrid() {
            toolGrid.innerHTML = '';
            
            if (totalItemsCount === 0) {
                toolGrid.innerHTML = `
                    <div class="no-results" style="grid-column: 1/-1;">
                        <span class="no-results-icon">🔍</span>
                        <h3>No matching tools or articles found</h3>
                        <p>We couldn't find any results matching your query. Try resetting your search or exploring all categories.</p>
                        <button type="button" class="primary-btn reset-search-btn" id="resetSearchBtn" style="min-height:44px; padding:0.6rem 1.4rem; font-size:0.95rem;">Clear Search & Show All</button>
                    </div>
                `;
                const resetBtn = toolGrid.querySelector('#resetSearchBtn');
                if (resetBtn) {
                    resetBtn.addEventListener('click', () => {
                        const searchInput = document.getElementById('globalSearch');
                        if (searchInput) searchInput.value = '';
                        renderTools('all', '');
                    });
                }
                return;
            }

            // Render matching tools
            filteredTools.forEach((tool, index) => {
                const card = createToolCard(tool);
                card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.04}s`;
                card.style.opacity = '0';
                
                // Intercept tool link click for SPA transitions
                const btn = card.querySelector('.tool-button');
                if (btn) {
                    btn.onclick = (e) => {
                        e.preventDefault();
                        navigate(`/tools/${tool.slug}`);
                    };
                }
                
                toolGrid.appendChild(card);
            });

            // Render matching articles
            filteredArticles.forEach((art, index) => {
                const card = document.createElement('div');
                card.className = 'tool-card';
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.justifyContent = 'space-between';
                card.style.animation = `fadeInUp 0.5s ease forwards ${(filteredTools.length + index) * 0.04}s`;
                card.style.opacity = '0';

                card.innerHTML = `
                    <div class="card-header" style="margin-bottom:0.75rem;">
                        <span class="card-badge category-badge" style="background:var(--primary-light); color:var(--primary-color);">📚 GUIDE</span>
                        <span style="font-size:0.8rem; color:var(--text-secondary);">${art.readTime}</span>
                    </div>
                    <div class="card-body" style="flex-grow:1; text-align:left;">
                        <h3 style="font-size:1.2rem; line-height:1.4; color:var(--text-primary); margin-bottom:0.5rem; font-weight:700;">${art.title}</h3>
                        <p style="font-size:0.85rem; line-height:1.5; color:var(--text-secondary);">${art.summary}</p>
                    </div>
                    <div class="card-footer" style="margin-top:1.5rem;">
                        <a href="/guides/${art.slug}" class="tool-button" style="text-decoration:none; display:block; text-align:center;">
                            <span>Read Guide</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </a>
                    </div>
                `;

                card.querySelector('a').onclick = (e) => {
                    e.preventDefault();
                    navigate(`/guides/${art.slug}`);
                };

                toolGrid.appendChild(card);
            });
        }
    };

    renderTools();

    // Setup filter categories click events
    const filterContainer = container.querySelector('.category-filters');
    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                const category = e.target.getAttribute('data-category');
                const searchInput = document.getElementById('globalSearch');
                renderTools(category, searchInput ? searchInput.value : '');
                
                Analytics.event(AnalyticsEvents.CATEGORY_FILTER, { category });
            }
        });
    }

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(null, args);
            }, delay);
        };
    };

    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            const activeFilter = document.querySelector('.filter-btn.active');
            const activeCategory = activeFilter ? activeFilter.getAttribute('data-category') : 'all';
            renderTools(activeCategory, e.target.value);
            
            if (e.target.value.trim().length > 0) {
                Analytics.event(AnalyticsEvents.SEARCH, { query: e.target.value.trim() });
            }
        }, 300));
    }
};

// Render 404 Page View
const render404 = (container) => {
    document.title = 'Page Not Found - Student Utility Hub';

    // Set noindex meta tag for search engines to prevent soft-404 indexing
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, follow');

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', 'The page or tool you are looking for does not exist.');
    }

    container.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; padding: 5rem 1.5rem; text-align: center; animation: fadeIn 0.4s ease-out;">
            <div style="font-size: 5rem; margin-bottom: 1.5rem;">🛰️</div>
            <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; margin-bottom: 1rem; color: var(--text-primary); line-height: 1.2;">Page Not Found</h1>
            <p style="font-size: 1.15rem; color: var(--text-secondary); margin-bottom: 2.5rem; line-height: 1.6;">
                The tool or category you are looking for does not exist or has been moved. 
                Don't worry, you can search our 75+ free tools below or head back to the homepage.
            </p>
            
            <div style="max-width: 500px; margin: 0 auto 3rem auto; position: relative;">
                <input type="text" id="notFoundSearch" placeholder="Search for PDF, Image, Converters..." style="width: 100%; padding: 1.25rem 1.5rem 1.25rem 3rem; border-radius: var(--radius-lg); border: 1px solid var(--tool-card-border); background: var(--surface-color); color: var(--text-primary); font-size: 1.05rem; box-shadow: var(--shadow-sm);" />
                <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); font-size: 1.2rem;">🔍</span>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="/" class="primary-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; padding:1rem 2rem; border-radius: var(--radius-md);">
                    🏠 Back to Home
                </a>
                <a href="/tools/pdf-merge" class="secondary-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; padding:1rem 2rem; border-radius: var(--radius-md); border: 1px solid var(--tool-card-border);">
                    📄 Try PDF Merger
                </a>
            </div>
        </div>
    `;

    setTimeout(() => {
        const searchInput = document.getElementById('notFoundSearch');
        if (searchInput) {
            searchInput.focus();
            searchInput.addEventListener('input', (e) => {
                const val = e.target.value;
                const globalSearch = document.getElementById('globalSearch');
                if (globalSearch && val.trim().length > 0) {
                    globalSearch.value = val;
                    // Trigger global search UI or navigate home to search
                    navigate('/');
                    setTimeout(() => {
                        const newGlobal = document.getElementById('globalSearch');
                        if (newGlobal) {
                            newGlobal.value = val;
                            newGlobal.dispatchEvent(new Event('input', { bubbles: true }));
                            newGlobal.focus();
                        }
                    }, 100);
                }
            });
        }
    }, 100);
};
