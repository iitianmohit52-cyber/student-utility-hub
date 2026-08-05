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
                    <h4>Top Calculators</h4>
                    <ul>
                        <li><a href="#emiCalculator" onclick="window.location.reload()">EMI Calculator</a></li>
                        <li><a href="#sipCalculator" onclick="window.location.reload()">SIP Calculator</a></li>
                        <li><a href="#ageCalculator" onclick="window.location.reload()">Age Calculator</a></li>
                        <li><a href="#bmiCalculator" onclick="window.location.reload()">BMI Calculator</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Media Tools</h4>
                    <ul>
                        <li><a href="#imageCompressor" onclick="window.location.reload()">Image Compressor</a></li>
                        <li><a href="#imageConverter" onclick="window.location.reload()">Image Converter</a></li>
                        <li><a href="#audioTrimmer" onclick="window.location.reload()">Audio Trimmer</a></li>
                        <li><a href="#videoConverter" onclick="window.location.reload()">Video Converter</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Legal & Trust</h4>
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Disclaimer</a></li>
                        <li><a href="#">Contact Us</a></li>
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
