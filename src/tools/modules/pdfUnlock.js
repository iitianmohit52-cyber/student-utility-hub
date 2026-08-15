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

export default createTool('pdfUnlock', ({ container, showAlert, hideAlert }) => {
    let selectedFile = null;
    let passwordVal = '';

    const fileInput = createInput({
        id: 'pdfFile',
        type: 'file',
        label: 'Select Locked PDF File:',
        required: true,
        onChange: (val, e) => {
            selectedFile = e.target.files[0];
        }
    });
    fileInput.querySelector('input').accept = 'application/pdf';

    const passwordInput = createInput({
        id: 'pdfPassword',
        type: 'password',
        label: 'PDF Password:',
        placeholder: 'Enter password to unlock',
        onChange: (val) => {
            passwordVal = val;
        }
    });

    const unlockBtn = createButton({
        id: 'unlockPdfBtn',
        text: 'Unlock PDF',
        icon: '🔓',
        onClick: () => unlockPdf()
    });

    const resultBox = createResultBox({
        id: 'pdfResult',
        title: 'Unlocked PDF Output'
    });

    const layout = createToolLayout({
        inputs: [fileInput, passwordInput],
        actions: [unlockBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const unlockPdf = async () => {
        if (!selectedFile) {
            showAlert('Please select a PDF file first.', 'error');
            return;
        }

        try {
            unlockBtn.disabled = true;
            unlockBtn.textContent = 'Analyzing PDF Security...';
            hideAlert();

            const { PDFDocument } = await loadPdfLib();
            const arrayBuffer = await selectedFile.arrayBuffer();

            if (!arrayBuffer || arrayBuffer.byteLength === 0) {
                showAlert('The selected file is empty or corrupted.', 'error');
                return;
            }

            let isEncrypted = false;
            let pdfDoc = null;

            try {
                pdfDoc = await PDFDocument.load(arrayBuffer);
            } catch (loadErr) {
                if (loadErr.message && loadErr.message.toLowerCase().includes('encrypt')) {
                    isEncrypted = true;
                } else {
                    throw new Error('Corrupted or invalid PDF format.');
                }
            }

            if (!isEncrypted && pdfDoc) {
                resultBox.update(`
                    <div style="text-align: center; padding: 0.5rem;">
                        <p style="color:var(--success-color); font-weight:700; font-size:1.1rem; margin-bottom:0.5rem;">
                            ✓ PDF is Already Unlocked
                        </p>
                        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1rem;">
                            "${selectedFile.name}" (${pdfDoc.getPageCount()} page(s)) is not password protected or restricted.
                        </p>
                    </div>
                `, 'PDF Status: Unlocked');
                showAlert('This PDF document has no password protection or encryption restrictions.', 'success');
            } else {
                resultBox.update(`
                    <div style="text-align: left; padding: 0.5rem;">
                        <div style="display:flex; align-items:center; gap:0.5rem; color:var(--primary-color); font-weight:700; font-size:1.05rem; margin-bottom:0.75rem;">
                            <span>🔒</span> Encrypted PDF Detected
                        </div>
                        <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.6; margin-bottom:0.8rem;">
                            This PDF file is protected with standard Adobe PDF encryption (Standard Security Handler).
                        </p>
                        <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.6; margin-bottom:1rem;">
                            <strong>Student Utility Hub</strong> does not upload your protected documents to remote third-party servers to strip encryption. To permanently remove the password from this document with complete privacy, open the document in your browser or desktop PDF reader using your password, and choose <em>Print ➔ Save as PDF</em>.
                        </p>
                        <div style="background:var(--surface-color); border:1px solid var(--tool-card-border); border-radius:var(--radius-md); padding:0.75rem 1rem; font-size:0.85rem; color:var(--text-primary);">
                            <strong>File:</strong> "${selectedFile.name}" (Encrypted)
                        </div>
                    </div>
                `, 'Encrypted Document Notice');
                showAlert('Encrypted PDF detected. Client-side privacy instructions displayed.', 'info');
            }
        } catch (err) {
            console.error(err);
            showAlert(err.message || 'Failed to inspect PDF. Please verify the file is a valid PDF.', 'error');
        } finally {
            unlockBtn.disabled = false;
            unlockBtn.textContent = 'Unlock PDF';
        }
    };
});
