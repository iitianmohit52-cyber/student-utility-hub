import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';
import { downloadFile } from '../../utils/fileHandling.js';

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

export default createTool('pdfCompress', ({ container, showAlert, hideAlert }) => {
    let selectedFile = null;

    const fileInput = createInput({
        id: 'pdfFile',
        type: 'file',
        label: 'Select PDF File to Compress:',
        required: true,
        onChange: (val, e) => {
            selectedFile = e.target.files[0];
        }
    });
    fileInput.querySelector('input').accept = 'application/pdf';

    const compressBtn = createButton({
        id: 'compressPdfBtn',
        text: 'Compress PDF',
        icon: '🗜️',
        onClick: () => compressPdf()
    });

    const resultBox = createResultBox({
        id: 'pdfResult',
        title: 'Compressed PDF Output'
    });

    const layout = createToolLayout({
        inputs: [fileInput],
        actions: [compressBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const compressPdf = async () => {
        if (!selectedFile) {
            showAlert('Please select a PDF file first.', 'error');
            return;
        }

        try {
            compressBtn.disabled = true;
            compressBtn.textContent = 'Compressing...';
            hideAlert();

            const { PDFDocument } = await loadPdfLib();
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Save with maximum compression settings available in pdf-lib
            const compressedPdfBytes = await pdfDoc.save({
                useObjectStreams: true,
                objectsPerUncompressedStream: 50
            });

            const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            const origSize = (selectedFile.size / 1024).toFixed(1);
            const compSize = (blob.size / 1024).toFixed(1);
            const savings = ((1 - blob.size / selectedFile.size) * 100).toFixed(0);

            resultBox.update(`
                <div style="text-align: center;">
                    <p style="color:var(--success-color); font-weight:600; margin-bottom:1rem;">✅ PDF Compressed Successfully!</p>
                    <p style="margin-bottom:1.5rem; font-size:0.9rem; color:var(--text-secondary);">
                        Original Size: <strong>${origSize} KB</strong> | Compressed Size: <strong>${compSize} KB</strong> (${savings}% smaller)
                    </p>
                    <a href="${url}" download="compressed_${selectedFile.name}" class="primary-button" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download Compressed PDF</a>
                </div>
            `);
        } catch (err) {
            console.error(err);
            showAlert('Error compressing PDF. Make sure it is a valid, unencrypted PDF.', 'error');
        } finally {
            compressBtn.disabled = false;
            compressBtn.textContent = 'Compress PDF';
        }
    };
});
