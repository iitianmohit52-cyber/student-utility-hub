import { LegalPageLayout } from '../ui/LegalPageLayout.js';
import { LegalConfig } from '../../config/legalConfig.js';

export const renderPrivacyPolicy = (container) => {
    const content = `
        <h2>1. Introduction</h2>
        <p>Welcome to <strong>${LegalConfig.siteName}</strong>. Your privacy is critically important to us. This Privacy Policy explains how we handle your data, focusing on our architecture of client-side processing, localized storage, and anonymous usage analytics.</p>

        <h2>2. Client-Side Processing Architecture</h2>
        <p>Our platform is designed with a "Privacy First" architecture. <strong>We do not upload, transmit, or store your personal files, images, PDFs, or private text on our servers.</strong></p>
        <p>When you use tools like our PDF Merger, Image Compressor, or Code Formatters, all data processing occurs entirely within your web browser. Your files never leave your device.</p>

        <h2>3. Information We Do Not Collect</h2>
        <p>Because of our client-side architecture, we <strong>do not</strong> collect or have access to:</p>
        <ul>
            <li>The contents of any PDFs, images, or documents you process.</li>
            <li>Any passwords, codes, or private text you generate or format.</li>
            <li>Financial inputs you enter into our calculators (e.g., salary, loan amounts).</li>
        </ul>

        <h2>4. Local Browser Storage</h2>
        <p>To improve your experience without requiring an account, we use your browser's LocalStorage to save certain preferences on your device:</p>
        <ul>
            <li><strong>Favorites & Recently Used Tools:</strong> A list of tool IDs you use frequently.</li>
            <li><strong>Theme Preferences:</strong> Your choice of dark or light mode.</li>
            <li><strong>Search History:</strong> Recent search queries to provide quicker autocomplete suggestions.</li>
        </ul>
        <p>This data remains on your device and is not transmitted to our servers. You can clear this data at any time by clearing your browser's local storage or cache.</p>

        <h2>5. Analytics & Usage Tracking</h2>
        <p>We use third-party analytics services, such as Google Analytics, Google Tag Manager, and Microsoft Clarity, to understand how our website is used and to improve our tools.</p>
        <p>These services collect <strong>anonymous, aggregated data</strong> such as:</p>
        <ul>
            <li>Pages visited and tools executed.</li>
            <li>Browser type, operating system, and device screen size.</li>
            <li>Core Web Vitals (performance metrics like load times).</li>
            <li>General, non-precise geographic location (e.g., country or city level).</li>
        </ul>
        <p>We have configured our analytics strictly to ensure no personally identifiable information (PII) or user-inputted file data is captured.</p>

        <h2>6. Cookies and Advertising</h2>
        <p>We may use third-party advertising companies, such as Google AdSense, to serve ads when you visit our website. These companies may use cookies and similar technologies to collect information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>
        <ul>
            <li>Google, as a third-party vendor, uses cookies to serve ads on our site.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</li>
        </ul>

        <h2>7. Third-Party Links</h2>
        <p>Our website may contain links to external sites (such as GitHub, partner tools, or recommended resources). We are not responsible for the privacy practices or the content of these external websites.</p>

        <h2>8. Data Security</h2>
        <p>We use SSL/TLS encryption to ensure that your connection to our website is secure. While we do not process sensitive files on our servers, this encryption protects the delivery of the website code to your browser.</p>

        <h2>9. Children's Privacy</h2>
        <p>Our services are intended for general audiences, primarily students and professionals. We do not knowingly collect personal information from children under the age of 13. If you believe a child has provided us with personal data, please contact us so we can take appropriate action.</p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of any material changes by updating the "Last Updated" date at the top of this page.</p>

        <h2>11. Contact Us</h2>
        <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:</p>
        <p><strong>Email:</strong> <a href="mailto:${LegalConfig.contactEmail}">${LegalConfig.contactEmail}</a></p>
    `;

    container.innerHTML = LegalPageLayout({
        title: 'Privacy Policy',
        seoTitle: `Privacy Policy - ${LegalConfig.siteName}`,
        seoDescription: 'Read the Privacy Policy for Student Utility Hub. Learn how our client-side processing architecture protects your files, data, and privacy.',
        slug: 'privacy-policy',
        content
    });
};
