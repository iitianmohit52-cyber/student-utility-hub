import { LegalPageLayout } from '../ui/LegalPageLayout.js';
import { LegalConfig } from '../../config/legalConfig.js';

export const renderDisclaimer = (container) => {
    const content = `
        <h2>1. General Information Disclaimer</h2>
        <p>The information and tools provided by <strong>${LegalConfig.siteName}</strong> are for general informational, educational, and utility purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or tool output on the Site.</p>

        <h2>2. No Professional Advice</h2>
        <p>The tools and content on ${LegalConfig.siteName} <strong>do not constitute professional advice</strong>. You should not rely upon the output of our tools as a substitute for consultations with qualified professionals.</p>
        
        <h3>Financial and Tax Calculators (EMI, GST, SIP, etc.)</h3>
        <p>Our financial calculators (including but not limited to EMI, GST, SIP, Salary, and Discount calculators) provide estimations based on the mathematical formulas and inputs you provide. These estimates do not account for hidden fees, fluctuating interest rates, exact banking methodologies, or specific regional tax laws. <strong>They are not financial, legal, or tax advice.</strong> Always consult a certified financial advisor or accountant before making financial decisions.</p>

        <h3>Health and Fitness Calculators (BMI, Age, etc.)</h3>
        <p>Any health-related calculators (such as the BMI Calculator) are for general estimation purposes only. They do not diagnose, treat, cure, or prevent any medical condition. The results should not replace professional medical advice, diagnosis, or treatment. Always consult your physician or other qualified health provider with any questions regarding a medical condition.</p>

        <h3>Educational Tools (CGPA, GPA, Grade Converters)</h3>
        <p>Our educational calculators provide grade estimations based on standard formulas. However, different universities, schools, and countries use proprietary grading scales and rounding methods. Your official transcripts and institutional guidelines will always supersede any estimations provided by our tools.</p>

        <h3>Developer and Formatting Tools</h3>
        <p>While our developer utilities (JSON formatter, CSS minifier, Base64 encoders, etc.) are built to industry standards, we do not guarantee their output is completely bug-free or optimized for all production environments. It is your responsibility to test and review any code, formatted text, or data conversions before deploying them to production environments.</p>

        <h2>3. Local Processing and Privacy Disclaimer</h2>
        <p>We emphasize that our tools process data locally within your browser. However, the ultimate security of your local device (including freedom from malware, keyloggers, or compromised browser extensions) is your responsibility. We are not liable for data breaches that occur due to vulnerabilities on your local device.</p>

        <h2>4. External Links and Third-Party Advertising</h2>
        <p>The Site may contain links to other websites or content belonging to or originating from third parties, or links to websites and features in banners or other advertising (such as Google AdSense). Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>
        <p>We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site or any website or feature linked in any banner or other advertising.</p>

        <h2>5. Limitation of Liability</h2>
        <p>UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR TOOLS, OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION OR TOOL OUTPUT ON THE SITE IS SOLELY AT YOUR OWN RISK.</p>

        <h2>6. Contact Us</h2>
        <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at <a href="mailto:${LegalConfig.contactEmail}">${LegalConfig.contactEmail}</a>.</p>
    `;

    container.innerHTML = LegalPageLayout({
        title: 'Disclaimer',
        seoTitle: `Disclaimer - ${LegalConfig.siteName}`,
        seoDescription: 'Read the Disclaimer for Student Utility Hub. Understand the informational nature of our calculators, tools, and processing capabilities.',
        slug: 'disclaimer',
        content
    });
};
