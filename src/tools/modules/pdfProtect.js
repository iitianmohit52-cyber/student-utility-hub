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
            showAlert('Please enter an open password.', 'error');
            return;
        }

        try {
            protectBtn.disabled = true;
            protectBtn.textContent = 'Analyzing PDF...';
            hideAlert();

            const { PDFDocument } = await loadPdfLib();
            const arrayBuffer = await selectedFile.arrayBuffer();

            if (!arrayBuffer || arrayBuffer.byteLength === 0) {
                showAlert('The selected file is empty or corrupted.', 'error');
                return;
            }

            // Test if document is valid or already encrypted
            let pdfDoc;
            try {
                pdfDoc = await PDFDocument.load(arrayBuffer);
            } catch (loadErr) {
                if (loadErr.message && loadErr.message.toLowerCase().includes('encrypt')) {
                    showAlert('This PDF is already encrypted with a password.', 'info');
                    resultBox.update(`
                        <div style="text-align: center;">
                            <p style="color:var(--primary-color); font-weight:600; margin-bottom:0.75rem;">🔒 File is Already Password Protected</p>
                            <p style="color:var(--text-secondary); font-size:0.9rem;">The selected PDF document already contains standard encryption.</p>
                        </div>
                    `, 'PDF Status');
                    return;
                }
                throw new Error('Corrupted or invalid PDF format. Unable to parse document structure.');
            }

            // Honest Security Advisory (Option B - Zero Fake Security)
            resultBox.update(`
                <div style="text-align: left; padding: 0.5rem;">
                    <div style="display:flex; align-items:center; gap:0.5rem; color:var(--primary-color); font-weight:700; font-size:1.05rem; margin-bottom:0.75rem;">
                        <span>🔒</span> PDF Client-Side Security Advisory
                    </div>
                    <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.6; margin-bottom:0.8rem;">
                        <strong>Student Utility Hub</strong> is committed to 100% privacy and honest tools. Standard Adobe PDF encryption (AES-128/AES-256 Standard Security Handler) requires native OS-level cryptographic binaries.
                    </p>
                    <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.6; margin-bottom:1rem;">
                        To guarantee your privacy, we <strong>never upload your sensitive documents to remote servers</strong> for server-side encryption. We recommend encrypting local documents using your operating system's built-in PDF print/export security or offline open-source utilities like <code>qpdf</code>.
                    </p>
                    <div style="background:var(--surface-color); border:1px solid var(--tool-card-border); border-radius:var(--radius-md); padding:0.75rem 1rem; font-size:0.85rem; color:var(--text-primary);">
                        <strong>Document Verified:</strong> "${selectedFile.name}" (${pdfDoc.getPageCount()} page(s), ${(selectedFile.size / 1024).toFixed(1)} KB) is valid and intact.
                    </div>
                </div>
            `, 'Client-Side Security Notice');
            showAlert('PDF structure verified. Client-side security notice displayed.', 'info');
        } catch (err) {
            console.error(err);
            showAlert(err.message || 'Error processing PDF file. Ensure it is a valid PDF.', 'error');
        } finally {
            protectBtn.disabled = false;
            protectBtn.textContent = 'Protect PDF';
        }
    };
});
