import { createElement } from '../utils/dom.js';

export const renderFooter = () => {
    const footer = createElement('footer', 'app-footer');
    
    footer.innerHTML = `
        <div class="footer-container">
            <div class="footer-brand">
                <h3>Student Utility Hub</h3>
                <p>Your ultimate collection of free, secure, and client-side online tools designed for maximum efficiency.</p>
                <div class="trust-signals" style="margin-top: 1rem; display: flex; gap: 1rem; align-items: center; color: var(--text-secondary); font-size: 0.85rem;">
                    <span>🔒 SSL Secure</span>
                    <span>🛡️ 100% Privacy</span>
                    <span>⚡ Lightning Fast</span>
                </div>
            </div>
            
            <div class="footer-links-grid">
                <div class="footer-column">
                    <h4>PDF & Dev Tools</h4>
                    <ul>
                        <li><a href="#pdfMerge">PDF Merger</a></li>
                        <li><a href="#pdfSplit">PDF Splitter</a></li>
                        <li><a href="#jwtDecoder">JWT Decoder</a></li>
                        <li><a href="#htmlFormatter">HTML Formatter</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Calculators & Student</h4>
                    <ul>
                        <li><a href="#cgpaCalculator">CGPA Calculator</a></li>
                        <li><a href="#emiCalculator">EMI Calculator</a></li>
                        <li><a href="#sipCalculator">SIP Calculator</a></li>
                        <li><a href="#pomodoroTimer">Pomodoro Timer</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Legal & Trust</h4>
                    <ul>
                        <li><a href="#article-image-tools">Privacy Policy</a></li>
                        <li><a href="#article-image-tools">Terms of Service</a></li>
                        <li><a href="#article-image-tools">Disclaimer</a></li>
                        <li><a href="#footer">Contact Us</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Student Utility Hub. All rights reserved. Made with ❤️ for Students and Professionals.</p>
            <div class="ad-placeholder footer-ad">
                <p>Footer Ad Placeholder (728x90)</p>
            </div>
        </div>
    `;

    return footer;
};
