import { loadTool } from '../tools/toolLoader.js';
import { tools } from '../tools/toolRegistry.js';
import { createToolCard } from '../utils/dom.js';
import { withErrorBoundary } from '../utils/errorHandler.js';
import { Analytics, AnalyticsEvents } from '../analytics/analytics.js';

export const renderModal = () => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'toolModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modalTitle');
    
    modal.innerHTML = `
        <div class="modal-content">
            <button type="button" class="close-button" aria-label="Close modal">&times;</button>
            <h2 id="modalTitle">Tool Title</h2>
            <div id="modalBody" class="modal-body">
                <!-- Tool-specific content will be injected here -->
            </div>
            <center>
                <div class="ad-placeholder inline-ad" style="margin-top: 20px;">
                    <p>Ad Placeholder (Responsive)</p>
                </div>
            </center>
            <div id="modalAlert" class="modal-alert" style="display:none;"></div>
        </div>
    `;

    const closeButton = modal.querySelector('.close-button');
    const modalBody = modal.querySelector('#modalBody');
    const modalTitle = modal.querySelector('#modalTitle');
    const modalAlert = modal.querySelector('#modalAlert');

    let currentToolId = null;

    let originalTitle = '';
    let originalMetaDesc = '';

    const closeModal = () => {
        if (currentToolId) {
            Analytics.tool(AnalyticsEvents.TOOL_CLOSE, currentToolId);
            currentToolId = null;
        }

        modal.style.display = 'none';
        document.body.style.overflow = ''; // restore scrolling
        modalBody.innerHTML = '';
        
        // Remove dynamic schema to avoid duplicates
        const oldSchema = document.getElementById('dynamic-breadcrumb-schema');
        if (oldSchema) oldSchema.remove();

        // Restore SEO
        if (originalTitle) document.title = originalTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && originalMetaDesc) metaDesc.setAttribute('content', originalMetaDesc);

        if (window.currentToolCleanup) {
            window.currentToolCleanup();
            window.currentToolCleanup = null;
        }
    };

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });


    // SEO Procedural Content Generator
    const generateSEOContent = (tool) => {
        const catName = tool.category.charAt(0).toUpperCase() + tool.category.slice(1);
        
        // Related Tools Logic
        const relatedTools = tools.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 3);
        let relatedHtml = '';
        if (relatedTools.length > 0) {
            relatedHtml = `
                <div class="related-tools-section" style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--tool-card-border);">
                    <h3 style="margin-bottom: 1.5rem;">Related ${catName} Tools</h3>
                    <div class="tool-grid" id="relatedToolsGrid" style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));">
                        <!-- Related tools will be injected here after DOM mount -->
                    </div>
                </div>
            `;
        }

        return `
            <div class="tool-seo-content" style="margin-top: 3rem;">
                <div class="ad-placeholder inline-ad" style="margin-bottom: 2rem;">
                    <p>Inside Article Ad (Responsive)</p>
                </div>

                <h3>Introduction</h3>
                <p>The <strong>${tool.name}</strong> is a highly optimized, 100% client-side utility designed specifically for processing your data securely and instantly. Whether you are a student, professional, or developer, this ${catName} tool provides exactly what you need without the bloat.</p>

                <h3>Benefits of Using Our ${tool.name}</h3>
                <ul>
                    <li><strong>Privacy First:</strong> Your files and data are processed locally in your browser.</li>
                    <li><strong>Lightning Fast:</strong> Zero server latency means instant results.</li>
                    <li><strong>Free to Use:</strong> No subscriptions, no hidden fees.</li>
                </ul>

                <h3>How to Use</h3>
                <p>${tool.description} Simply interact with the controls above to execute the process. The results are generated in real-time.</p>

                <h3>Features</h3>
                <p>This tool is packed with essential features to streamline your ${catName.toLowerCase()} workflow, ensuring high precision and ease of use.</p>

                <h3>Use Cases & Examples</h3>
                <p>Perfect for academic projects, professional data processing, and everyday digital tasks requiring a robust <strong>${tool.name}</strong>.</p>

                <h3>Pro Tips</h3>
                <p>For best results, ensure your inputs are correctly formatted. Bookmark this page (Ctrl+D) for quick access to the ${tool.name} anytime you need it.</p>

                <h3>Frequently Asked Questions</h3>
                <details style="margin-bottom: 1rem; background: var(--surface-elevated); padding: 1rem; border-radius: 8px;">
                    <summary style="font-weight: 600; cursor: pointer;">Is the ${tool.name} truly free?</summary>
                    <p style="margin-top: 0.5rem; color: var(--text-secondary);">Yes, the Student Utility Hub ${tool.name} is entirely free to use with no usage limits.</p>
                </details>
                <details style="margin-bottom: 1rem; background: var(--surface-elevated); padding: 1rem; border-radius: 8px;">
                    <summary style="font-weight: 600; cursor: pointer;">Is my data safe?</summary>
                    <p style="margin-top: 0.5rem; color: var(--text-secondary);">Absolutely. All calculations and processing for the ${tool.name} happen directly on your device.</p>
                </details>

                <div class="ad-placeholder inline-ad" style="margin-top: 2rem; margin-bottom: 2rem;">
                    <p>After FAQ Ad (Responsive)</p>
                </div>

                <h3>Conclusion</h3>
                <p>The <strong>${tool.name}</strong> stands out as a premier ${catName} utility. Its combination of speed, privacy, and simplicity makes it an indispensable tool for your digital toolkit.</p>
                
                ${relatedHtml}
            </div>
        `;
    };

    // Global method to open modal
    window.openModal = async (tool) => {
        const catName = tool.category.charAt(0).toUpperCase() + tool.category.slice(1);
        modalTitle.innerHTML = `
            <div class="breadcrumb" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: 500;">
                Home > ${catName} > ${tool.name}
            </div>
            ${tool.name}
        `;
        
        // Inject Breadcrumb Schema dynamically
        const breadcrumbSchema = document.createElement('script');
        breadcrumbSchema.type = 'application/ld+json';
        breadcrumbSchema.id = 'dynamic-breadcrumb-schema';
        breadcrumbSchema.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://student-utility-hub-2ss3.vercel.app/"
            },{
                "@type": "ListItem",
                "position": 2,
                "name": catName,
                "item": `https://student-utility-hub-2ss3.vercel.app/#${tool.category}`
            },{
                "@type": "ListItem",
                "position": 3,
                "name": tool.name,
                "item": `https://student-utility-hub-2ss3.vercel.app/#${tool.id}`
            }]
        });
        document.head.appendChild(breadcrumbSchema);

        modalBody.innerHTML = '<div style="text-align:center; padding:2rem;"><div class="skeleton-icon" style="margin: 0 auto;"></div><p style="margin-top:1rem; color:var(--text-secondary);">Loading Tool...</p></div>';
        modalAlert.style.display = 'none';
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // prevent background scrolling
        
        currentToolId = tool.id;
        
        // Save and Update Document SEO
        originalTitle = document.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        originalMetaDesc = metaDesc ? metaDesc.getAttribute('content') : '';
        document.title = tool.seoTitle || `${tool.name} - Free Online Tool | Student Utility Hub`;
        if (metaDesc) {
            metaDesc.setAttribute('content', tool.seoDescription || tool.description);
        }

        Analytics.tool(AnalyticsEvents.TOOL_OPEN, tool.id, { category: tool.category });
        
        const toolFunction = await loadTool(tool.id);
        if (toolFunction) {
            modalBody.innerHTML = '';
            
            // 1. Render the actual tool workspace
            const workspace = document.createElement('div');
            workspace.className = 'tool-workspace';
            modalBody.appendChild(workspace);
            
            withErrorBoundary(() => toolFunction(workspace), workspace, tool.id);
            
            // 2. Append the SEO content blocks below
            const seoContainer = document.createElement('div');
            seoContainer.innerHTML = generateSEOContent(tool);
            modalBody.appendChild(seoContainer);

            // 3. Mount related tools if applicable
            const relatedGrid = seoContainer.querySelector('#relatedToolsGrid');
            if (relatedGrid) {
                const relatedTools = tools.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 3);
                relatedTools.forEach(rt => {
                    const card = createToolCard(rt);
                    card.querySelector('.tool-button').addEventListener('click', () => {
                        window.openModal(rt);
                    });
                    relatedGrid.appendChild(card);
                });
            }
        } else {
            modalBody.innerHTML = '<p style="color:#ff4757; text-align:center;">Failed to load tool. Please try again.</p>';
        }
    };

    return modal;
};
