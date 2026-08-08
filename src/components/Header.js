import { createElement } from '../utils/dom.js';
import { safeStorage } from '../utils/safeStorage.js';
import { Analytics, AnalyticsEvents } from '../analytics/analytics.js';

export const renderHeader = () => {
    const header = createElement('header', 'app-header');
    
    header.innerHTML = `
        <div class="header-container">
            <div class="logo">
                <a href="/" style="display:flex; align-items:center; text-decoration:none; gap:0.5rem;">
                    <img src="/logo.png" alt="Student Utility Hub Logo" class="brand-logo" />
                    <h1>Student Utility Hub<span class="sr-only"> - 75+ Free Online Tools</span></h1>
                </a>
            </div>
            
            <div class="mobile-header-controls">
                <button type="button" class="mobile-search-icon-btn" id="mobileHeaderSearchBtn" aria-label="Open search modal">🔍</button>
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
                    <input type="text" id="drawerSearchInput" placeholder="Search 50+ free tools..." aria-label="Search tools in drawer">
                </div>

                <!-- Desktop / Main Search Bar -->
                <div class="search-container desktop-search-only">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="globalSearch" placeholder="Search (Ctrl + K)" accesskey="k" aria-label="Global tool search">
                    <span class="search-shortcut">Ctrl K</span>
                </div>

                <!-- Drawer Navigation Items -->
                <nav class="main-nav">
                    <a href="/" class="nav-link drawer-item"><span class="item-icon">🏠</span> Home</a>
                    <a href="/pdf-tools" class="nav-link drawer-item"><span class="item-icon">📄</span> PDF Tools</a>
                    <a href="/image-tools" class="nav-link drawer-item"><span class="item-icon">🖼️</span> Image Tools</a>
                    <a href="/developer-tools" class="nav-link drawer-item"><span class="item-icon">💻</span> Dev Tools</a>
                    <a href="/calculators" class="nav-link drawer-item"><span class="item-icon">🧮</span> Calculators</a>
                </nav>

                <!-- iOS-Style Dark Mode Toggle -->
                <div class="ios-theme-container">
                    <span class="ios-theme-label" id="themeLabel">🌙 Dark Mode</span>
                    <label class="ios-toggle-wrapper" aria-label="Toggle Theme">
                        <input type="checkbox" id="iosThemeToggle" aria-label="Toggle dark mode">
                        <span class="ios-toggle-track">
                            <span class="ios-toggle-knob"></span>
                        </span>
                    </label>
                </div>

                <!-- Explore CTA Button -->
                <div class="drawer-cta-container">
                    <a href="/" class="drawer-cta-btn" id="exploreToolsBtn">Explore All 75+ Tools</a>
                </div>

                <!-- Drawer Footer -->
                <div class="drawer-footer">
                    <div class="drawer-footer-brand">Student Utility Hub</div>
                    <div class="drawer-footer-tagline">50+ Free Client-Side Online Tools</div>
                    <div class="drawer-footer-links">
                        <a href="/privacy-policy" class="nav-link">Privacy</a> • <a href="/terms-of-service" class="nav-link">Terms</a>
                    </div>
                    <div class="drawer-footer-version">v1.0.0 • Production Ready</div>
                </div>

                <!-- Desktop Theme Toggle Wrapper -->
                <div id="themeToggleContainer" class="desktop-theme-only"></div>
            </div>
        </div>
        
        <!-- Backdrop Overlays -->
        <div class="mobile-nav-overlay" id="mobileNavOverlay" aria-hidden="true"></div>

        <!-- Global Dedicated Mobile Search Overlay -->
        <div class="mobile-search-overlay" id="mobileSearchOverlay" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Search tools">
            <div class="mobile-search-box-wrapper">
                <div class="mobile-search-box">
                    <span class="mobile-search-box-icon">🔍</span>
                    <input type="text" id="mobileSearchBoxInput" placeholder="Search 50+ free tools..." aria-label="Search tools input">
                    <button type="button" class="clear-search-btn" id="clearMobileSearchBtn" aria-label="Clear search" style="display:none;">✕</button>
                    <button type="button" class="close-search-btn" id="closeMobileSearchBtn">Cancel</button>
                </div>
                <div class="search-suggestions">
                    <span class="suggestion-label">Popular Searches</span>
                    <div class="suggestion-pills">
                        <button type="button" class="suggestion-pill" data-query="PDF">📄 PDF Merger</button>
                        <button type="button" class="suggestion-pill" data-query="Image">🖼️ Image Converter</button>
                        <button type="button" class="suggestion-pill" data-query="CGPA">🎓 CGPA Calculator</button>
                        <button type="button" class="suggestion-pill" data-query="EMI">📊 EMI Calculator</button>
                        <button type="button" class="suggestion-pill" data-query="Password">🔒 Password Generator</button>
                    </div>
                </div>
            </div>
        </div>
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

    // Mobile Search Overlay References
    const mobileSearchOverlay = header.querySelector('#mobileSearchOverlay');
    const mobileSearchBoxInput = header.querySelector('#mobileSearchBoxInput');
    const clearMobileSearchBtn = header.querySelector('#clearMobileSearchBtn');
    const closeMobileSearchBtn = header.querySelector('#closeMobileSearchBtn');

    let isDrawerPushedState = false;
    let isSearchPushedState = false;

    // Suggestion Pills Click Listeners
    header.querySelectorAll('.suggestion-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const query = pill.getAttribute('data-query');
            syncSearch(query);
            closeSearchOverlay();
            const gridEl = document.querySelector('.tool-grid');
            if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
        });
    });


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

    // Sync Live Search between inputs
    const syncSearch = (val) => {
        if (searchInput) searchInput.value = val;
        if (drawerSearchInput) drawerSearchInput.value = val;
        if (mobileSearchBoxInput) mobileSearchBoxInput.value = val;
        
        if (clearMobileSearchBtn) {
            clearMobileSearchBtn.style.display = val ? 'flex' : 'none';
        }
        
        if (val && val.trim().length >= 2) {
            Analytics.event(AnalyticsEvents.SEARCH, { query: val });
        }

        if (searchInput) {
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    drawerSearchInput.addEventListener('input', (e) => syncSearch(e.target.value));
    mobileSearchBoxInput.addEventListener('input', (e) => syncSearch(e.target.value));
    
    clearMobileSearchBtn.addEventListener('click', () => {
        syncSearch('');
        mobileSearchBoxInput.focus();
    });

    // Mobile Search Overlay Functions
    const openSearchOverlay = () => {
        if (mobileSearchOverlay.classList.contains('active')) return;
        
        // Close drawer if open
        closeMenu();

        mobileSearchOverlay.classList.add('active');
        mobileSearchOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (!isSearchPushedState) {
            window.history.pushState({ searchOpen: true }, '');
            isSearchPushedState = true;
        }

        setTimeout(() => mobileSearchBoxInput.focus(), 100);
    };

    const closeSearchOverlay = (fromPopState = false) => {
        if (!mobileSearchOverlay.classList.contains('active')) return;

        mobileSearchOverlay.classList.remove('active');
        mobileSearchOverlay.setAttribute('aria-hidden', 'true');
        
        if (!navMenu.classList.contains('active')) {
            document.body.style.overflow = '';
        }

        if (isSearchPushedState && !fromPopState) {
            isSearchPushedState = false;
            if (window.history.state?.searchOpen) {
                window.history.back();
            }
        }
        if (fromPopState) {
            isSearchPushedState = false;
        }

        setTimeout(() => mobileHeaderSearchBtn.focus(), 50);
    };

    mobileHeaderSearchBtn.addEventListener('click', openSearchOverlay);
    closeMobileSearchBtn.addEventListener('click', () => closeSearchOverlay());
    mobileSearchOverlay.addEventListener('click', (e) => {
        if (e.target === mobileSearchOverlay) closeSearchOverlay();
    });

    // Global Keyboard Shortcut (Ctrl + K)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (window.innerWidth <= 768) {
                openSearchOverlay();
            } else if (searchInput) {
                searchInput.focus();
            }
        }
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
        
        if (!mobileSearchOverlay.classList.contains('active')) {
            document.body.style.overflow = '';
        }

        if (isDrawerPushedState && !fromPopState) {
            isDrawerPushedState = false;
            if (window.history.state?.drawerOpen) {
                window.history.back();
            }
        }
        if (fromPopState) {
            isDrawerPushedState = false;
        }

        setTimeout(() => mobileBtn.focus(), 50);
    };

    const openMenu = (focusSearch = false) => {
        if (navMenu.classList.contains('active')) return;

        // Close search overlay if open
        closeSearchOverlay();

        mobileBtn.classList.add('active');
        mobileBtn.setAttribute('aria-expanded', 'true');
        mobileBtn.setAttribute('aria-label', 'Close navigation menu');
        
        navMenu.classList.add('active');
        navMenu.setAttribute('aria-hidden', 'false');
        
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        
        document.body.style.overflow = 'hidden';

        if (!isDrawerPushedState) {
            window.history.pushState({ drawerOpen: true }, '');
            isDrawerPushedState = true;
        }

        setTimeout(() => {
            if (focusSearch && drawerSearchInput) {
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
    drawerCloseBtn.addEventListener('click', () => closeMenu());
    overlay.addEventListener('click', () => closeMenu());

    // Navigation Links Click Handler
    header.querySelectorAll('.nav-link, .drawer-cta-btn').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Keyboard Accessibility: Escape key and Focus Trap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            }
            if (mobileSearchOverlay.classList.contains('active')) {
                closeSearchOverlay();
            }
        }

        // Focus Trap inside drawer
        if (navMenu.classList.contains('active') && e.key === 'Tab') {
            const focusableEls = navMenu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableEls.length > 0) {
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
        }
    });

    // Android / Browser Back Button Listener
    window.addEventListener('popstate', () => {
        if (navMenu.classList.contains('active')) {
            closeMenu(true);
        }
        if (mobileSearchOverlay.classList.contains('active')) {
            closeSearchOverlay(true);
        }
    });

    return header;
};

