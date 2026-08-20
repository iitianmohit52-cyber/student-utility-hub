import { createElement, createToolCard } from '../utils/dom.js';
import { tools, categories } from '../tools/toolRegistry.js';
import { articles } from '../tools/articleRegistry.js';
import { renderHero } from './Hero.js';
import { navigate } from '../router.js';
import { Analytics, AnalyticsEvents } from '../analytics/analytics.js';

export const renderHomePage = (container) => {
    container.innerHTML = `
        <div class="homepage-wrapper">
            <!-- AdSense Top Banner Slot -->
            <div class="ad-placeholder top-ad" style="margin-top: 1rem;"></div>

            <!-- 1. Hero Section -->
            <div id="hero-section"></div>

            <!-- 2. Trust & Value Strip -->
            <section class="trust-value-section" aria-label="Why use Student Utility Hub">
                <div class="section-header-compact">
                    <span class="section-kicker">BUILT FOR SPEED & SIMPLICITY</span>
                    <h2 class="section-heading-sm">Why use Student Utility Hub?</h2>
                </div>
                <div class="trust-grid">
                    <div class="trust-card">
                        <div class="trust-icon-box">⚡</div>
                        <div class="trust-text">
                            <h3>100% Free to Use</h3>
                            <p>Every utility is completely free with no subscriptions, trials, or hidden fees.</p>
                        </div>
                    </div>
                    <div class="trust-card">
                        <div class="trust-icon-box">🔒</div>
                        <div class="trust-text">
                            <h3>Privacy-Conscious</h3>
                            <p>Applicable tools process files directly in your browser without unnecessary server uploads.</p>
                        </div>
                    </div>
                    <div class="trust-card">
                        <div class="trust-icon-box">🚀</div>
                        <div class="trust-text">
                            <h3>Zero Sign-Up Needed</h3>
                            <p>Jump straight into any calculator, converter, or editor without creating an account.</p>
                        </div>
                    </div>
                    <div class="trust-card">
                        <div class="trust-icon-box">📱</div>
                        <div class="trust-text">
                            <h3>Lightweight & Responsive</h3>
                            <p>Fast, clean interface engineered to run smoothly on mobile, tablet, and desktop.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 3. Popular & Useful Tools Section -->
            <section class="popular-tools-section" id="popular-tools-section" aria-label="Popular and Useful Tools">
                <div class="section-header">
                    <div>
                        <span class="section-kicker">DISCOVER TOP UTILITIES</span>
                        <h2 class="section-heading">Popular & Useful Tools</h2>
                        <p class="section-subheading">Quick access to our most frequently used tools for PDFs, images, code, and calculations.</p>
                    </div>
                    <div class="popular-filter-tabs" role="tablist" aria-label="Filter popular tools by category">
                        <button type="button" class="tab-btn active" data-tab="all" role="tab" aria-selected="true">All Top Tools</button>
                        <button type="button" class="tab-btn" data-tab="pdf" role="tab" aria-selected="false">PDF</button>
                        <button type="button" class="tab-btn" data-tab="image" role="tab" aria-selected="false">Image</button>
                        <button type="button" class="tab-btn" data-tab="calculator" role="tab" aria-selected="false">Calculators</button>
                        <button type="button" class="tab-btn" data-tab="developer" role="tab" aria-selected="false">Developer</button>
                    </div>
                </div>
                
                <div class="tool-grid" id="popularToolGrid"></div>
            </section>

            <!-- AdSense Middle Slot -->
            <div class="ad-placeholder inline-ad" style="margin: 3rem 0;"></div>

            <!-- 4. Task-Based Discovery Section ("What are you trying to do?") -->
            <section class="task-discovery-section" id="task-discovery" aria-label="Task-Based Discovery">
                <div class="section-header text-center">
                    <span class="section-kicker">INTENT-FIRST EXPLORATION</span>
                    <h2 class="section-heading">What are you trying to do?</h2>
                    <p class="section-subheading">Find the right utility quickly based on your current task or project workflow.</p>
                </div>
                
                <div class="task-grid">
                    <a href="/pdf-tools" class="task-card">
                        <div class="task-icon">📄</div>
                        <div class="task-content">
                            <h3>Work with a PDF</h3>
                            <p>Compress file sizes, merge multiple PDFs, split pages, add watermarks, or digitally sign.</p>
                            <span class="task-link-text">Browse PDF Tools →</span>
                        </div>
                    </a>
                    
                    <a href="/image-tools" class="task-card">
                        <div class="task-icon">🖼️</div>
                        <div class="task-content">
                            <h3>Optimize an Image</h3>
                            <p>Resize dimensions, compress KB size, convert formats (JPG, PNG, WEBP), or remove backgrounds.</p>
                            <span class="task-link-text">Browse Image Tools →</span>
                        </div>
                    </a>
                    
                    <a href="/calculators" class="task-card">
                        <div class="task-icon">🧮</div>
                        <div class="task-content">
                            <h3>Calculate Something</h3>
                            <p>Compute GST tax slabs, loan EMIs, SIP wealth returns, compound interest, BMI, or CGPA.</p>
                            <span class="task-link-text">Browse Calculators →</span>
                        </div>
                    </a>
                    
                    <a href="/developer-tools" class="task-card">
                        <div class="task-icon">💻</div>
                        <div class="task-content">
                            <h3>Developer Tasks</h3>
                            <p>Format JSON/SQL, decode JWT tokens, generate cryptographic hashes, test Regex, or encode Base64.</p>
                            <span class="task-link-text">Browse Dev Tools →</span>
                        </div>
                    </a>
                    
                    <a href="/text-tools" class="task-card">
                        <div class="task-icon">📝</div>
                        <div class="task-content">
                            <h3>Format & Analyze Text</h3>
                            <p>Count words and characters, convert letter casing, diff check, clean whitespace, or remove duplicate lines.</p>
                            <span class="task-link-text">Browse Text Tools →</span>
                        </div>
                    </a>
                    
                    <a href="/student-tools" class="task-card">
                        <div class="task-icon">🎓</div>
                        <div class="task-content">
                            <h3>Study & Academic Utilities</h3>
                            <p>Track study intervals with Pomodoro timers, format bibliography citations (APA/MLA), and convert GPA scales.</p>
                            <span class="task-link-text">Browse Student Tools →</span>
                        </div>
                    </a>
                </div>
            </section>

            <!-- 5. Category Showcase Sections -->
            <div id="category-showcase-section">
                <!-- PDF Showcase -->
                <section class="category-showcase-block" id="pdf-showcase">
                    <div class="showcase-header">
                        <div>
                            <span class="showcase-tag">DOCUMENT SUITE</span>
                            <h2 class="showcase-title">PDF Tools</h2>
                            <p class="showcase-desc">Everything you need to compress, merge, split, watermark, and manage PDF documents safely.</p>
                        </div>
                        <a href="/pdf-tools" class="showcase-view-all-btn">
                            <span>View all PDF tools</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </a>
                    </div>
                    <div class="tool-grid showcase-grid" data-category="pdf"></div>
                </section>

                <!-- Image Showcase -->
                <section class="category-showcase-block" id="image-showcase">
                    <div class="showcase-header">
                        <div>
                            <span class="showcase-tag">MEDIA & GRAPHICS</span>
                            <h2 class="showcase-title">Image Tools</h2>
                            <p class="showcase-desc">Resize, compress, convert, crop, and optimize photos and images directly in your browser.</p>
                        </div>
                        <a href="/image-tools" class="showcase-view-all-btn">
                            <span>View all Image tools</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </a>
                    </div>
                    <div class="tool-grid showcase-grid" data-category="image"></div>
                </section>

                <!-- Developer & Text Showcase -->
                <section class="category-showcase-block" id="dev-showcase">
                    <div class="showcase-header">
                        <div>
                            <span class="showcase-tag">ENGINEERING & TEXT</span>
                            <h2 class="showcase-title">Text & Developer Tools</h2>
                            <p class="showcase-desc">Format code, decode payloads, inspect JWTs, generate hashes, and transform text effortlessly.</p>
                        </div>
                        <a href="/developer-tools" class="showcase-view-all-btn">
                            <span>View all Dev tools</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </a>
                    </div>
                    <div class="tool-grid showcase-grid" data-category="developer-text"></div>
                </section>

                <!-- Calculators Showcase -->
                <section class="category-showcase-block" id="calc-showcase">
                    <div class="showcase-header">
                        <div>
                            <span class="showcase-tag">FINANCE & MATH</span>
                            <h2 class="showcase-title">Calculators</h2>
                            <p class="showcase-desc">High-precision financial, tax, loan, investment, health, and mathematical calculators.</p>
                        </div>
                        <a href="/calculators" class="showcase-view-all-btn">
                            <span>View all Calculators</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </a>
                    </div>
                    <div class="tool-grid showcase-grid" data-category="calculator"></div>
                </section>

                <!-- Student Utilities Showcase -->
                <section class="category-showcase-block" id="student-showcase">
                    <div class="showcase-header">
                        <div>
                            <span class="showcase-tag">ACADEMIC & FOCUS</span>
                            <h2 class="showcase-title">Student Utilities</h2>
                            <p class="showcase-desc">Tools built specifically for academic success, focus timing, GPA tracking, and study workflows.</p>
                        </div>
                        <a href="/student-tools" class="showcase-view-all-btn">
                            <span>View all Student tools</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </a>
                    </div>
                    <div class="tool-grid showcase-grid" data-category="student"></div>
                </section>
            </div>

            <!-- 6. How It Works Section -->
            <section class="how-it-works-section" aria-label="How Student Utility Hub Works">
                <div class="section-header text-center">
                    <span class="section-kicker">STREAMLINED WORKFLOW</span>
                    <h2 class="section-heading">How Student Utility Hub Works</h2>
                    <p class="section-subheading">Complete your everyday tasks in three simple steps directly in your browser.</p>
                </div>
                
                <div class="steps-grid">
                    <div class="step-card">
                        <div class="step-badge">01</div>
                        <div class="step-icon">🎯</div>
                        <h3>Choose a Tool</h3>
                        <p>Search or pick from 77+ free utilities for PDFs, images, text formatting, and calculations.</p>
                    </div>
                    
                    <div class="step-card">
                        <div class="step-badge">02</div>
                        <div class="step-icon">📥</div>
                        <h3>Upload or Enter Data</h3>
                        <p>Select your file or paste your text. Applicable tools process data securely in browser memory.</p>
                    </div>
                    
                    <div class="step-card">
                        <div class="step-badge">03</div>
                        <div class="step-icon">⚡</div>
                        <h3>Get Your Result</h3>
                        <p>Download your optimized document, copy converted output, or review calculated results instantly.</p>
                    </div>
                </div>
            </section>

            <!-- 7. Privacy & Browser Processing Section -->
            <section class="privacy-highlight-section" aria-label="Privacy and Browser Processing">
                <div class="privacy-container">
                    <div class="privacy-content">
                        <span class="section-kicker">TRANSPARENT ARCHITECTURE</span>
                        <h2 class="section-heading">Simple Tools. Less Hassle.</h2>
                        <p class="privacy-description">
                            Many of our tools process your files directly in your browser using modern Web APIs, 
                            helping you complete everyday tasks without unnecessary server uploads.
                        </p>
                        <p class="privacy-subtext">
                            For tools that run purely client-side, your data never leaves your device. 
                            Check each tool's processing description before working with sensitive information.
                        </p>
                        
                        <div class="privacy-badges">
                            <div class="privacy-badge-item">
                                <span class="badge-icon">🔒</span>
                                <div>
                                    <strong>Client-Side Processing</strong>
                                    <span>Natively runs via WebAssembly and Canvas APIs</span>
                                </div>
                            </div>
                            <div class="privacy-badge-item">
                                <span class="badge-icon">🚫</span>
                                <div>
                                    <strong>Zero Account Barrier</strong>
                                    <span>No sign-up or credit card required</span>
                                </div>
                            </div>
                            <div class="privacy-badge-item">
                                <span class="badge-icon">⚡</span>
                                <div>
                                    <strong>Immediate Execution</strong>
                                    <span>No queueing delays or upload waiting times</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="privacy-graphic">
                        <div class="privacy-card-visual">
                            <div class="visual-header">
                                <span class="visual-dot red"></span>
                                <span class="visual-dot yellow"></span>
                                <span class="visual-dot green"></span>
                                <span class="visual-title">Local Browser Memory</span>
                            </div>
                            <div class="visual-body">
                                <div class="visual-flow">
                                    <div class="flow-node">📁 Your File</div>
                                    <div class="flow-arrow">→</div>
                                    <div class="flow-node highlight">⚙️ Web API Processing</div>
                                    <div class="flow-arrow">→</div>
                                    <div class="flow-node">💾 Download</div>
                                </div>
                                <div class="visual-footer">
                                    <span>🛡️ No remote file transmission on client-side tools</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 8. Guides & Knowledge Hub Section -->
            <section class="guides-section" aria-label="Guides and Learning">
                <div class="section-header">
                    <div>
                        <span class="section-kicker">PRACTICAL TUTORIALS</span>
                        <h2 class="section-heading">Learn How to Get More Done</h2>
                        <p class="section-subheading">Step-by-step guides, formulas, and practical tips to master our most popular tools.</p>
                    </div>
                    <a href="/blog" class="showcase-view-all-btn">
                        <span>Explore all guides</span>
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                </div>
                
                <div class="guides-grid" id="homepageGuidesGrid"></div>
            </section>

            <!-- 9. SEO Educational Content Section -->
            <section class="seo-overview-section" aria-label="Overview of Student Utility Hub">
                <article class="seo-overview-article">
                    <header class="seo-article-header">
                        <span class="section-kicker">ONLINE UTILITIES DIRECTORY</span>
                        <h2 class="section-heading">Free Online Tools for Everyday Tasks</h2>
                    </header>
                    <div class="seo-article-body">
                        <p>
                            <strong>Student Utility Hub</strong> is an all-in-one suite of free, lightweight online productivity utilities created for students, developers, content creators, and professionals. Whether you need to compress a PDF document before an assignment deadline, convert high-resolution images to modern WEBP formats, calculate loan amortization schedules, or format complex JSON payloads, our platform provides fast, reliable, and accessible tools right in your browser.
                        </p>
                        <p>
                            Unlike traditional online tool websites that require software downloads, intrusive subscriptions, or lengthy account registrations, Student Utility Hub is designed with a frictionless, search-first philosophy. Many of our conversion, formatting, and calculation tools execute directly on your local device using standard HTML5 Canvas, Web Audio, and Web Cryptography APIs, keeping your data confidential and eliminating unnecessary upload delays.
                        </p>
                        <p>
                            Explore our comprehensive categories including <a href="/pdf-tools">PDF Tools</a> for merging and splitting documents, <a href="/image-tools">Image Tools</a> for optimizing graphics, <a href="/developer-tools">Developer Tools</a> for coding utilities, <a href="/calculators">Calculators</a> for finance and academic evaluations, and <a href="/student-tools">Student Utilities</a> for focused studying.
                        </p>
                    </div>
                </article>
            </section>

            <!-- 10. Frequently Asked Questions (FAQ) Section -->
            <section class="faq-section" aria-label="Frequently Asked Questions">
                <div class="section-header text-center">
                    <span class="section-kicker">CLEAR ANSWERS</span>
                    <h2 class="section-heading">Frequently Asked Questions</h2>
                    <p class="section-subheading">Common questions about using Student Utility Hub utilities and privacy features.</p>
                </div>
                
                <div class="faq-accordion" id="faqAccordion">
                    <div class="faq-item">
                        <button type="button" class="faq-question" aria-expanded="false">
                            <span>What is Student Utility Hub?</span>
                            <span class="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div class="faq-answer" hidden>
                            <p>Student Utility Hub is a free online platform featuring 75+ versatile productivity tools across PDF management, image conversion, developer utilities, financial calculators, text formatting, and student study aids.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button type="button" class="faq-question" aria-expanded="false">
                            <span>Are all tools on Student Utility Hub free to use?</span>
                            <span class="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div class="faq-answer" hidden>
                            <p>Yes. All tools on Student Utility Hub are 100% free with no subscriptions, trials, paywalls, or usage caps.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button type="button" class="faq-question" aria-expanded="false">
                            <span>Do I need to install software or create an account?</span>
                            <span class="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div class="faq-answer" hidden>
                            <p>No. You do not need to register, create an account, or download any software. All utilities run directly inside your web browser on desktop, tablet, or smartphone.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button type="button" class="faq-question" aria-expanded="false">
                            <span>How does browser-based processing work?</span>
                            <span class="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div class="faq-answer" hidden>
                            <p>Many of our utilities utilize client-side JavaScript, WebAssembly, HTML5 Canvas, and Web Cryptography APIs to transform files and calculate values directly on your computer, eliminating the need to upload files to external servers.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button type="button" class="faq-question" aria-expanded="false">
                            <span>Can I use Student Utility Hub on mobile devices?</span>
                            <span class="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div class="faq-answer" hidden>
                            <p>Yes. Student Utility Hub is fully responsive and optimized for mobile browsers, including touch-friendly inputs, quick search overlays, and responsive tool interfaces.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button type="button" class="faq-question" aria-expanded="false">
                            <span>Can I use the tools offline?</span>
                            <span class="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div class="faq-answer" hidden>
                            <p>Yes. Student Utility Hub is configured as a Progressive Web App (PWA) that caches core application assets, allowing many client-side calculators and utilities to work even without an active internet connection.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 11. Final Call-to-Action Section -->
            <section class="final-cta-section" aria-label="Explore all tools CTA">
                <div class="final-cta-box">
                    <div class="final-cta-ambient" aria-hidden="true"></div>
                    <span class="final-cta-badge">GET STARTED IN SECONDS</span>
                    <h2 class="final-cta-title">Find the Tool You Need</h2>
                    <p class="final-cta-text">
                        Explore our growing collection of 77+ free online utilities designed for speed, privacy, and simplicity.
                    </p>
                    <div class="final-cta-buttons">
                        <button type="button" class="primary-btn final-primary-btn" id="finalExploreBtn">
                            <span>Explore All 77+ Tools →</span>
                        </button>
                        <button type="button" class="secondary-btn final-secondary-btn" id="finalSearchBtn">
                            <span>🔍 Search Utilities</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    `;

    // 1. Render Hero Component
    const heroContainer = container.querySelector('#hero-section');
    if (heroContainer) {
        renderHero(heroContainer);
    }

    // 2. Render Popular Tools
    const popularGrid = container.querySelector('#popularToolGrid');
    const popularToolIds = [
        'pdfCompress', 'pdfMerge', 'pdfSplit', 
        'imageCompressor', 'imageConverter', 'qrCodeGenerator', 
        'jsonFormatter', 'passwordGenerator', 'gstCalculator', 
        'emiCalculator', 'sipCalculator', 'wordCounter'
    ];

    const curatedPopularTools = tools.filter(t => popularToolIds.includes(t.id));

    const renderCuratedTools = (filterCategory = 'all') => {
        if (!popularGrid) return;
        popularGrid.innerHTML = '';

        const displayTools = curatedPopularTools.filter(t => {
            if (filterCategory === 'all') return true;
            if (filterCategory === 'developer') return t.category === 'developer' || t.category === 'text';
            return t.category === filterCategory;
        });

        displayTools.forEach((tool, index) => {
            const card = createToolCard(tool);
            card.style.animation = `fadeInUp 0.4s ease forwards ${index * 0.03}s`;
            
            const btn = card.querySelector('.tool-button');
            if (btn) {
                btn.onclick = (e) => {
                    e.preventDefault();
                    navigate(`/tools/${tool.slug}`);
                };
            }
            
            popularGrid.appendChild(card);
        });
    };

    renderCuratedTools('all');

    // Popular Filter Tab Listeners
    const tabBtns = container.querySelectorAll('.popular-filter-tabs .tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            
            const tab = btn.getAttribute('data-tab');
            renderCuratedTools(tab);
        });
    });

    // 3. Render Category Showcases
    const showcaseGrids = container.querySelectorAll('.showcase-grid');
    showcaseGrids.forEach(grid => {
        const cat = grid.getAttribute('data-category');
        let showcaseTools = [];

        if (cat === 'pdf') {
            showcaseTools = tools.filter(t => t.category === 'pdf').slice(0, 4);
        } else if (cat === 'image') {
            showcaseTools = tools.filter(t => t.category === 'image').slice(0, 4);
        } else if (cat === 'developer-text') {
            const dev = tools.filter(t => t.category === 'developer').slice(0, 2);
            const txt = tools.filter(t => t.category === 'text').slice(0, 2);
            showcaseTools = [...dev, ...txt];
        } else if (cat === 'calculator') {
            showcaseTools = tools.filter(t => t.category === 'calculator').slice(0, 4);
        } else if (cat === 'student') {
            showcaseTools = tools.filter(t => t.category === 'student').slice(0, 4);
        }

        showcaseTools.forEach((tool, idx) => {
            const card = createToolCard(tool);
            card.style.animation = `fadeInUp 0.4s ease forwards ${idx * 0.04}s`;
            
            const btn = card.querySelector('.tool-button');
            if (btn) {
                btn.onclick = (e) => {
                    e.preventDefault();
                    navigate(`/tools/${tool.slug}`);
                };
            }
            grid.appendChild(card);
        });
    });

    // 4. Render Guides Section
    const guidesGrid = container.querySelector('#homepageGuidesGrid');
    if (guidesGrid && articles.length > 0) {
        const featuredArticles = articles.slice(0, 4);
        featuredArticles.forEach((art, index) => {
            const guideCard = document.createElement('article');
            guideCard.className = 'guide-card';
            guideCard.innerHTML = `
                <div class="guide-card-header">
                    <span class="guide-badge">📚 GUIDE</span>
                    <span class="guide-read-time">${art.readTime || '4 min read'}</span>
                </div>
                <div class="guide-card-body">
                    <h3 class="guide-title">${escapeHtml(art.title)}</h3>
                    <p class="guide-summary">${escapeHtml(art.summary)}</p>
                </div>
                <div class="guide-card-footer">
                    <a href="/guides/${art.slug}" class="guide-link-btn" data-slug="${art.slug}">
                        <span>Read Guide</span>
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                </div>
            `;

            const linkBtn = guideCard.querySelector('.guide-link-btn');
            if (linkBtn) {
                linkBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigate(`/guides/${art.slug}`);
                });
            }

            guidesGrid.appendChild(guideCard);
        });
    }

    // 5. Intercept SPA Links in Task Cards and Showcases
    container.querySelectorAll('.task-card, .showcase-view-all-btn').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/')) {
                e.preventDefault();
                navigate(href);
            }
        });
    });

    // 6. Interactive FAQ Accordion
    const faqItems = container.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answerEl = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');

        if (questionBtn && answerEl) {
            questionBtn.addEventListener('click', () => {
                const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';
                
                // Toggle current
                questionBtn.setAttribute('aria-expanded', !isExpanded);
                answerEl.hidden = isExpanded;
                if (icon) icon.textContent = isExpanded ? '+' : '−';
                item.classList.toggle('open', !isExpanded);
            });
        }
    });

    // 7. Final CTA Button Handlers
    const finalExplore = container.querySelector('#finalExploreBtn');
    if (finalExplore) {
        finalExplore.addEventListener('click', () => {
            const target = document.getElementById('popular-tools-section');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const finalSearch = container.querySelector('#finalSearchBtn');
    if (finalSearch) {
        finalSearch.addEventListener('click', () => {
            const heroSearch = document.getElementById('heroSearchInput');
            if (heroSearch) {
                heroSearch.focus();
                heroSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
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
