import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';

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

export default createTool('pdfRemovePages', ({ container, showAlert, hideAlert }) => {
    let selectedFile = null;
    let pagesString = '';

    const fileInput = createInput({
        id: 'pdfFile',
        type: 'file',
        label: 'Select PDF File:',
        required: true,
        onChange: (val, e) => {
            selectedFile = e.target.files[0];
        }
    });
    fileInput.querySelector('input').accept = 'application/pdf';

    const pagesInput = createInput({
        id: 'pagesToRemove',
        type: 'text',
        label: 'Pages to Remove (e.g., 2, 4, 6-8):',
        placeholder: 'Enter page numbers or ranges',
        required: true,
        onChange: (val) => {
            pagesString = val;
        }
    });

    const removeBtn = createButton({
        id: 'removePagesBtn',
        text: 'Remove Pages & Save',
        icon: '🗑️',
        onClick: () => removePages()
    });

    const resultBox = createResultBox({
        id: 'pdfResult',
        title: 'New PDF Output'
    });

    const layout = createToolLayout({
        inputs: [fileInput, pagesInput],
        actions: [removeBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const parsePages = (str, totalPages) => {
        const pagesToDel = new Set();
        const parts = str.split(',');
        for (const part of parts) {
            const range = part.trim().split('-');
            if (range.length === 2) {
                const start = parseInt(range[0]);
                const end = parseInt(range[1]);
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
                        if (i >= 1 && i <= totalPages) pagesToDel.add(i - 1);
                    }
                }
            } else {
                const num = parseInt(part.trim());
                if (!isNaN(num) && num >= 1 && num <= totalPages) {
                    pagesToDel.add(num - 1);
                }
            }
        }
        return Array.from(pagesToDel).sort((a, b) => b - a); // Sort descending to delete pages from end to start
    };

    const removePages = async () => {
        if (!selectedFile) {
            showAlert('Please select a PDF file.', 'error');
            return;
        }
        if (!pagesString.trim()) {
            showAlert('Please enter page numbers to remove.', 'error');
            return;
        }

        try {
            removeBtn.disabled = true;
            removeBtn.textContent = 'Processing...';
            hideAlert();

            const { PDFDocument } = await loadPdfLib();
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            const totalPages = pdfDoc.getPageCount();
            const indicesToRemove = parsePages(pagesString, totalPages);

            if (indicesToRemove.length === 0) {
                showAlert('No valid page numbers found within the page range.', 'error');
                return;
            }
            if (indicesToRemove.length === totalPages) {
                showAlert('Cannot remove all pages from a PDF document.', 'error');
                return;
            }

            // Remove pages starting from highest index down to avoid shift issues
            indicesToRemove.forEach(index => {
                pdfDoc.removePage(index);
            });

            const processedPdfBytes = await pdfDoc.save();
            const blob = new Blob([processedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            resultBox.update(`
                <div style="text-align: center;">
                    <p style="color:var(--success-color); font-weight:600; margin-bottom:1rem;">✅ Pages Removed Successfully!</p>
                    <p style="margin-bottom:1.5rem; font-size:0.9rem; color:var(--text-secondary);">
                        Removed ${indicesToRemove.length} page(s). Document has now ${totalPages - indicesToRemove.length} pages.
                    </p>
                    <a href="${url}" download="edited_${selectedFile.name}" class="primary-button" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download PDF</a>
                </div>
            `);
        } catch (err) {
            console.error(err);
            showAlert('Failed to process PDF. Check if the file is secure.', 'error');
        } finally {
            removeBtn.disabled = false;
            removeBtn.textContent = 'Remove Pages & Save';
        }
    };
});
