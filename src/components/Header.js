import { createElement } from '../utils/dom.js';
import { setupThemeToggle } from './ThemeToggle.js';

export const renderHeader = () => {
    const header = createElement('header', 'app-header');
    
    header.innerHTML = `
        <div class="header-container">
            <div class="logo">
                <span class="logo-icon">🚀</span>
                <h1>Student Utility Hub<span class="sr-only"> - 20+ Free Online Tools &amp; Calculators</span></h1>
            </div>
            
            <div class="mobile-header-controls">
                <button type="button" class="mobile-search-btn" id="mobileSearchBtn" aria-label="Open search">🔍</button>
                <div class="hamburger-menu" id="mobileMenuBtn" role="button" tabindex="0" aria-expanded="false" aria-label="Open navigation menu" aria-controls="navMenu">
                    <span></span><span></span><span></span>
                </div>
            </div>

            <div class="header-actions" id="navMenu" aria-hidden="true">
                <nav class="main-nav">
                    <a href="#" class="nav-link">Home</a>
                    <a href="#article-image-tools" class="nav-link">About Tools</a>
                </nav>
                <div class="search-container">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="globalSearch" placeholder="Search (Ctrl + K)" accesskey="k">
                    <span class="search-shortcut">Ctrl K</span>
                </div>
                <div id="themeToggleContainer"></div>
            </div>
        </div>
        <div class="mobile-nav-overlay" id="mobileNavOverlay" aria-hidden="true"></div>

        <!-- Mobile Search Overlay Modal -->
        <div class="mobile-search-overlay" id="mobileSearchOverlay" aria-hidden="true">
            <div class="mobile-search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="mobileSearchInput" placeholder="Search 20+ free tools..." aria-label="Search tools">
                <button type="button" class="close-search-btn" id="closeSearchBtn" aria-label="Close search">✕</button>
            </div>
        </div>
    `;

    // Initialize Theme Toggle
    const themeContainer = header.querySelector('#themeToggleContainer');
    setupThemeToggle(themeContainer);

    // Setup Search Logic (Desktop)
    const searchInput = header.querySelector('#globalSearch');
    
    // Keyboard shortcut (Ctrl + K)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (window.innerWidth <= 768) {
                openMobileSearch();
            } else {
                searchInput.focus();
            }
        }
    });

    // Mobile Search Modal Logic
    const mobileSearchBtn = header.querySelector('#mobileSearchBtn');
    const mobileSearchOverlay = header.querySelector('#mobileSearchOverlay');
    const mobileSearchInput = header.querySelector('#mobileSearchInput');
    const closeSearchBtn = header.querySelector('#closeSearchBtn');

    const openMobileSearch = () => {
        mobileSearchOverlay.classList.add('active');
        mobileSearchOverlay.setAttribute('aria-hidden', 'false');
        mobileSearchInput.value = searchInput.value;
        setTimeout(() => mobileSearchInput.focus(), 50);
    };

    const closeMobileSearch = () => {
        mobileSearchOverlay.classList.remove('active');
        mobileSearchOverlay.setAttribute('aria-hidden', 'true');
    };

    mobileSearchBtn.addEventListener('click', openMobileSearch);
    closeSearchBtn.addEventListener('click', closeMobileSearch);

    mobileSearchOverlay.addEventListener('click', (e) => {
        if (e.target === mobileSearchOverlay) {
            closeMobileSearch();
        }
    });

    // Live search sync between mobile search input & main search logic
    mobileSearchInput.addEventListener('input', (e) => {
        searchInput.value = e.target.value;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Mobile Menu Logic with Accessibility & Android Back Button Support
    const mobileBtn = header.querySelector('#mobileMenuBtn');
    const navMenu = header.querySelector('#navMenu');
    const overlay = header.querySelector('#mobileNavOverlay');
    let isPushedState = false;

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
    };

    const openMenu = () => {
        if (navMenu.classList.contains('active')) return;

        // Close search if open
        closeMobileSearch();

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

        const firstFocusable = navMenu.querySelector('a, input, button');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    };

    const toggleMenu = () => {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    mobileBtn.addEventListener('click', toggleMenu);
    mobileBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    overlay.addEventListener('click', () => closeMenu());

    // Close menu when clicking nav links
    header.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => closeMenu());
    });

    // Close menu or search on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (mobileSearchOverlay.classList.contains('active')) {
                closeMobileSearch();
            } else if (navMenu.classList.contains('active')) {
                closeMenu();
            }
        }
    });

    // Handle Android / Browser Back Button
    window.addEventListener('popstate', (e) => {
        if (mobileSearchOverlay.classList.contains('active')) {
            closeMobileSearch();
        } else if (navMenu.classList.contains('active')) {
            closeMenu(true);
        }
    });

    return header;
};
