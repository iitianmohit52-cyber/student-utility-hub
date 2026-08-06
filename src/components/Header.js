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
            
            <div class="hamburger-menu" id="mobileMenuBtn">
                <span></span><span></span><span></span>
            </div>

            <div class="header-actions" id="navMenu">
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
        <div class="mobile-nav-overlay" id="mobileNavOverlay"></div>
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

    // Mobile Menu Logic
    const mobileBtn = header.querySelector('#mobileMenuBtn');
    const navMenu = header.querySelector('#navMenu');
    const overlay = header.querySelector('#mobileNavOverlay');

    const closeMenu = () => {
        mobileBtn.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    const toggleMenu = () => {
        const isActive = navMenu.classList.contains('active');
        if (isActive) {
            closeMenu();
        } else {
            mobileBtn.classList.add('active');
            navMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    mobileBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // Close menu when clicking nav links
    header.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    return header;
};
