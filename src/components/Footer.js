import { createElement } from '../utils/dom.js';

export const renderFooter = () => {
    const footer = createElement('footer', 'app-footer');
    
    footer.innerHTML = `
        <div class="footer-container">
            <div class="footer-brand">
                <a href="/" style="display:inline-flex; align-items:center; gap:0.5rem; text-decoration:none; margin-bottom:1rem;">
                    <img src="/logo.png" alt="Student Utility Hub Logo" class="footer-logo" style="height: 42px; width: auto; object-fit: contain;" />
                    <span style="font-size:1.3rem; font-weight:700; color:var(--text-primary);">Student Utility Hub</span>
                </a>
                <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.6; max-width:320px;">
                    Free, lightweight online tools for students, creators, developers, and professionals. Fast browser processing with zero unnecessary sign-up.
                </p>
                <div class="trust-signals" style="margin-top: 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap; color: var(--text-secondary); font-size: 0.82rem;">
                    <span>🔒 SSL Secured</span>
                    <span>•</span>
                    <span>🛡️ Privacy-First</span>
                    <span>•</span>
                    <span>⚡ Instant Run</span>
                </div>
            </div>
            
            <div class="footer-links-grid">
                <div class="footer-column">
                    <h4>Tool Categories</h4>
                    <ul>
                        <li><a href="/pdf-tools" class="nav-link">PDF Tools</a></li>
                        <li><a href="/image-tools" class="nav-link">Image Tools</a></li>
                        <li><a href="/developer-tools" class="nav-link">Developer Tools</a></li>
                        <li><a href="/calculators" class="nav-link">Calculators</a></li>
                        <li><a href="/text-tools" class="nav-link">Text & Content</a></li>
                        <li><a href="/student-tools" class="nav-link">Student Utilities</a></li>
                        <li><a href="/media-tools" class="nav-link">Audio & Video</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Popular Tools</h4>
                    <ul>
                        <li><a href="/tools/pdf-compress" class="nav-link">PDF Compressor</a></li>
                        <li><a href="/tools/pdf-merge" class="nav-link">PDF Merger</a></li>
                        <li><a href="/tools/image-compressor" class="nav-link">Image Compressor</a></li>
                        <li><a href="/tools/qr-code-generator" class="nav-link">QR Code Generator</a></li>
                        <li><a href="/tools/gst-calculator" class="nav-link">GST Calculator</a></li>
                        <li><a href="/tools/emi-calculator" class="nav-link">EMI Calculator</a></li>
                        <li><a href="/tools/sip-calculator" class="nav-link">SIP Calculator</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Knowledge Hub</h4>
                    <ul>
                        <li><a href="/blog" class="nav-link">All Study Guides</a></li>
                        <li><a href="/guides/how-to-merge-pdfs-guide" class="nav-link">PDF Merge Guide</a></li>
                        <li><a href="/guides/compress-image-without-losing-quality-guide" class="nav-link">Image Compression</a></li>
                        <li><a href="/guides/gst-formula-calculation-guide" class="nav-link">GST Tax Calculation</a></li>
                        <li><a href="/guides/emi-loan-repayment-guide" class="nav-link">EMI Loan Planning</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Legal & Trust</h4>
                    <ul>
                        <li><a href="/privacy-policy" class="nav-link">Privacy Policy</a></li>
                        <li><a href="/terms-of-service" class="nav-link">Terms of Service</a></li>
                        <li><a href="/disclaimer" class="nav-link">Disclaimer</a></li>
                        <li><a href="/contact" class="nav-link">Contact Us</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Student Utility Hub. All rights reserved. Free, browser-friendly utilities for everyone.</p>
            <div class="ad-placeholder footer-ad" style="margin-top: 1rem;"></div>
        </div>
    `;

    return footer;
};
