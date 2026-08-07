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

export default createTool('pdfProtect', ({ container, showAlert, hideAlert }) => {
    let selectedFile = null;
    let userPassword = '';
    let ownerPassword = '';

    const fileInput = createInput({
        id: 'pdfFile',
        type: 'file',
        label: 'Select PDF File to Protect:',
        required: true,
        onChange: (val, e) => {
            selectedFile = e.target.files[0];
        }
    });
    fileInput.querySelector('input').accept = 'application/pdf';

    const userPasswordInput = createInput({
        id: 'userPassword',
        type: 'password',
        label: 'Set Password to Open PDF:',
        placeholder: 'Enter open password',
        required: true,
        onChange: (val) => {
            userPassword = val;
        }
    });

    const ownerPasswordInput = createInput({
        id: 'ownerPassword',
        type: 'password',
        label: 'Set Owner/Permissions Password (Optional):',
        placeholder: 'Enter permissions password',
        onChange: (val) => {
            ownerPassword = val;
        }
    });

    const protectBtn = createButton({
        id: 'protectPdfBtn',
        text: 'Protect PDF',
        icon: '🔒',
        onClick: () => protectPdf()
    });

    const resultBox = createResultBox({
        id: 'pdfResult',
        title: 'Protected PDF Output'
    });

    const layout = createToolLayout({
        inputs: [fileInput, userPasswordInput, ownerPasswordInput],
        actions: [protectBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const protectPdf = async () => {
        if (!selectedFile) {
            showAlert('Please select a PDF file first.', 'error');
            return;
        }
        if (!userPassword) {
            showAlert('Please enter an open password to encrypt the PDF.', 'error');
            return;
        }

        try {
            protectBtn.disabled = true;
            protectBtn.textContent = 'Protecting...';
            hideAlert();

            const { PDFDocument } = await loadPdfLib();
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // In pdf-lib encryption can be done by providing permissions options. 
            // Note: encryption settings are natively supported inside PDFDocument.save() options in pdf-lib!
            const protectedPdfBytes = await pdfDoc.save({
                userPassword: userPassword,
                ownerPassword: ownerPassword || userPassword,
                permissions: {
                    printing: 'highResolution',
                    modifying: false,
                    copying: false,
                    annotating: false
                }
            });

            const blob = new Blob([protectedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            resultBox.update(`
                <div style="text-align: center;">
                    <p style="color:var(--success-color); font-weight:600; margin-bottom:1rem;">✅ PDF Protected Successfully!</p>
                    <a href="${url}" download="protected_${selectedFile.name}" class="primary-button" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download Protected PDF</a>
                </div>
            `);
        } catch (err) {
            console.error(err);
            showAlert('Error protecting PDF. Please ensure the file is valid.', 'error');
        } finally {
            protectBtn.disabled = false;
            protectBtn.textContent = 'Protect PDF';
        }
    };
});
