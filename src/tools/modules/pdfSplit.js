import { showAlert, hideAlert } from '../../utils/alerts.js';

const loadPdfLib = async () => {
    if (window.PDFLib) return window.PDFLib;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
        script.onload = () => resolve(window.PDFLib);
        script.onerror = () => reject(new Error('Failed to load PDF library'));
        document.head.appendChild(script);
    });
};

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="pdfSplitFile">Select PDF File:</label>
            <input type="file" id="pdfSplitFile" accept="application/pdf">
            
            <label for="pageRanges" style="margin-top:1rem;">Page Range to Extract (e.g. 1-3, 5):</label>
            <input type="text" id="pageRanges" placeholder="e.g. 1-3, 5">
            
            <button id="splitPdfBtn" style="margin-top:1.2rem;">✂️ Extract & Split PDF</button>
            <div id="splitResult" class="result-area" style="display:none; text-align:center;"></div>
        </div>
    `;

    const fileInput = container.querySelector('#pdfSplitFile');
    const rangeInput = container.querySelector('#pageRanges');
    const splitBtn = container.querySelector('#splitPdfBtn');
    const resultDiv = container.querySelector('#splitResult');

    splitBtn.onclick = async () => {
        const file = fileInput.files[0];
        const rangeStr = rangeInput.value.trim();

        if (!file) {
            showAlert('Please select a PDF file.', 'error');
            return;
        }
        if (!rangeStr) {
            showAlert('Please specify the page range (e.g. 1-3, 5).', 'error');
            return;
        }

        try {
            splitBtn.disabled = true;
            splitBtn.textContent = 'Processing PDF...';
            hideAlert();

            const { PDFDocument } = await loadPdfLib();
            const arrayBuffer = await file.arrayBuffer();
            const srcPdf = await PDFDocument.load(arrayBuffer);
            const totalPages = srcPdf.getPageCount();

            // Parse ranges with deduplication and validation
            const parsePageRanges = (str, maxPages) => {
                const parts = str.split(',').map(s => s.trim()).filter(Boolean);
                if (parts.length === 0) {
                    throw new Error('Please specify a valid page range.');
                }

                const selectedPages = new Set();
                const orderedIndices = [];

                for (const part of parts) {
                    if (part.includes('-')) {
                        const rangeTokens = part.split('-');
                        if (rangeTokens.length !== 2) {
                            throw new Error(`Invalid range format: "${part}"`);
                        }
                        let start = parseInt(rangeTokens[0].trim(), 10);
                        let end = parseInt(rangeTokens[1].trim(), 10);

                        if (isNaN(start) || isNaN(end)) {
                            throw new Error(`Invalid numbers in range: "${part}"`);
                        }

                        // Normalize reversed ranges (e.g. 5-3 -> 3-5)
                        if (start > end) {
                            const tmp = start;
                            start = end;
                            end = tmp;
                        }

                        if (start < 1 || end > maxPages) {
                            throw new Error(`Range "${part}" is out of bounds. The document has ${maxPages} page(s).`);
                        }

                        for (let i = start; i <= end; i++) {
                            if (!selectedPages.has(i)) {
                                selectedPages.add(i);
                                orderedIndices.push(i - 1);
                            }
                        }
                    } else {
                        const pageNum = parseInt(part, 10);
                        if (isNaN(pageNum)) {
                            throw new Error(`Invalid page number: "${part}"`);
                        }
                        if (pageNum < 1 || pageNum > maxPages) {
                            throw new Error(`Page ${pageNum} is out of bounds. The document has ${maxPages} page(s).`);
                        }
                        if (!selectedPages.has(pageNum)) {
                            selectedPages.add(pageNum);
                            orderedIndices.push(pageNum - 1);
                        }
                    }
                }

                if (orderedIndices.length === 0) {
                    throw new Error('No valid pages found in range.');
                }
                return orderedIndices;
            };

            const pageIndices = parsePageRanges(rangeStr, totalPages);

            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
            copiedPages.forEach(p => newPdf.addPage(p));

            const newPdfBytes = await newPdf.save();
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            resultDiv.innerHTML = `
                <p style="color:var(--accent-color); font-weight:600; margin-bottom:1rem;">✅ Extracted ${pageIndices.length} Page(s) Successfully!</p>
                <a href="${url}" download="split-document.pdf" class="primary-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download Split PDF</a>
            `;
            resultDiv.style.display = 'block';
        } catch (err) {
            console.error(err);
            showAlert(err.message || 'Error processing PDF split. Ensure the file is a valid PDF.', 'error');
        } finally {
            splitBtn.disabled = false;
            splitBtn.textContent = '✂️ Extract & Split PDF';
        }
    };
};
