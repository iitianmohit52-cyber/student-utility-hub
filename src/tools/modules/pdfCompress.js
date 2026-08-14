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

            // Optimize object streams in pdf-lib
            const compressedPdfBytes = await pdfDoc.save({
                useObjectStreams: true,
                objectsPerUncompressedStream: 50
            });

            const origSizeBytes = selectedFile.size;
            const origSizeKb = (origSizeBytes / 1024).toFixed(1);
            const compSizeBytes = compressedPdfBytes.length;
            const compSizeKb = (compSizeBytes / 1024).toFixed(1);

            const isReduced = compSizeBytes < origSizeBytes;
            const finalBytes = isReduced ? compressedPdfBytes : arrayBuffer;
            const blob = new Blob([finalBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const safeFileName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const downloadName = isReduced ? `compressed_${safeFileName}` : selectedFile.name;

            if (isReduced) {
                const savings = ((1 - compSizeBytes / origSizeBytes) * 100).toFixed(1);
                resultBox.update(`
                    <div style="text-align: center;">
                        <p style="color:var(--success-color); font-weight:700; font-size:1.1rem; margin-bottom:0.5rem;">
                            🎉 PDF Compressed Successfully! Reduced by ${savings}%
                        </p>
                        <p style="margin-bottom:1.5rem; font-size:0.9rem; color:var(--text-secondary);">
                            Original: <strong>${origSizeKb} KB</strong> ➔ Compressed: <strong>${compSizeKb} KB</strong>
                        </p>
                        <a href="${url}" download="${downloadName}" class="primary-button" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">
                            📥 Download Compressed PDF
                        </a>
                    </div>
                `);
                showAlert(`PDF compressed successfully! Saved ${((origSizeBytes - compSizeBytes) / 1024).toFixed(1)} KB (${savings}%).`, 'success');
            } else {
                resultBox.update(`
                    <div style="text-align: center;">
                        <p style="color:var(--primary-color); font-weight:600; font-size:1.05rem; margin-bottom:0.5rem;">
                            ⚡ PDF is Already Optimally Compressed
                        </p>
                        <p style="margin-bottom:1.5rem; font-size:0.85rem; color:var(--text-secondary);">
                            The original PDF (${origSizeKb} KB) is already as compact as possible. Preserving the original file ensures zero degradation.
                        </p>
                        <a href="${url}" download="${downloadName}" class="secondary-button" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">
                            📥 Download Original PDF (${origSizeKb} KB)
                        </a>
                    </div>
                `);
                showAlert('PDF is already optimal. Preserved original file.', 'info');
            }
        } catch (err) {
            console.error(err);
            showAlert('Error compressing PDF. Make sure it is a valid, unencrypted PDF.', 'error');
        } finally {
            compressBtn.disabled = false;
            compressBtn.textContent = 'Compress PDF';
        }
    };
});
