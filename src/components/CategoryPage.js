import { tools, categories } from '../tools/toolRegistry.js';
import { articles } from '../tools/articleRegistry.js';
import { createToolCard } from '../utils/dom.js';
import { navigate } from '../router.js';
import { injectJSONLDSchemas } from './SEOContentEngine.js';

export const renderCategoryPage = (container, category) => {
    const catTools = tools.filter(t => t.category === category.id);
    const catName = category.name;
    const catArticles = articles.filter(a => a.category === category.id);

    // Set page SEO metadata dynamically
    document.title = `${catName} - Free Client-Side Utilities | Student Utility Hub`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', category.description || `Browse our free online ${catName} matching highest productivity and privacy standards.`);
    }

    // Inject Category Schemas
    injectJSONLDSchemas(category, true);

    // Generate Category-specific details
    let categoryWhyItMatters = '';
    let categoryUseCases = '';

    if (category.id === 'pdf') {
        categoryWhyItMatters = 'Managing PDF documents is a daily necessity for academic submissions, official applications, and business contracts. Traditional online tools upload confidential files to remote servers, exposing private records. Our offline-capable PDF suite provides a safe, browser-native container to split, merge, compress, protect, and sign documents securely with zero server uploads.';
        categoryUseCases = `
            <li><strong>Thesis Compilation:</strong> Merging separate chapters, abstracts, and syllabus guides into a single PDF document.</li>
            <li><strong>Portal Upload Optimization:</strong> Compressing large scanned research reports to meet strict university or government file limits.</li>
            <li><strong>Security Compliance:</strong> Encrypting salary slips and contracts with strong AES passwords before sharing via email.</li>
            <li><strong>Paperless Document Signing:</strong> Drawing and placing electronic signatures directly onto agreements on canvas.</li>
        `;
    } else if (category.id === 'image') {
        categoryWhyItMatters = 'High-resolution smartphone photos and graphics are vital for modern communication, but large file weights slow down websites and exceed form upload caps. Our Image tools convert, crop, compress, watermark, and isolate backgrounds natively in the browser, guaranteeing fast processing with zero privacy compromises.';
        categoryUseCases = `
            <li><strong>Photo Compression:</strong> Reducing high-res student photos to under 100KB to meet strict online admission portal limits.</li>
            <li><strong>Graphic Asset Creation:</strong> Removing background color ranges to output transparent PNG icons and logos.</li>
            <li><strong>Content Protection:</strong> Overlaying customizable copyright text watermarks across photography portfolios.</li>
            <li><strong>Format Transcoding:</strong> Converting heavy PNG files to modern WEBP format for optimal website load performance.</li>
        `;
    } else if (category.id === 'developer') {
        categoryWhyItMatters = 'Software developers and system architects require fast, secure utilities to format code, parse tokens, and generate test data without sending sensitive API payloads or keys to third-party cloud servers. Our Developer suite provides offline tools to format JSON/SQL/XML, generate secure UUID keys, decode JWT claims, and compute cryptographic hashes.';
        categoryUseCases = `
            <li><strong>Debugging API Payloads:</strong> Formatting minified REST API JSON responses into readable hierarchies.</li>
            <li><strong>Database Structuring:</strong> Beautifying complex multi-table SQL queries with standard keyword capitalization.</li>
            <li><strong>Auth Token Inspection:</strong> Decoding JWT headers and claims to verify expiration dates and user scopes locally.</li>
            <li><strong>Security Testing:</strong> Computing NIST-compliant SHA-256 and MD5 cryptographic hashes for checksum validation.</li>
        `;
    } else if (category.id === 'calculator') {
        categoryWhyItMatters = 'Financial budgeting, tax planning, and academic scoring require high mathematical accuracy and instantaneous scenario comparisons. Our Calculator suite evaluates loans, compounding wealth returns, GST inclusive/exclusive rates, semester grade points, and trip fuel expenses programmatically in real time.';
        categoryUseCases = `
            <li><strong>Invoice Tax Calculation:</strong> Adding or extracting 18% GST elements from billing statements instantly.</li>
            <li><strong>Home & Car Loan Decisions:</strong> Estimating monthly EMIs and total interest payouts across variable loan tenures.</li>
            <li><strong>Long-Term Wealth Modeling:</strong> Simulating future compounding returns from monthly Systematic Investment Plans (SIP).</li>
            <li><strong>Academic Score Conversion:</strong> Converting semester CGPA and grade points to standardized percentages.</li>
        `;
    } else if (category.id === 'student') {
        categoryWhyItMatters = 'Academic success requires specialized tools that structure study schedules, eliminate digital distractions, and format research bibliographies accurately. These student utilities help maintain cognitive focus with Pomodoro cycles, generate APA/MLA citations, and standardize grade point scales across global education systems.';
        categoryUseCases = `
            <li><strong>Deep Study Routines:</strong> Running 25-minute Pomodoro focus intervals with restorative short breaks.</li>
            <li><strong>Academic Citations:</strong> Generating standardized APA 7th, MLA 9th, and Chicago references for bibliographies.</li>
            <li><strong>Grade Scale Conversion:</strong> Standardizing international grades between 4.0, 5.0, and 10.0 GPA scales.</li>
            <li><strong>Exam & Lab Timing:</strong> Measuring precise countdowns and stopwatch split laps during practice tests.</li>
        `;
    } else if (category.id === 'media') {
        categoryWhyItMatters = 'Working with audio clips and video recordings often involves bloated desktop editors or risky cloud conversion websites. Our Media suite uses the browser Web Audio API and WebAssembly pipelines to transcode video files and trim audio waveforms locally without watermarks or file size caps.';
        categoryUseCases = `
            <li><strong>Custom Audio Trimming:</strong> Slicing specific sound bites and creating phone ringtones with millisecond precision.</li>
            <li><strong>Voice Recording Conversion:</strong> Transcoding smartphone voice memos to uncompressed WAV format for editing.</li>
            <li><strong>Web Video Optimization:</strong> Converting video recordings into web-ready MP4 or WebM formats client-side.</li>
        `;
    } else {
        categoryWhyItMatters = 'Digital content creation, coding, and academic writing demand fast text transformation utilities. Our Text suite cleans formatting noise, counts words, converts typographical casing, compares document diffs, and generates scannable QR codes instantly.';
        categoryUseCases = `
            <li><strong>Essay Word Count & Reading Time:</strong> Monitoring essay word boundaries and estimated presentation speaking duration.</li>
            <li><strong>Text Formatting Sanitization:</strong> Stripping messy HTML tags and redundant whitespace from copied copy.</li>
            <li><strong>Typography Casing Conversion:</strong> Transforming text into Title Case, camelCase, UPPERCASE, and kebab-case.</li>
            <li><strong>Scannable QR Codes:</strong> Generating custom QR codes for website URLs and Wi-Fi networks.</li>
        `;
    }

    // Guides HTML for category if available
    let categoryGuidesHTML = '';
    if (catArticles.length > 0) {
        categoryGuidesHTML = `
            <section style="margin-bottom: 3.5rem;">
                <h2 style="font-size: 1.6rem; margin-bottom: 1.5rem; color: var(--text-primary); font-weight: 700;">Educational Guides & Tutorials</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                    ${catArticles.map(art => `
                        <div class="tool-card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.5rem;">
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                    <span style="background: var(--primary-light); color: var(--primary-color); padding: 0.2rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 600;">${art.type.toUpperCase()}</span>
                                    <span style="font-size: 0.8rem; color: var(--text-secondary);">${art.readTime}</span>
                                </div>
                                <h3 style="font-size: 1.15rem; color: var(--text-primary); margin: 0 0 0.5rem 0; font-weight: 700; line-height: 1.4;">${art.title}</h3>
                                <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0 0 1rem 0; line-height: 1.5;">${art.summary}</p>
                            </div>
                            <a href="/guides/${art.slug}" class="tool-button" style="text-decoration: none; display: block; text-align: center;">
                                <span>Read Guide</span>
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </a>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    container.innerHTML = `
        <div class="category-page-container">
            <!-- Breadcrumbs -->
            <nav class="breadcrumb" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem; font-weight: 500;">
                <a href="/">Home</a> &gt; 
                <span style="color: var(--text-primary);">${catName}</span>
            </nav>

            <!-- Category Hero -->
            <header class="category-hero" style="margin-bottom: 2rem; text-align: left; padding: 2.5rem 2rem; background: var(--surface-elevated); border-radius: var(--radius-lg); border: 1px solid var(--tool-card-border);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${category.icon || '🛠️'}</div>
                <h1 style="font-size: 2.4rem; margin: 0 0 0.75rem 0; font-weight: 800; color: var(--text-primary);">${catName}</h1>
                <p style="font-size: 1.15rem; color: var(--text-secondary); margin: 0; max-width: 800px; line-height: 1.6;">
                    ${category.description} Free, client-side, secure, and fast utilities.
                </p>
            </header>

            <!-- EEAT Authority Indicators -->
            <div style="background: rgba(52, 152, 219, 0.05); border-left: 4px solid var(--primary-color); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 2.5rem;">
                <h3 style="margin: 0 0 0.75rem 0; font-size: 1.15rem; color: var(--text-primary); font-weight: 700;">Why This Category Matters</h3>
                <p style="margin: 0; font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">
                    ${categoryWhyItMatters}
                </p>
            </div>

            <!-- Best Use Cases -->
            <section style="margin-bottom: 3rem;">
                <h3 style="font-size: 1.35rem; margin-bottom: 1rem; color: var(--text-primary); font-weight: 700;">Common Real-World Use Cases</h3>
                <ul style="line-height: 1.8; color: var(--text-secondary); padding-left: 1.5rem; font-size: 1rem;">
                    ${categoryUseCases}
                </ul>
            </section>

            <!-- Grid of Tools -->
            <section style="margin-bottom: 3.5rem;">
                <h2 style="font-size: 1.6rem; margin-bottom: 1.5rem; color: var(--text-primary); font-weight: 700;">Available Tools in ${catName}</h2>
                <div class="tool-grid" id="categoryToolsGrid"></div>
            </section>

            <!-- Category Guides Section -->
            ${categoryGuidesHTML}

            <!-- Category FAQS Section -->
            <section style="margin-bottom: 4rem; padding-top: 3rem; border-top: 1px solid var(--tool-card-border);">
                <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--text-primary); font-weight: 700;">Frequently Asked Questions</h3>
                
                <div style="display: grid; gap: 1rem;">
                    <details style="background: var(--surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--tool-card-border);">
                        <summary style="font-weight:600; cursor:pointer; color:var(--text-primary);">Are all ${catName} 100% free to use?</summary>
                        <p style="margin-top:0.75rem; color:var(--text-secondary); line-height:1.6;">Yes. Every utility in the ${catName} catalog is completely free with no usage limits, feature locks, or subscription paywalls.</p>
                    </details>
                    <details style="background: var(--surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--tool-card-border);">
                        <summary style="font-weight:600; cursor:pointer; color:var(--text-primary);">Do I need to sign up or create an account?</summary>
                        <p style="margin-top:0.75rem; color:var(--text-secondary); line-height:1.6;">No account or personal registration is required. You can load any tool and begin working immediately.</p>
                    </details>
                    <details style="background: var(--surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--tool-card-border);">
                        <summary style="font-weight:600; cursor:pointer; color:var(--text-primary);">Are files and calculations kept private?</summary>
                        <p style="margin-top:0.75rem; color:var(--text-secondary); line-height:1.6;">Yes. All operations execute 100% locally inside your web browser sandbox using modern Web APIs. No documents, images, code, or numbers are sent across the network.</p>
                    </details>
                    <details style="background: var(--surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--tool-card-border);">
                        <summary style="font-weight:600; cursor:pointer; color:var(--text-primary);">Do these tools work on smartphones and tablets?</summary>
                        <p style="margin-top:0.75rem; color:var(--text-secondary); line-height:1.6;">Yes. All tool pages are fully responsive and touch-optimized for iOS and Android mobile browsers.</p>
                    </details>
                </div>
            </section>

            <!-- Related Categories -->
            <section style="padding-top: 2rem; border-top: 1px solid var(--tool-card-border);">
                <h3 style="font-size: 1.4rem; margin-bottom: 1.2rem; color: var(--text-primary); font-weight: 700;">Explore Other Tool Categories</h3>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    ${categories.filter(c => c.id !== category.id && c.id !== 'all').map(c => `
                        <a href="${c.id === 'calculator' ? '/calculators' : `/${c.id}-tools`}" class="secondary-button" style="text-decoration:none; display:flex; align-items:center; gap:0.5rem; padding:0.6rem 1.2rem;">
                            <span>${c.icon}</span> <span>${c.name}</span>
                        </a>
                    `).join('')}
                </div>
            </section>
        </div>
    `;

    // Populate Tool Cards
    const grid = container.querySelector('#categoryToolsGrid');
    catTools.forEach(tool => {
        const card = createToolCard(tool);
        const btn = card.querySelector('.tool-button');
        if (btn) {
            btn.onclick = (e) => {
                e.preventDefault();
                navigate(`/tools/${tool.slug}`);
            };
        }
        grid.appendChild(card);
    });

    // Intercept Guide Links
    container.querySelectorAll('a[href^="/guides/"]').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            navigate(link.getAttribute('href'));
        };
    });
};
