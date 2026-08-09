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
                    <h4>Legal & Trust</h4>
                    <ul>
                        <li><a href="/privacy-policy" class="nav-link">Privacy Policy</a></li>
                        <li><a href="/terms-of-service" class="nav-link">Terms of Service</a></li>
                        <li><a href="/disclaimer" class="nav-link">Disclaimer</a></li>
                        <li><a href="/contact" class="nav-link">Contact Us</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Creator</h4>
                    <ul>
                        <li><span style="color: var(--text-secondary); font-size: 0.9rem;">Inventor Mohit</span></li>
                        <li><a href="https://inventor-mohit.vercel.app/" target="_blank" rel="noopener noreferrer" class="nav-link">Visit Portfolio ↗</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="mailto:inventormohit004@gmail.com" class="nav-link">inventormohit004@gmail.com</a></li>
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
