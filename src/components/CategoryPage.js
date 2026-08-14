import { tools, categories } from '../tools/toolRegistry.js';
import { createToolCard } from '../utils/dom.js';
import { navigate } from '../router.js';
import { injectJSONLDSchemas } from './SEOContentEngine.js';

export const renderCategoryPage = (container, category) => {
    const catTools = tools.filter(t => t.category === category.id);
    const catName = category.name;

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
        categoryWhyItMatters = 'Managing PDF documents is a daily necessity for academic submissions and professional contracts. Traditional tools upload files to remote servers, exposing private records. Our offline-capable PDF category provides a safe, browser-native container to split, merge, compress, protect, and sign documents securely.';
        categoryUseCases = `
            <li><strong>Thesis Compilation:</strong> Merging split chapters and syllabus guides into a single PDF document.</li>
            <li><strong>Security Compliance:</strong> Encrypting invoices with passwords before sharing via email.</li>
            <li><strong>Signing Contracts:</strong> Hand-drawing signatures on canvas and embedding them directly onto contracts.</li>
        `;
    } else if (category.id === 'image') {
        categoryWhyItMatters = 'Images are key to modern communications, but raw camera files are too large. Our Image tools convert, crop, compress, watermark, and remove backgrounds natively, guaranteeing fast page rendering without privacy compromises.';
        categoryUseCases = `
            <li><strong>Photo Compression:</strong> Reducing high-res student photos to meet online portal upload limits.</li>
            <li><strong>Graphic Asset Creation:</strong> Removing background color ranges to output transparent PNG icons.</li>
            <li><strong>Content Protection:</strong> Overlaying copyright text watermarks across photography portfolios.</li>
        `;
    } else if (category.id === 'developer') {
        categoryWhyItMatters = 'Developers require fast, secure tools that format code and parse metadata without sending logs to cloud servers. Our Developer suite provides offline tools to format JSON/SQL/XML, generate secure UUID keys, and parse EXIF metadata safely.';
        categoryUseCases = `
            <li><strong>Debugging Payloads:</strong> Formatting minified API JSON files into readable hierarchies.</li>
            <li><strong>Database Structuring:</strong> Beautifying SQL scripts to verify query syntax blocks.</li>
            <li><strong>System Identification:</strong> Generating bulk cryptographic keys (UUID v4) for test tables.</li>
        `;
    } else if (category.id === 'calculator') {
        categoryWhyItMatters = 'Calculators require high accuracy and live updating values. Our Calculator suite evaluates loans, compounding interest, GST inclusive/exclusive rates, semester grade points, and fuel consumption profiles programmatically.';
        categoryUseCases = `
            <li><strong>Invoice Calculations:</strong> Extracting 18% GST elements from invoice totals instantly.</li>
            <li><strong>Loan Decisions:</strong> Estimating Home Loan monthly EMIs based on custom compounding durations.</li>
            <li><strong>Academic Averages:</strong> Converting course grades into GPA percentages dynamically.</li>
        `;
    } else {
        categoryWhyItMatters = 'Student workflows require specialized tools like Pomodoro study clocks, stopwatch intervals, and academic citation compilers. These utilities structure study sessions, maximize focus, and compile bib references automatically.';
        categoryUseCases = `
            <li><strong>Study Routines:</strong> Running Pomodoro interval timers to organize work and breaks.</li>
            <li><strong>Academic Citations:</strong> Generating APA, MLA, and Chicago references for final theses.</li>
            <li><strong>Lab Stopwatches:</strong> Measuring precise scientific experiment timings using offline stopwatches.</li>
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
            <header class="category-hero" style="margin-bottom: 2rem; text-align: left; padding: 2rem; background: var(--surface-elevated); border-radius: var(--radius-lg); border: 1px solid var(--tool-card-border);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${category.icon || '🛠️'}</div>
                <h1 style="font-size: 2.4rem; margin: 0 0 0.75rem 0; font-weight: 800; color: var(--text-primary);">${catName}</h1>
                <p style="font-size: 1.15rem; color: var(--text-secondary); margin: 0; max-width: 800px; line-height: 1.6;">
                    ${category.description} Free, client-side, secure, and fast utilities.
                </p>
            </header>

            <!-- EEAT Authority Indicators -->
            <div style="background: rgba(52, 152, 219, 0.05); border-left: 4px solid var(--primary-color); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
                <h3 style="margin: 0 0 0.75rem 0; font-size: 1.15rem; color: var(--text-primary);">Why This Category Matters</h3>
                <p style="margin: 0; font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">
                    ${categoryWhyItMatters}
                </p>
            </div>

            <!-- Best Use Cases -->
            <section style="margin-bottom: 2.5rem;">
                <h3 style="font-size: 1.35rem; margin-bottom: 1rem; color: var(--text-primary);">Key Use Cases</h3>
                <ul style="line-height: 1.8; color: var(--text-secondary); padding-left: 1.5rem;">
                    ${categoryUseCases}
                </ul>
            </section>

            <!-- Grid of Tools -->
            <section style="margin-bottom: 3rem;">
                <h2 style="font-size: 1.6rem; margin-bottom: 1.5rem; color: var(--text-primary);">Available Tools in ${catName}</h2>
                <div class="tool-grid" id="categoryToolsGrid"></div>
            </section>

            <!-- Category FAQS Section -->
            <section style="margin-bottom: 4rem; padding-top: 3rem; border-top: 1px solid var(--tool-card-border);">
                <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--text-primary);">Frequently Asked Questions</h3>
                
                <div style="display: grid; gap: 1rem;">
                    <details style="background: var(--surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--tool-card-border);">
                        <summary style="font-weight:600; cursor:pointer; color:var(--text-primary);">Are these ${catName} free to use?</summary>
                        <p style="margin-top:0.5rem; color:var(--text-secondary); line-height:1.5;">Yes, all tools within the ${catName} catalog are 100% free with no premium paywalls or hidden costs.</p>
                    </details>
                    <details style="background: var(--surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--tool-card-border);">
                        <summary style="font-weight:600; cursor:pointer; color:var(--text-primary);">Do I need to sign up to use the tools?</summary>
                        <p style="margin-top:0.5rem; color:var(--text-secondary); line-height:1.5;">No subscription or signup is required. You can load the page and begin processing immediately.</p>
                    </details>
                    <details style="background: var(--surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--tool-card-border);">
                        <summary style="font-weight:600; cursor:pointer; color:var(--text-primary);">Is my data upload secure?</summary>
                        <p style="margin-top:0.5rem; color:var(--text-secondary); line-height:1.5;">Absolutely. All processing occurs local to your device. We do not transmit files or text inputs over the network.</p>
                    </details>
                </div>
            </section>

            <!-- Related Categories -->
            <section style="padding-top: 2rem; border-top: 1px solid var(--tool-card-border);">
                <h3 style="font-size: 1.4rem; margin-bottom: 1.2rem; color: var(--text-primary);">Other Categories</h3>
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
};
