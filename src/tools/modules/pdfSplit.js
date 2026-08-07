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

            // Parse ranges
            const pageIndices = [];
            const parts = rangeStr.split(',');
            for (const part of parts) {
                if (part.includes('-')) {
                    const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
                    if (!isNaN(start) && !isNaN(end)) {
                        for (let i = start; i <= end; i++) {
                            if (i >= 1 && i <= totalPages) pageIndices.push(i - 1);
                        }
                    }
                } else {
                    const pageNum = parseInt(part.trim(), 10);
                    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                        pageIndices.push(pageNum - 1);
                    }
                }
            }

            if (pageIndices.length === 0) {
                showAlert(`No valid pages found in range. The PDF has ${totalPages} pages.`, 'error');
                return;
            }

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
            showAlert('Error processing PDF split. Ensure the file is a valid PDF.', 'error');
        } finally {
            splitBtn.disabled = false;
            splitBtn.textContent = '✂️ Extract & Split PDF';
        }
    };
};
