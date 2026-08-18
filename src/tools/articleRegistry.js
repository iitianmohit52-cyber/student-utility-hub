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
    },
    {
        id: 'how-to-compress-pdf-guide',
        slug: 'how-to-compress-pdf-guide',
        title: 'How to Compress PDF Files Online Without Quality Loss',
        summary: 'Reduce PDF file sizes safely in your browser. Perfect for government portal limits, email attachments, and university submissions.',
        category: 'pdf',
        toolId: 'pdfCompress',
        type: 'guide',
        keywords: ['compress pdf', 'reduce pdf size', 'pdf compression', 'free pdf compressor'],
        reviewedBy: 'SUH Document Engineering Panel',
        lastUpdated: 'August 2026',
        version: '1.0.0',
        readTime: '4 min read',
        references: ['https://www.iso.org/standard/75839.html (PDF Standards)'],
        content: {
            intro: 'PDF documents containing high-resolution scans, images, and uncompressed object streams can grow to 20MB or more, causing email rejections and portal upload failures. Compressing PDFs optimizes object streams and reduces file size while preserving text clarity.',
            steps: [
                'Open the PDF Compressor on Student Utility Hub.',
                'Select or drag-and-drop the PDF document you need to compress.',
                'Click "Compress PDF" to trigger the browser-native compression engine.',
                'Compare the original file size vs compressed size.',
                'Download your compressed PDF file instantly.'
            ],
            examples: [
                'Compressing an academic thesis from 18MB down to 3MB for university online submission portals.',
                'Optimizing scanned identity documents and invoices for email attachments under 5MB.'
            ],
            tips: [
                'If your PDF is primarily text, running compression will eliminate redundant object structures instantly.',
                'If your PDF contains encrypted security permissions, unlock it before compressing.'
            ],
            warnings: [
                'Avoid compressing a PDF that is already highly optimized, as further compression will yield minimal reduction.',
                'Do not upload password-protected PDFs without decrypting them first.'
            ],
            faqs: [
                { q: 'Does PDF compression upload my sensitive documents?', a: 'No, all compression runs 100% inside your browser using WebAssembly and JavaScript streams.' },
                { q: 'Will the compressed PDF be accepted by official portals?', a: 'Yes, the compressed document maintains full ISO standard PDF compliance and vector readability.' }
            ]
        }
    },
    {
        id: 'how-to-split-pdf-pages-guide',
        slug: 'how-to-split-pdf-pages-guide',
        title: 'How to Split PDF Pages Online & Extract Specific Pages',
        summary: 'Step-by-step tutorial on extracting individual pages, custom page ranges, or splitting large PDF documents into smaller files.',
        category: 'pdf',
        toolId: 'pdfSplit',
        type: 'tutorial',
        keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'pdf splitter'],
        reviewedBy: 'SUH Document Engineering Panel',
        lastUpdated: 'August 2026',
        version: '1.0.0',
        readTime: '4 min read',
        references: ['https://www.pdfa.org/ (PDF Association Guidelines)'],
        content: {
            intro: 'Often you only need a specific chapter from a multi-page textbook or a single signed contract page from a 50-page legal brief. Splitting PDF pages allows you to extract exactly the pages you need into a lightweight, standalone file.',
            steps: [
                'Open the PDF Splitter on Student Utility Hub.',
                'Select your PDF file from your device.',
                'Specify the page numbers or ranges (e.g. "1-3, 5, 8-10").',
                'Click "Split PDF" to extract the selected pages in your browser.',
                'Download the extracted PDF immediately.'
            ],
            examples: [
                'Extracting pages 12 to 15 containing specific assignment questions from a textbook.',
                'Separating the signature page from a real estate contract for swift email transmission.'
            ],
            tips: [
                'Use comma-separated values for individual pages and hyphens for continuous ranges.',
                'Deduplicate page ranges to avoid creating repetitive page sequences in your output.'
            ],
            warnings: [
                'Ensure page indices do not exceed the total page count of the source document.',
                'Verify extracted pages before distributing sensitive files.'
            ],
            faqs: [
                { q: 'Can I extract multiple non-consecutive pages?', a: 'Yes, you can extract any combination of pages like "1, 4, 7-10".' },
                { q: 'Is there a limit on how many pages the source PDF can have?', a: 'Because the tool runs client-side, it can process documents with hundreds of pages smoothly.' }
            ]
        }
    },
    {
        id: 'how-to-format-validate-json-guide',
        slug: 'how-to-format-validate-json-guide',
        title: 'How to Format, Minify & Validate JSON Data Online',
        summary: 'Master JSON data structures: Learn how to beautify minified API responses, fix syntax errors, and minify JSON for production speed.',
        category: 'developer',
        toolId: 'jsonFormatter',
        type: 'guide',
        keywords: ['json formatter', 'validate json', 'minify json', 'json beautifier'],
        reviewedBy: 'SUH Developer Team',
        lastUpdated: 'August 2026',
        version: '1.0.0',
        readTime: '5 min read',
        references: ['https://www.json.org/ (ECMA-404 JSON Standard)'],
        content: {
            intro: 'JavaScript Object Notation (JSON) is the universal data format for modern web APIs and server configurations. However, unformatted single-line JSON responses are impossible for developers to debug without structured indentation and syntax validation.',
            steps: [
                'Open the JSON Formatter & Validator on Student Utility Hub.',
                'Paste your raw, minified, or unformatted JSON string into the input area.',
                'Click "Format JSON (2 Spaces)" to beautify the hierarchy.',
                'Review syntax validation error messages if the payload is invalid.',
                'Use "Minify JSON" to compress payloads before network transmission.'
            ],
            examples: [
                'Beautifying a minified REST API response to inspect nested user arrays and token objects.',
                'Validating package.json configuration files before running build scripts.'
            ],
            tips: [
                'Use 2-space formatting for standard code readability in web applications.',
                'Click "Copy Output" to instantly paste clean JSON into VS Code or terminal configs.'
            ],
            warnings: [
                'JSON requires double quotes for keys and strings. Single quotes will trigger syntax errors.',
                'Trailing commas after the final object property are invalid in standard JSON.'
            ],
            faqs: [
                { q: 'Is it safe to format JSON containing API tokens or passwords?', a: 'Yes, our JSON formatter runs 100% in your local browser sandbox. Zero data is sent to our servers.' },
                { q: 'How large of a JSON file can this tool format?', a: 'It utilizes your browser native V8 engine parser, easily handling multi-megabyte JSON payloads in milliseconds.' }
            ]
        }
    },
    {
        id: 'how-to-calculate-sip-returns-guide',
        slug: 'how-to-calculate-sip-returns-guide',
        title: 'How to Calculate SIP Returns: Compounding Formula & Wealth Growth',
        summary: 'Understand the power of monthly Systematic Investment Plans (SIP), compounding interest frequencies, and long-term mutual fund wealth creation.',
        category: 'calculator',
        toolId: 'sipCalculator',
        type: 'tutorial',
        keywords: ['sip calculator', 'mutual fund returns', 'calculate sip', 'systematic investment plan'],
        reviewedBy: 'SUH Financial Advisor',
        lastUpdated: 'August 2026',
        version: '1.0.0',
        readTime: '6 min read',
        references: ['https://www.investopedia.com/terms/s/systematicinvestmentplan.asp (SIP Wealth Modeling)'],
        content: {
            intro: 'A Systematic Investment Plan (SIP) allows individuals to invest fixed sums regularly into mutual funds rather than lump-sum amounts. Through Rupee Cost Averaging and the power of compound interest, SIPs help students and young professionals build wealth steadily.',
            steps: [
                'Open the SIP Investment Calculator on Student Utility Hub.',
                'Enter your planned monthly investment amount (e.g. ₹5,000).',
                'Set the expected annual rate of return (e.g. 12% to 15% for equity index funds).',
                'Specify the investment duration in years (e.g. 5, 10, or 20 years).',
                'View the total invested capital, estimated returns, and total future maturity wealth.'
            ],
            examples: [
                'Investing ₹5,000 monthly at 12% p.a. for 10 years yields ₹11.6 Lakhs on an invested base of ₹6 Lakhs.',
                'A 20-year SIP of ₹10,000 monthly at 14% p.a. grows to ₹1.31 Crores with ₹1.07 Crores in compounding returns.'
            ],
            tips: [
                'Starting an SIP early maximizes the exponential exponential curve of compounding interest.',
                'Increase your monthly SIP by 5-10% every year as your income grows (Step-Up SIP).'
            ],
            warnings: [
                'Mutual fund investments are subject to market risks; past performance does not guarantee future returns.',
                'Maintain an emergency fund before locking all savings into equity investment plans.'
            ],
            faqs: [
                { q: 'What is the mathematical formula for SIP calculation?', a: 'M = P * [((1 + i)^n - 1) / i] * (1 + i), where P is monthly deposit, i is periodic monthly rate, and n is total months.' },
                { q: 'Can students start an SIP with small amounts?', a: 'Yes, most index funds allow starting SIP investments with as little as ₹500 per month.' }
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
