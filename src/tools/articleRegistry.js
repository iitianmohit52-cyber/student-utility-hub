/**
 * articleRegistry.js
 * Central database for evergreen educational guides, comparisons, and resources.
 * Programmatically mapped to corresponding Tools to build topical clusters.
 */

export const articles = [
    {
        id: 'how-to-merge-pdfs-guide',
        slug: 'how-to-merge-pdfs-guide',
        title: 'How to Merge PDF Files Online: A Beginner\'s Guide',
        summary: 'Learn the easiest ways to combine multiple PDF documents into a single PDF file securely and client-side without size limits.',
        category: 'pdf',
        toolId: 'pdfMerge',
        type: 'guide',
        keywords: ['pdf merge', 'combine pdf', 'join pdf files', 'free pdf tools'],
        reviewedBy: 'SUH Editorial Board',
        lastUpdated: 'August 2026',
        version: '1.0.0',
        readTime: '4 min read',
        references: ['https://www.iso.org/standard/75839.html (PDF Reference Standards)'],
        content: {
            intro: 'Merging PDF files is one of the most common administrative tasks in schools and offices. Whether you are assembling a research report, compiling a portfolio, or combining multiple scanned notes, putting everything in one document makes distribution easy.',
            steps: [
                'Launch the PDF Merger tool on Student Utility Hub.',
                'Select or drag-and-drop the PDF files you wish to combine.',
                'Hold Ctrl/Cmd to choose multiple files at once.',
                'Verify the sorting order of the files in the preview grid.',
                'Click "Merge PDFs" to execute the local browser consolidation.',
                'Save the output document instantly to your local storage.'
            ],
            examples: [
                'Combining a cover page PDF with research chapters and bibliographies.',
                'Joining scanned receipts or invoice PDFs into a single file for accounting.'
            ],
            tips: [
                'Keep the file sizes minimal by running them through the PDF Compressor prior to merging.',
                'Verify that none of the files are password-protected, or decrypt them first.'
            ],
            warnings: [
                'Avoid merging corrupted documents as they might break the local parsing buffer.',
                'Do not upload encrypted templates directly without unlocking them first.'
            ],
            faqs: [
                { q: 'Is there a limit to how many PDFs I can merge?', a: 'No, because our consolidation script runs directly in browser memory without sending files over the network.' },
                { q: 'Does merging PDFs compromise my personal data?', a: 'No, all copying and rendering processes occur 100% locally on your computer.' }
            ]
        }
    },
    {
        id: 'gst-formula-calculation-guide',
        slug: 'gst-formula-calculation-guide',
        title: 'Understanding GST: Formulas & How to Calculate Tax',
        summary: 'A complete breakdown of Goods and Services Tax (GST) inclusive and exclusive mathematical calculations with real-world examples.',
        category: 'calculator',
        toolId: 'gstCalculator',
        type: 'tutorial',
        keywords: ['gst formula', 'calculate tax', 'gst inclusive', 'gst exclusive'],
        reviewedBy: 'SUH Finance Panel',
        lastUpdated: 'August 2026',
        version: '1.0.1',
        readTime: '6 min read',
        references: ['https://www.gst.gov.in/ (GST official guidelines)'],
        content: {
            intro: 'Goods and Services Tax (GST) is a transaction-based tax levied on goods and services. Meticulous accounting requires understanding how to calculate tax components, whether adding to a net price or extracting tax from a final invoice.',
            steps: [
                'Open the GST Calculator on Student Utility Hub.',
                'Enter the base amount in the Amount input field.',
                'Choose the appropriate GST tax slab (e.g. 5%, 12%, 18%, 28%).',
                'Select whether you want to calculate GST Exclusive (add tax) or GST Inclusive (extract tax).',
                'Click "Calculate GST" to view net price, tax amount, and final totals.'
            ],
            examples: [
                'Exclusive calculation: A ₹1,000 product with 18% GST adds ₹180 tax, resulting in a ₹1,180 total.',
                'Inclusive calculation: A ₹1,180 total with 18% GST extracts ₹180 tax, revealing a ₹1,000 net price.'
            ],
            tips: [
                'Ensure you select the correct tax rate category (standard services usually fall under 18% slabs).',
                'Use the calculator to double-check supplier invoice math errors.'
            ],
            warnings: [
                'Do not add GST standard rate to an amount that already includes tax. This is a common error.',
                'Verify whether additional municipal cess rates apply in your tax jurisdiction.'
            ],
            faqs: [
                { q: 'What is the standard GST formula?', a: 'Exclusive GST = (Base Price * Tax Rate) / 100. Inclusive GST = Total Price - (Total Price / (1 + Tax Rate / 100)).' },
                { q: 'Does this calculator support decimals?', a: 'Yes, calculations are precise up to two decimal places.' }
            ]
        }
    },
    {
        id: 'compress-image-without-losing-quality-guide',
        slug: 'compress-image-without-losing-quality-guide',
        title: 'How to Compress Images Online Without Quality Loss',
        summary: 'Optimize your portfolio website, blog, or homework portals by reducing JPG, PNG, and WEBP file sizes safely in the browser.',
        category: 'image',
        toolId: 'imageCompressor',
        type: 'guide',
        keywords: ['image compression', 'optimize photos', 'reduce image size', 'convert format'],
        reviewedBy: 'SUH Media Specialist',
        lastUpdated: 'August 2026',
        version: '1.0.0',
        readTime: '5 min read',
        references: ['https://w3.org/Graphics/JPEG/ (JPEG Image Standards)'],
        content: {
            intro: 'High-res images look great but slow down web pages and fail document upload limits. Compressing images removes unnecessary metadata and reduces pixel payload without visibly degrading visual quality.',
            steps: [
                'Open the Image Compressor tool.',
                'Upload your JPG, PNG, or WEBP photograph.',
                'Adjust the quality slider (80% quality is standard for web optimization).',
                'Observe the dynamic preview of size changes.',
                'Click download to export the compressed asset.'
            ],
            examples: [
                'Reducing a 5MB camera photo down to 400KB to meet online registration limits.',
                'Compressing website icons to WEBP formats to score a 100 rating on Lighthouse speed indices.'
            ],
            tips: [
                'A quality level of 75%-85% usually yields a 70% file size reduction with zero visual difference.',
                'Convert PNG files containing solid colors to JPG to save massive amounts of space.'
            ],
            warnings: [
                'Do not compress PNG files with transparent backgrounds to JPEG format, or you will lose transparency.',
                'Avoid double-compressing files as it leads to visible compression artifacts (blurry pixels).'
            ],
            faqs: [
                { q: 'Does local compression save original files?', a: 'Yes, compression runs in browser memory and outputs a new file, leaving your original photo untouched.' },
                { q: 'What is the best format for photographic images?', a: 'WEBP offers superior compression parameters over JPG, resulting in smaller files at identical qualities.' }
            ]
        }
    },
    {
        id: 'emi-loan-repayment-guide',
        slug: 'emi-loan-repayment-guide',
        title: 'Demystifying EMIs: How Monthly Loan Repayments Work',
        summary: 'Understand the mathematical amortization formula behind EMI loans, compounding interest rates, and loan tenures.',
        category: 'calculator',
        toolId: 'emiCalculator',
        type: 'guide',
        keywords: ['emi calculator', 'loan repayment', 'amortization schedule', 'interest rates'],
        reviewedBy: 'SUH Financial Advisor',
        lastUpdated: 'August 2026',
        version: '1.0.0',
        readTime: '5 min read',
        references: ['https://en.wikipedia.org/wiki/Equated_monthly_installment (EMI Amortization Math)'],
        content: {
            intro: 'An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are applied to both interest and principal, amortization-style, so that over a specified number of years, the loan is paid off in full.',
            steps: [
                'Access the EMI Calculator.',
                'Enter the principal loan amount you wish to borrow.',
                'Input the annual interest rate (e.g. 8.5%).',
                'Choose the loan duration tenure in years or months.',
                'Observe the monthly EMI payment breakdown instantly.'
            ],
            examples: [
                'Calculating a ₹50,00,000 Home Loan at 8.5% interest over 20 years to verify monthly EMI.',
                'Checking a ₹10,00,000 Car Loan at 10.5% interest over 5 years to verify total interest expense.'
            ],
            tips: [
                'Even a minor 0.5% interest rate change yields massive cumulative savings over long tenures.',
                'Make pre-payments whenever possible to reduce interest payouts dramatically.'
            ],
            warnings: [
                'Ensure you do not enter monthly interest rates in place of annual interest rates.',
                'Double-check processing fees as they represent additional upfront loan costs.'
            ],
            faqs: [
                { q: 'What formula is used to calculate EMI?', a: 'EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P is Principal, R is monthly interest rate, and N is monthly tenure.' },
                { q: 'Can I calculate pre-payments with this tool?', a: 'This tool estimates standard EMI. Pre-payments require customized amortization schedules.' }
            ]
        }
    }
];

export const getArticlesByCategory = (category) => {
    return articles.filter(art => art.category === category);
};

export const getArticleBySlug = (slug) => {
    return articles.find(art => art.slug === slug);
};
