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
            unlockBtn.textContent = 'Unlocking...';
            hideAlert();

            const { PDFDocument } = await loadPdfLib();
            const arrayBuffer = await selectedFile.arrayBuffer();
            
            // Attempt to load the PDF with the user-provided password
            const pdfDoc = await PDFDocument.load(arrayBuffer, {
                password: passwordVal
            });

            // Save the document without encryption
            const unlockedPdfBytes = await pdfDoc.save();

            const blob = new Blob([unlockedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            resultBox.update(`
                <div style="text-align: center;">
                    <p style="color:var(--success-color); font-weight:600; margin-bottom:1rem;">✅ PDF Unlocked Successfully!</p>
                    <a href="${url}" download="unlocked_${selectedFile.name}" class="primary-button" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download Unlocked PDF</a>
                </div>
            `);
        } catch (err) {
            console.error(err);
            showAlert('Failed to unlock PDF. Please verify your password and try again.', 'error');
        } finally {
            unlockBtn.disabled = false;
            unlockBtn.textContent = 'Unlock PDF';
        }
    };
});
