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
            
            <div class="hamburger-menu" id="mobileMenuBtn" role="button" tabindex="0" aria-expanded="false" aria-label="Open navigation menu" aria-controls="navMenu">
                <span></span><span></span><span></span>
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
    `;

    // Initialize Theme Toggle
    const themeContainer = header.querySelector('#themeToggleContainer');
    setupThemeToggle(themeContainer);

    // Setup Search Logic
    const searchInput = header.querySelector('#globalSearch');
    
    // Keyboard shortcut (Ctrl + K)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
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

        // Focus first interactive element inside drawer
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

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Handle Android / Browser Back Button
    window.addEventListener('popstate', (e) => {
        if (navMenu.classList.contains('active')) {
            closeMenu(true);
        }
    });

    return header;
};
