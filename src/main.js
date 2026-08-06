import './styles/variables.css';
import './styles/main.css';

import { tools } from './tools/toolRegistry.js';
import { renderHeader } from './components/Header.js';
import { renderHero } from './components/Hero.js';
import { renderModal } from './components/Modal.js';
import { renderFooter } from './components/Footer.js';
import { createToolCard } from './utils/dom.js';
import { safeStorage } from './utils/safeStorage.js';
import { initErrorHandling } from './utils/errorHandler.js';
import { Analytics, AnalyticsEvents } from './analytics/analytics.js';
import { updateSEO } from './seo.js';

// Update SEO dynamically based on central config
updateSEO();

// Initialize Global Security Error Boundaries
initErrorHandling();

// Initialize Analytics
Analytics.init();
Analytics.pageView();

// PWA Service Worker Registration & Update Flow
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

// Install PWA Flow
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    if (safeStorage.getItem('pwa-dismissed') === 'true') {
        return;
    }
    
    showInstallBanner();
});

function showInstallBanner() {
    if (document.querySelector('.install-banner')) return;
    
    const banner = document.createElement('div');
    banner.className = 'pwa-banner install-banner';
    banner.innerHTML = `
        <div class="banner-content">
            <strong>Install App</strong>
            <span>Get the Student Utility Hub for offline use.</span>
        </div>
        <div class="banner-actions">
            <button id="pwa-install-btn" class="btn-primary">Install</button>
            <button id="pwa-dismiss-install" class="btn-secondary">Not Now</button>
        </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
        banner.remove();
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                Analytics.event(AnalyticsEvents.PWA_INSTALL_ACCEPTED);
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
        }
    });

    document.getElementById('pwa-dismiss-install').addEventListener('click', () => {
        banner.remove();
        safeStorage.setItem('pwa-dismissed', 'true');
        Analytics.event(AnalyticsEvents.PWA_INSTALL_DISMISSED);
    });
}

window.addEventListener('appinstalled', () => {
    const banner = document.querySelector('.install-banner');
    if (banner) banner.remove();
    deferredPrompt = null;
    
    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'pwa-toast success-toast';
    toast.textContent = 'App installed successfully!';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
});

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    
    // 1. Render Header
    const header = renderHeader();
    app.appendChild(header);

    // 2. Main content area with top ad
    const main = document.createElement('main');
    
    const topAd = document.createElement('div');
    topAd.className = 'ad-placeholder top-ad';
    topAd.innerHTML = '<p>Top Banner Ad (728x90 or Responsive)</p>';
    main.appendChild(topAd);
    
    app.appendChild(main);

    // 3. Render Hero Section
    renderHero(main);

    const afterHeroAd = document.createElement('div');
    afterHeroAd.className = 'ad-placeholder inline-ad';
    afterHeroAd.innerHTML = '<p>After Hero Ad (Responsive)</p>';
    main.appendChild(afterHeroAd);

    // 4. Render Tools Grid
    const toolGrid = document.createElement('div');
    toolGrid.className = 'tool-grid';
    main.appendChild(toolGrid);
    
    // Global function to render skeleton
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
            const matchesSearch = tool.name.toLowerCase().includes(lowerQuery) || tool.description.toLowerCase().includes(lowerQuery);
            return matchesCategory && matchesSearch;
        });

        // Simulate tiny network delay for skeleton showcase if not searching instantly
        const isInitialRender = toolGrid.children.length === 0 || toolGrid.querySelector('.skeleton-card');
        
        if (isInitialRender) {
            renderSkeleton();
            setTimeout(() => {
                populateGrid();
            }, 400); // 400ms premium skeleton delay
        } else {
            populateGrid();
        }
        
        function populateGrid() {
            toolGrid.innerHTML = '';
            
            if (filteredTools.length === 0) {
                toolGrid.innerHTML = '<div class="no-results"><span style="font-size:3rem">🔍</span><p>No tools found matching your search.</p></div>';
                return;
            }

            filteredTools.forEach((tool, index) => {
                const card = createToolCard(tool);
                // Staggered entrance animation
                card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.05}s`;
                card.style.opacity = '0';
                
                card.querySelector('.tool-button').addEventListener('click', () => {
                    window.openModal(tool);
                });
                
                toolGrid.appendChild(card);
            });
        }
    };

    renderTools();

    // 5. Setup Event Listeners for Filters & Search
    document.querySelector('.category-filters').addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            const category = e.target.getAttribute('data-category');
            const searchInput = document.getElementById('globalSearch');
            renderTools(category, searchInput.value);
            
            Analytics.event(AnalyticsEvents.CATEGORY_FILTER, { category });
        }
    });

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
    searchInput.addEventListener('input', debounce((e) => {
        const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-category');
        renderTools(activeCategory, e.target.value);
        
        if (e.target.value.trim().length > 0) {
            Analytics.event(AnalyticsEvents.SEARCH, { query: e.target.value.trim() });
        }
    }, 500));

    // 6. Render Modal System
    const modal = renderModal();
    app.appendChild(modal);
    
    // 7. Render Footer
    const footer = renderFooter();
    app.appendChild(footer);
});
