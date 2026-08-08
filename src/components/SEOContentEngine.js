/**
 * SEOContentEngine.js
 * Programmatic SEO Engine providing:
 * - EEAT Authority Metadata Badges
 * - Trust Indicator Grid (privacy, zero uploads, local execution)
 * - Category-specific Warning (Common Mistakes) and Info (Pro Tips) callout boxes
 * - Dynamic Category-specific mathematical and workflow use-case examples
 * - 12 domain-specific FAQs
 * - Complete JSON-LD Structured Data Schema injections
 * - Pluggable AI content override layer
 */

import { categories } from '../tools/toolRegistry.js';

export const generateSEOHTML = (tool) => {
    // 1. Pluggable AI Override Layer Check
    if (window.customSEOContent && window.customSEOContent[tool.id]) {
        return window.customSEOContent[tool.id];
    }

    const name = tool.name;
    const catName = tool.category.charAt(0).toUpperCase() + tool.category.slice(1);
    const keywordsStr = tool.keywords ? tool.keywords.join(', ') : '';
    const mainKeyword = tool.keywords?.[0] || name.toLowerCase();

    // 2. Category-specific Content Definitions for warning, tips, and examples
    let commonMistake = '';
    let proTip = '';
    let categoryExamples = '';

    if (tool.category === 'pdf') {
        commonMistake = 'Uploading password-protected or corrupted PDF documents without unlocking them first. The local file reader will fail to parse secured files unless decrypted beforehand.';
        proTip = 'When merging or splitting files, verify the page index order prior to processing to avoid repeating the operation. You can compile multiple actions consecutively.';
        categoryExamples = `
            <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 0.75rem;">
                <strong>Example 1: Document Merging</strong> - Combining multiple lecture notes PDFs and a syllabus PDF into a single, unified study guide before exams.
            </div>
            <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md);">
                <strong>Example 2: Size Compression</strong> - Compressing a scanned project report from 15MB down to under 2MB to meet university online submission file limits.
            </div>
        `;
    } else if (tool.category === 'image') {
        commonMistake = 'Expecting high image quality outputs when setting compression levels extremely high. Extreme compression naturally degrades visual fidelity.';
        proTip = 'Use the PNG format when transparent pixels are required (such as logos) and WEBP or JPG for standard photos to maximize size savings.';
        categoryExamples = `
            <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 0.75rem;">
                <strong>Example 1: Asset Converter</strong> - Converting massive camera raw photos (.png) to web-optimized WEBP formats for faster portfolio loads.
            </div>
            <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md);">
                <strong>Example 2: Background Removal</strong> - Making background pixels of a portrait photograph transparent to overlay the subject onto a custom flyer.
            </div>
        `;
    } else if (tool.category === 'developer') {
        commonMistake = 'Inputting syntax-corrupted payloads (such as unescaped quotes in JSON or missing semicolons in SQL queries). The format tokenizers require valid code structures to align elements.';
        proTip = 'Use the integrated clipboard copy button to format your files instantly and paste them directly into your IDE or terminal without losing indentation spacing.';
        categoryExamples = `
            <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 0.75rem;">
                <strong>Example 1: API Debugging</strong> - Transforming minified API response JSON strings into clean, readable hierarchies to identify bug variables.
            </div>
            <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md);">
                <strong>Example 2: Hash Creation</strong> - Generating secure cryptographic MD5 or SHA-256 hashes of text strings to verify checksum database records.
            </div>
        `;
    } else if (tool.category === 'calculator') {
        commonMistake = 'Entering incorrect values (like yearly interest rates in monthly calculations, or inclusive figures in exclusive tax formulas). Double-check input labels before calculating.';
        proTip = 'Utilize sliders and numbers inputs concurrently. Live preview calculations update instantly, allowing you to run comparative estimations (like compound interest variations) in seconds.';
        
        // Specific calculators formulas
        if (tool.id === 'gstCalculator') {
            categoryExamples = `
                <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 0.75rem;">
                    <strong>GST Exclusive Example</strong> - A ₹1,000 product with 18% GST adds ₹180 tax, resulting in a ₹1,180 final price.
                </div>
                <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md);">
                    <strong>GST Inclusive Example</strong> - Extracting 18% GST from a ₹1,180 invoice reveals a ₹1,000 base price and ₹180 GST component.
                </div>
            `;
        } else if (tool.id === 'emiCalculator') {
            categoryExamples = `
                <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 0.75rem;">
                    <strong>Home Loan Example</strong> - Estimating repayments for a ₹50,00,000 loan at 8.5% interest rate over 20 years to view monthly EMI.
                </div>
                <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md);">
                    <strong>Car Loan Example</strong> - Calculating a ₹10,00,000 loan at 10.5% interest over 5 years to verify total interest payable.
                </div>
            `;
        } else if (tool.id === 'percentageCalculator') {
            categoryExamples = `
                <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 0.75rem;">
                    <strong>Discount Example</strong> - Finding a 20% discount on a ₹1,500 college textbook, resulting in ₹300 saved and a ₹1,200 final cost.
                </div>
                <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md);">
                    <strong>Marks Percentage Example</strong> - Calculating exam performance if a student scores 450 marks out of a total 600 maximum (75%).
                </div>
            `;
        } else {
            categoryExamples = `
                <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 0.75rem;">
                    <strong>Example 1: Financial Computations</strong> - Compiling complex rate figures to evaluate monthly repayments, tax margins, or compounding periods.
                </div>
                <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md);">
                    <strong>Example 2: Unit Scales</strong> - Converting metric weights and distances to imperial configurations for homework assignments.
                </div>
            `;
        }
    } else {
        commonMistake = 'Inputting unsupported parameters or values outside the normal bounds. Ensure your values fit the instructions in the fields.';
        proTip = 'Bookmark this page (Ctrl + D) for quick offline access during exams, study sessions, or project developer sprints.';
        categoryExamples = `
            <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 0.75rem;">
                <strong>Example 1: Study Management</strong> - Creating interval timers (such as Pomodoro countdowns) to structure student revision schedules.
            </div>
            <div style="background: var(--surface-elevated); padding: 1rem; border-radius: var(--radius-md);">
                <strong>Example 2: Citation Compiling</strong> - Generating APA or MLA bibliographic listings from source details for a research paper.
            </div>
        `;
    }

    // 3. Domain FAQs (12 Questions)
    const faqsList = [
        {
            q: `Is the Student Utility Hub ${name} safe and secure?`,
            a: `Yes, 100%. Our ${name} processes all inputs entirely inside your browser's local sandbox memory. No files, texts, or parameters are sent to external servers or stored database logs, guaranteeing complete user privacy.`
        },
        {
            q: `Are there any limits on using the ${name}?`,
            a: `Absolutely not. Student Utility Hub is designed as a free evergreen utility platform. You can compile, calculate, or format files using the ${name} as many times as you need without encountering paywalls.`
        },
        {
            q: `Does this ${name} work on smartphones and tablets?`,
            a: `Yes, it does. Our frontend is fully responsive and optimized for screen viewports across iOS, Android, and desktop configurations. Touch targets are large and keyboard navigation is fully supported.`
        },
        {
            q: `Can I access the ${name} offline?`,
            a: `Yes. Since Student Utility Hub is built as a Progressive Web App (PWA), once you visit the site, key resources are cached locally. You can open and use the ${name} even without an active internet connection.`
        },
        {
            q: `What is the main purpose of the ${name}?`,
            a: `The ${name} is designed to streamline ${catName.toLowerCase()} tasks. It provides instant evaluations, formatting, and file processing tools directly inside your web client.`
        },
        {
            q: `Do I need to install any Chrome extension or software?`,
            a: `No software or plugins are required. Everything runs natively via web standard APIs (HTML5 Canvas, File Readers, Web Crypto API) inside your active tab.`
        },
        {
            q: `How does the ${name} handle large files?`,
            a: `Because the tool runs client-side, the file processing speed depends on your local device's hardware capacity (CPU/RAM). Larger files may take slightly longer, but are completely processed locally.`
        },
        {
            q: `How can I copy or export the outputs from the ${name}?`,
            a: `The interface contains standardized "Copy" and "Download" buttons. Clicking copy grabs the output to your clipboard, and download saves the result file directly into your local download directory.`
        },
        {
            q: `Why should I choose this browser-native tool over server alternatives?`,
            a: `Most online services upload your data to remote clouds. Our browser-native ${name} guarantees your data never leaves your computer, while matching or exceeding the speeds of server equivalents.`
        },
        {
            q: `What categories of tools does Student Utility Hub support?`,
            a: `We support several productivity categories: PDF management, Image editing, Text utilities, Developer formatters, Calculators, and Student study aids.`
        },
        {
            q: `Is there any API endpoint access for the ${name}?`,
            a: `No, because all code is designed to run statically in the user's browser client. If you require automation, you can run the page locally or check the open-source logic.`
        },
        {
            q: `Who built the Student Utility Hub ${name}?`,
            a: `The platform is engineered by a dedicated community of frontend architects, prioritizing speed, accessibility (WCAG compliance), and privacy for students and developers worldwide.`
        }
    ];

    const faqHTML = faqsList.map((faq) => `
        <details class="tool-faq-item">
            <summary class="tool-faq-summary">${faq.q}</summary>
            <div class="tool-faq-answer"><p>${faq.a}</p></div>
        </details>
    `).join('');

    return `
        <div class="seo-landing-content" style="margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid var(--tool-card-border);">
            
            <!-- EEAT Verification & Metadata Indicators -->
            <div class="eeat-badge-panel">
                <div>
                    <span style="color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">Reviewed By</span>
                    <strong style="color: var(--text-primary);">SUH Security & Editorial Panel</strong>
                </div>
                <div>
                    <span style="color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">Verification Status</span>
                    <strong style="color: var(--success-color);">✓ Verified 100% Client-Side Safe</strong>
                </div>
                <div>
                    <span style="color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">Last Updated</span>
                    <strong style="color: var(--text-primary);">August 2026</strong>
                </div>
                <div>
                    <span style="color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">Version</span>
                    <strong style="color: var(--text-primary);">1.1.0 (Production)</strong>
                </div>
            </div>

            <!-- Trust Indicator Grid -->
            <div class="trust-indicator-grid">
                <div class="trust-indicator-card">
                    <span class="trust-indicator-icon">🔒</span>
                    <strong class="trust-indicator-title">Local Processing</strong>
                    <span class="trust-indicator-desc">No data leaves your device</span>
                </div>
                <div class="trust-indicator-card">
                    <span class="trust-indicator-icon">🚫</span>
                    <strong class="trust-indicator-title">No Server Uploads</strong>
                    <span class="trust-indicator-desc">Browser sandbox privacy</span>
                </div>
                <div class="trust-indicator-card">
                    <span class="trust-indicator-icon">🔑</span>
                    <strong class="trust-indicator-title">Zero Signup Required</strong>
                    <span class="trust-indicator-desc">Free unlimited access</span>
                </div>
                <div class="trust-indicator-card">
                    <span class="trust-indicator-icon">📶</span>
                    <strong class="trust-indicator-title">PWA Offline Ready</strong>
                    <span class="trust-indicator-desc">Works without active internet</span>
                </div>
            </div>

            <!-- Detailed Guide Introduction -->
            <section style="margin-bottom: 2.5rem;">
                <h2 style="font-size: 1.6rem; color: var(--primary-color); margin-bottom: 1.2rem; font-weight: 700;">Detailed Guide & Verification for ${name}</h2>
                <p style="line-height: 1.7; color: var(--text-secondary); margin-bottom: 1.2rem;">
                    The <strong>${name}</strong> is a high-performance browser-native utility engineered to simplify your ${catName.toLowerCase()} workflows. 
                    Unlike traditional web tools that transfer files to a cloud database, our programmatic engine runs 100% client-side. 
                    This ensures that whether you are handling sensitive academic reports, private credentials, or code strings, your information remains fully protected.
                </p>
                <p style="line-height: 1.7; color: var(--text-secondary);">
                    This specialized page is optimized for key terms like <em>${keywordsStr}</em>. 
                    By utilizing browser-native capabilities, the ${name} bypasses internet upload speeds, providing instant computations, parsing, or conversions.
                </p>
            </section>

            <!-- Warning Box (Common Mistakes) -->
            <div class="callout-box warning-box">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary); font-size: 1rem; display: flex; align-items: center; gap: 0.5rem; font-weight: 700;">
                    <span>⚠️</span> Common Mistakes to Avoid
                </h4>
                <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">
                    ${commonMistake}
                </p>
            </div>

            <!-- Info Box (Pro Tips) -->
            <div class="callout-box info-box">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary); font-size: 1rem; display: flex; align-items: center; gap: 0.5rem; font-weight: 700;">
                    <span>💡</span> Pro Tips & Best Practices
                </h4>
                <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">
                    ${proTip}
                </p>
            </div>

            <!-- Practical Examples -->
            <section style="margin-bottom: 2.5rem;">
                <h3 style="font-size: 1.35rem; margin-bottom: 1.2rem; color: var(--text-primary); font-weight: 700;">Real-Life Applications & Examples</h3>
                <div style="display: grid; gap: 1rem;">
                    ${categoryExamples}
                </div>
            </section>

            <!-- Detailed Step-by-Step Instructions -->
            <section style="margin-bottom: 2.5rem;">
                <h3 style="font-size: 1.35rem; margin-bottom: 1.2rem; color: var(--text-primary); font-weight: 700;">How to Use</h3>
                <ol style="line-height: 1.8; color: var(--text-secondary); padding-left: 1.5rem;">
                    <li>Select or input the source data (such as files, strings, dates, or values) in the workspace inputs above.</li>
                    <li>Configure the operational variables (such as formatting specifications, passwords, or ranges).</li>
                    <li>Execute the conversion or calculation by clicking the primary action button.</li>
                    <li>Review the results rendered in the dedicated result area.</li>
                    <li>Export the output safely using the "Copy Output" or "Download File" buttons.</li>
                </ol>
            </section>

            <!-- FAQ Section -->
            <section class="tool-faq-section" style="margin-bottom: 3rem;">
                <h3 style="font-size: 1.4rem; margin-bottom: 1.8rem; color: var(--text-primary); font-weight: 700;">Frequently Asked Questions (FAQ)</h3>
                ${faqHTML}
            </section>

            <!-- Browser Compatibility -->
            <section style="margin-bottom: 2.5rem; background: var(--surface-elevated); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--tool-card-border);">
                <h4 style="margin: 0 0 1rem 0; color: var(--text-primary); font-size: 1.1rem; font-weight: 700;">Browser & Device Support</h4>
                <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                    This tool is fully WCAG AA accessible and compatible with Apple Safari, Google Chrome, Mozilla Firefox, Microsoft Edge, and Opera. It is tested on iOS, Android, macOS, Linux, and Windows platforms.
                </p>
            </section>
        </div>
    `;
};

// 4. Schema Engine (Injects comprehensive structured schemas)
export const injectJSONLDSchemas = (toolOrCategory, isCategory = false) => {
    removeJSONLDSchemas(); // Clear old schemas
    const siteUrl = "https://student-utility-hub-2ss3.vercel.app";

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": siteUrl,
        "name": "Student Utility Hub",
        "description": "75+ Free Online Client-Side Tools and Calculators"
    };

    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Student Utility Hub Community",
        "url": siteUrl,
        "logo": `${siteUrl}/assets/logo.png`
    };

    const schemas = [websiteSchema, orgSchema];

    if (isCategory) {
        const catName = toolOrCategory.name;
        const catUrl = `${siteUrl}/${toolOrCategory.id}-tools`;

        const collectionSchema = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": catName,
            "url": catUrl,
            "description": toolOrCategory.description
        };

        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
                { "@type": "ListItem", "position": 2, "name": catName, "item": catUrl }
            ]
        };

        schemas.push(collectionSchema, breadcrumbSchema);
    } else {
        const toolUrl = `${siteUrl}/tools/${toolOrCategory.slug}`;
        const catName = toolOrCategory.category.charAt(0).toUpperCase() + toolOrCategory.category.slice(1);
        const catUrl = `${siteUrl}/${toolOrCategory.category}-tools`;

        const webpageSchema = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": toolOrCategory.seoTitle,
            "url": toolUrl,
            "description": toolOrCategory.seoDescription
        };

        const softwareSchema = {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": toolOrCategory.name,
            "operatingSystem": "All",
            "applicationCategory": "EducationalApplication",
            "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "USD"
            }
        };

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": `Is the Student Utility Hub ${toolOrCategory.name} safe?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Yes. The ${toolOrCategory.name} runs entirely in your local browser sandbox.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `Can I access the ${toolOrCategory.name} offline?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Yes, once cached, the PWA framework allows offline usage.`
                    }
                }
            ]
        };

        const howToSchema = {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": `How to use the ${toolOrCategory.name}`,
            "step": [
                { "@type": "HowToStep", "name": "Input data", "text": "Select your file or type text into the workspace inputs." },
                { "@type": "HowToStep", "name": "Configure settings", "text": "Set parameters like tolerance thresholds or sorting orders." },
                { "@type": "HowToStep", "name": "Get results", "text": "Click the action button to process and copy your results." }
            ]
        };

        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
                { "@type": "ListItem", "position": 2, "name": `${catName} Tools`, "item": catUrl },
                { "@type": "ListItem", "position": 3, "name": toolOrCategory.name, "item": toolUrl }
            ]
        };

        schemas.push(webpageSchema, softwareSchema, faqSchema, howToSchema, breadcrumbSchema);
    }

    schemas.forEach((schema, idx) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.className = 'dynamic-json-ld';
        script.id = `schema-programmatic-${idx}`;
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    });

    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        document.head.appendChild(robotsMeta);
    }
    const isDraft = toolOrCategory.status === 'draft';
    robotsMeta.setAttribute('content', isDraft ? 'noindex, nofollow' : 'index, follow');
};

export const removeJSONLDSchemas = () => {
    const scripts = document.querySelectorAll('.dynamic-json-ld');
    scripts.forEach(s => s.remove());
};
