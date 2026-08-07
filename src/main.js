import './styles/variables.css';
import './styles/main.css';

import { tools, categories } from './tools/toolRegistry.js';
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

// Update SEO dynamically based on central config
updateSEO();

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
    initRouter((path) => {
        // Track analytics page view on route transition
        Analytics.pageView(path);
        
        if (path === '/' || path === '/index.html') {
            renderHomePage(mainContent);
        } else if (path.startsWith('/tools/')) {
            const slug = path.split('/tools/')[1];
            const tool = tools.find(t => t.slug === slug || t.id === slug);
            if (tool) {
                renderToolPage(mainContent, tool);
            } else {
                render404(mainContent);
            }
        } else if (path.endsWith('-tools') || path === '/calculators') {
            const categoryId = path.replace('-tools', '').replace('/', '');
            const category = categories.find(c => c.id === categoryId);
            if (category) {
                renderCategoryPage(mainContent, category);
            } else {
                render404(mainContent);
            }
        } else {
            render404(mainContent);
        }
    });
});

// Render Home Page Layout
const renderHomePage = (container) => {
    container.innerHTML = `
        <div class="ad-placeholder top-ad" style="margin-top:1rem;">
            <p>Top Banner Ad (728x90 or Responsive)</p>
        </div>
        <div id="hero-section"></div>
        <div class="ad-placeholder inline-ad" style="margin: 1.5rem 0;">
            <p>After Hero Ad (Responsive)</p>
        </div>
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

        const filteredTools = tools.filter(tool => {
            const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter;
            const matchesSearch = tool.name.toLowerCase().includes(lowerQuery) || 
                                  tool.description.toLowerCase().includes(lowerQuery) ||
                                  (tool.keywords && tool.keywords.some(k => k.toLowerCase().includes(lowerQuery)));
            return matchesCategory && matchesSearch;
        });

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
            
            if (filteredTools.length === 0) {
                toolGrid.innerHTML = `
                    <div class="no-results">
                        <span class="no-results-icon">🔍</span>
                        <h3>No matching tools found</h3>
                        <p>We couldn't find any tools matching your query. Try resetting your search or exploring all categories.</p>
                        <button type="button" class="primary-btn reset-search-btn" id="resetSearchBtn" style="min-height:44px; padding:0.6rem 1.4rem; font-size:0.95rem;">Clear Search & Show All Tools</button>
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
    container.innerHTML = `
        <div style="max-width: var(--max-width); margin: 0 auto; padding: 4rem 1.5rem; text-align: center;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">🛰️</div>
            <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-primary);">404 - Page Not Found</h1>
            <p style="font-size: 1.15rem; color: var(--text-secondary); margin-bottom: 2rem;">
                The tool or category you are looking for does not exist or has been moved.
            </p>
            <a href="/" class="primary-button" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; padding:0.75rem 1.5rem;">
                🏠 Back to Home Page
            </a>
        </div>
    `;
};
