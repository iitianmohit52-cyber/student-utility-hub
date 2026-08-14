import { createElement } from '../utils/dom.js';

export const renderFooter = () => {
    const footer = createElement('footer', 'app-footer');
    
    footer.innerHTML = `
        <div class="footer-container">
            <div class="footer-brand">
                <img src="/logo.png" alt="Student Utility Hub Logo" class="footer-logo" style="height: 48px; width: auto; object-fit: contain; margin-bottom: 1rem;" />
                <h3>Student Utility Hub</h3>
                <p>Free online tools for students, creators and developers.</p>
                <div class="trust-signals" style="margin-top: 1rem; display: flex; gap: 1rem; align-items: center; color: var(--text-secondary); font-size: 0.85rem;">
                    <span>🔒 SSL Secure</span>
                    <span>🛡️ 100% Privacy</span>
                    <span>⚡ Lightning Fast</span>
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
                        <li><a href="/tools/pdf-merge" class="nav-link">PDF Merger</a></li>
                        <li><a href="/tools/image-compressor" class="nav-link">Image Compressor</a></li>
                        <li><a href="/tools/emi-calculator" class="nav-link">EMI Calculator</a></li>
                        <li><a href="/tools/sip-calculator" class="nav-link">SIP Calculator</a></li>
                        <li><a href="/tools/qr-code-generator" class="nav-link">QR Code Generator</a></li>
                        <li><a href="/tools/scientific-calculator" class="nav-link">Scientific Calculator</a></li>
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
            <p>&copy; ${new Date().getFullYear()} Student Utility Hub. All rights reserved. Made with ❤️ for Students and Professionals.</p>
            <div class="ad-placeholder footer-ad"></div>
        </div>
    `;

    return footer;
};
