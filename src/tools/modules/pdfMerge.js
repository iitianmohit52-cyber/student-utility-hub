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
            <label for="pdfFiles">Select PDF Files to Merge:</label>
            <input type="file" id="pdfFiles" accept="application/pdf" multiple>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.3rem;">Hold Ctrl/Cmd to select multiple PDFs.</p>
            
            <button id="mergePdfBtn" style="margin-top:1.2rem;">⚡ Merge PDFs</button>
            <div id="pdfResult" class="result-area" style="display:none; text-align:center;"></div>
        </div>
    `;

    const fileInput = container.querySelector('#pdfFiles');
    const mergeBtn = container.querySelector('#mergePdfBtn');
    const resultDiv = container.querySelector('#pdfResult');

    mergeBtn.onclick = async () => {
        const files = Array.from(fileInput.files);
        if (files.length < 2) {
            showAlert('Please select at least 2 PDF files to merge.', 'error');
            return;
        }

        try {
            mergeBtn.disabled = true;
            mergeBtn.textContent = 'Merging PDFs...';
            hideAlert();

            const { PDFDocument } = await loadPdfLib();
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            resultDiv.innerHTML = `
                <p style="color:var(--accent-color); font-weight:600; margin-bottom:1rem;">✅ PDFs Merged Successfully!</p>
                <a href="${url}" download="merged-document.pdf" class="primary-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download Merged PDF</a>
            `;
            resultDiv.style.display = 'block';
        } catch (err) {
            console.error(err);
            showAlert('Error merging PDFs. Please check if the files are valid PDF documents.', 'error');
        } finally {
            mergeBtn.disabled = false;
            mergeBtn.textContent = '⚡ Merge PDFs';
        }
    };
};
