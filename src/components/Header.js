import { createElement } from '../utils/dom.js';
import { safeStorage } from '../utils/safeStorage.js';
import { Analytics, AnalyticsEvents } from '../analytics/analytics.js';

export const renderHeader = () => {
    const header = createElement('header', 'app-header');
    
    header.innerHTML = `
        <div class="header-container">
            <div class="logo">
                <span class="logo-icon">🚀</span>
                <h1>Student Utility Hub<span class="sr-only"> - 20+ Free Online Tools &amp; Calculators</span></h1>
            </div>
            
            <div class="mobile-header-controls">
                <button type="button" class="mobile-search-icon-btn" id="mobileHeaderSearchBtn" aria-label="Open search in menu">🔍</button>
                <div class="hamburger-menu" id="mobileMenuBtn" role="button" tabindex="0" aria-expanded="false" aria-label="Open navigation menu" aria-controls="navMenu">
                    <span></span><span></span><span></span>
                </div>
            </div>

            <div class="header-actions" id="navMenu" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Mobile Navigation Drawer">
                <!-- Mobile Drawer Top Header -->
                <div class="drawer-header">
                    <span class="drawer-title">Navigation</span>
                    <button type="button" class="drawer-close-btn" id="drawerCloseBtn" aria-label="Close navigation menu">✕</button>
                </div>

                <!-- Drawer Search Bar -->
                <div class="drawer-search-container">
                    <span class="drawer-search-icon">🔍</span>
                    <input type="text" id="drawerSearchInput" placeholder="Search 20+ free tools..." aria-label="Search tools">
                </div>

                <!-- Desktop / Main Search Bar -->
                <div class="search-container desktop-search-only">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="globalSearch" placeholder="Search (Ctrl + K)" accesskey="k">
                    <span class="search-shortcut">Ctrl K</span>
                </div>

                <!-- Drawer Navigation Items -->
                <nav class="main-nav">
                    <a href="#" class="nav-link drawer-item"><span class="item-icon">🏠</span> Home</a>
                    <a href="#article-image-tools" class="nav-link drawer-item"><span class="item-icon">🛠</span> About Tools</a>
                    <a href="#popular-tools" class="nav-link drawer-item" id="popularToolsLink"><span class="item-icon">⭐</span> Popular Tools</a>
                    <a href="#category-filters" class="nav-link drawer-item" id="categoriesLink"><span class="item-icon">📚</span> Categories</a>
                    <a href="#footer" class="nav-link drawer-item" id="contactLink"><span class="item-icon">📞</span> Contact</a>
                </nav>

                <!-- iOS-Style Dark Mode Toggle -->
                <div class="ios-theme-container">
                    <span class="ios-theme-label" id="themeLabel">🌙 Dark Mode</span>
                    <label class="ios-toggle-wrapper">
                        <input type="checkbox" id="iosThemeToggle" aria-label="Toggle dark mode">
                        <span class="ios-toggle-track">
                            <span class="ios-toggle-knob"></span>
                        </span>
                    </label>
                </div>

                <!-- Explore CTA Button -->
                <div class="drawer-cta-container">
                    <a href="#tool-grid-section" class="drawer-cta-btn" id="exploreToolsBtn">🚀 Explore All Tools</a>
                </div>

                <!-- Drawer Footer -->
                <div class="drawer-footer">
                    <div class="drawer-footer-brand">🚀 Student Utility Hub</div>
                    <div class="drawer-footer-tagline">20+ Free Client-Side Online Tools</div>
                    <div class="drawer-footer-links">
                        <a href="#article-image-tools">Privacy</a> • <a href="#article-image-tools">Terms</a>
                    </div>
                    <div class="drawer-footer-version">v1.0.0 • Production Ready</div>
                </div>

                <!-- Desktop Theme Toggle Wrapper -->
                <div id="themeToggleContainer" class="desktop-theme-only"></div>
            </div>
        </div>
        <div class="mobile-nav-overlay" id="mobileNavOverlay" aria-hidden="true"></div>
    `;

    // References
    const searchInput = header.querySelector('#globalSearch');
    const drawerSearchInput = header.querySelector('#drawerSearchInput');
    const mobileHeaderSearchBtn = header.querySelector('#mobileHeaderSearchBtn');
    const mobileBtn = header.querySelector('#mobileMenuBtn');
    const drawerCloseBtn = header.querySelector('#drawerCloseBtn');
    const navMenu = header.querySelector('#navMenu');
    const overlay = header.querySelector('#mobileNavOverlay');
    const iosThemeToggle = header.querySelector('#iosThemeToggle');
    const themeLabel = header.querySelector('#themeLabel');
    let isPushedState = false;

    // Theme Management Logic (Preserves existing theme attributes)
    const currentTheme = safeStorage.getItem('theme', 'dark');
    document.documentElement.setAttribute('data-theme', currentTheme);
    iosThemeToggle.checked = currentTheme === 'dark';
    themeLabel.textContent = currentTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode';

    const updateTheme = (newTheme) => {
        document.documentElement.setAttribute('data-theme', newTheme);
        safeStorage.setItem('theme', newTheme);
        Analytics.event(AnalyticsEvents.THEME_CHANGE, { to: newTheme });
        iosThemeToggle.checked = newTheme === 'dark';
        themeLabel.textContent = newTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode';
    };

    iosThemeToggle.addEventListener('change', (e) => {
        const newTheme = e.target.checked ? 'dark' : 'light';
        updateTheme(newTheme);
    });

    // Keyboard shortcut (Ctrl + K)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (window.innerWidth <= 768) {
                openMenu(true);
            } else {
                searchInput.focus();
            }
        }
    });

    // Sync Live Search between Drawer & Main Search Engine
    drawerSearchInput.addEventListener('input', (e) => {
        searchInput.value = e.target.value;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Drawer Open / Close Functions
    const closeMenu = (fromPopState = false) => {
        if (!navMenu.classList.contains('active')) return;

        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.setAttribute('aria-label', 'Open navigation menu');
        
        navMenu.classList.remove('active');
        navMenu.setAttribute('aria-hidden', 'true');
        
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        
        document.body.style.overflow = '';

        if (isPushedState && !fromPopState) {
            isPushedState = false;
            if (window.history.state?.drawerOpen) {
                window.history.back();
            }
        }
        if (fromPopState) {
            isPushedState = false;
        }

        // Return focus to hamburger button
        setTimeout(() => mobileBtn.focus(), 50);
    };

    const openMenu = (focusSearch = false) => {
        if (navMenu.classList.contains('active')) return;

        mobileBtn.classList.add('active');
        mobileBtn.setAttribute('aria-expanded', 'true');
        mobileBtn.setAttribute('aria-label', 'Close navigation menu');
        
        navMenu.classList.add('active');
        navMenu.setAttribute('aria-hidden', 'false');
        
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        
        document.body.style.overflow = 'hidden';

        if (!isPushedState) {
            window.history.pushState({ drawerOpen: true }, '');
            isPushedState = true;
        }

        // Focus trap & auto-focus logic
        setTimeout(() => {
            if (focusSearch) {
                drawerSearchInput.focus();
            } else {
                drawerCloseBtn.focus();
            }
        }, 100);
    };

    const toggleMenu = () => {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu(false);
        }
    };

    // Event Listeners
    mobileBtn.addEventListener('click', toggleMenu);
    mobileHeaderSearchBtn.addEventListener('click', () => openMenu(true));
    drawerCloseBtn.addEventListener('click', () => closeMenu());
    overlay.addEventListener('click', () => closeMenu());

    // Navigation Links Click Handler
    header.querySelectorAll('.nav-link, .drawer-cta-btn').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            closeMenu();
            
            // Custom scroll logic for categories / popular
            if (targetId === '#category-filters') {
                const categoryEl = document.querySelector('.category-filters');
                if (categoryEl) categoryEl.scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === '#popular-tools') {
                const popularBtn = document.querySelector('.filter-btn[data-category="popular"]');
                if (popularBtn) popularBtn.click();
            }
        });
    });

    // Keyboard Accessibility: Escape key and Focus Trap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }

        // Focus Trap inside drawer
        if (navMenu.classList.contains('active') && e.key === 'Tab') {
            const focusableEls = navMenu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstFocusable = focusableEls[0];
            const lastFocusable = focusableEls[focusableEls.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });

    // Android / Browser Back Button Listener
    window.addEventListener('popstate', () => {
        if (navMenu.classList.contains('active')) {
            closeMenu(true);
        }
    });

    return header;
};
