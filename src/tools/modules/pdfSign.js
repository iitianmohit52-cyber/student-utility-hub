import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox, createSelect } from '../../components/ui/index.js';

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

export default createTool('pdfSign', ({ container, showAlert, hideAlert }) => {
    let selectedFile = null;
    let pageNum = 1;
    let signatureCanvas = null;
    let ctx = null;
    let isDrawing = false;

    // Elements
    const fileInput = createInput({
        id: 'pdfFile',
        type: 'file',
        label: 'Select PDF File to Sign:',
        required: true,
        onChange: (val, e) => {
            selectedFile = e.target.files[0];
        }
    });
    fileInput.querySelector('input').accept = 'application/pdf';

    const pageInput = createInput({
        id: 'pageNum',
        type: 'number',
        label: 'Page to place signature (1-indexed):',
        value: '1',
        min: 1,
        onChange: (val) => {
            pageNum = parseInt(val) || 1;
        }
    });

    // Signature Pad Container
    const sigPadWrapper = document.createElement('div');
    sigPadWrapper.className = 'form-group';
    sigPadWrapper.style.marginBottom = '1.5rem';
    
    const sigLabel = document.createElement('label');
    sigLabel.textContent = 'Draw Your Signature below:';
    sigLabel.style.display = 'block';
    sigLabel.style.marginBottom = '0.5rem';
    sigLabel.style.fontWeight = '500';
    sigPadWrapper.appendChild(sigLabel);

    signatureCanvas = document.createElement('canvas');
    signatureCanvas.width = 400;
    signatureCanvas.height = 150;
    signatureCanvas.style.border = '1px solid var(--tool-card-border)';
    signatureCanvas.style.borderRadius = 'var(--radius-md)';
    signatureCanvas.style.background = 'white';
    signatureCanvas.style.display = 'block';
    signatureCanvas.style.cursor = 'crosshair';
    sigPadWrapper.appendChild(signatureCanvas);

    ctx = signatureCanvas.getContext('2d');
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Canvas Drawing Logic
    const getCoordinates = (e) => {
        const rect = signatureCanvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const startDraw = (e) => {
        e.preventDefault();
        isDrawing = true;
        const coords = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const coords = getCoordinates(e);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
    };

    const stopDraw = () => {
        isDrawing = false;
    };

    signatureCanvas.addEventListener('mousedown', startDraw);
    signatureCanvas.addEventListener('mousemove', draw);
    signatureCanvas.addEventListener('mouseup', stopDraw);
    signatureCanvas.addEventListener('mouseleave', stopDraw);

    signatureCanvas.addEventListener('touchstart', startDraw);
    signatureCanvas.addEventListener('touchmove', draw);
    signatureCanvas.addEventListener('touchend', stopDraw);

    const clearCanvasBtn = createButton({
        text: 'Clear Signature',
        variant: 'secondary',
        onClick: () => {
            ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        }
    });

    const signBtn = createButton({
        id: 'signPdfBtn',
        text: 'Sign & Export PDF',
        icon: '✍️',
        onClick: () => signPdf()
    });

    const resultBox = createResultBox({
        id: 'pdfResult',
        title: 'Signed PDF Output'
    });

    // Custom layout assembly to fit signature elements
    const inputsArea = document.createElement('div');
    inputsArea.appendChild(fileInput);
    inputsArea.appendChild(pageInput);
    inputsArea.appendChild(sigPadWrapper);
    inputsArea.appendChild(clearCanvasBtn);

    const layout = createToolLayout({
        inputs: [inputsArea],
        actions: [signBtn],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const signPdf = async () => {
        if (!selectedFile) {
            showAlert('Please select a PDF file first.', 'error');
            return;
        }

        try {
            signBtn.disabled = true;
            signBtn.textContent = 'Signing...';
            hideAlert();

            const { PDFDocument } = await loadPdfLib();
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            const totalPages = pdfDoc.getPageCount();
            if (pageNum < 1 || pageNum > totalPages) {
                showAlert(`Invalid page number. Document has only ${totalPages} pages.`, 'error');
                return;
            }

            // Convert canvas signature to PNG DataURL
            const signatureDataUrl = signatureCanvas.toDataURL('image/png');
            
            // Embed signature image in PDF
            const signatureImage = await pdfDoc.embedPng(signatureDataUrl);
            const page = pdfDoc.getPage(pageNum - 1);
            
            // Position it at the bottom right corner of page
            const { width, height } = page.getSize();
            const sigWidth = 150;
            const sigHeight = 56;
            
            page.drawImage(signatureImage, {
                x: width - sigWidth - 50,
                y: 50,
                width: sigWidth,
                height: sigHeight
            });

            const signedPdfBytes = await pdfDoc.save();
            const blob = new Blob([signedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            resultBox.update(`
                <div style="text-align: center;">
                    <p style="color:var(--success-color); font-weight:600; margin-bottom:1rem;">✅ PDF Signed Successfully!</p>
                    <a href="${url}" download="signed_${selectedFile.name}" class="primary-button" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download Signed PDF</a>
                </div>
            `);
        } catch (err) {
            console.error(err);
            showAlert('Error signing PDF. Ensure the file is not encrypted.', 'error');
        } finally {
            signBtn.disabled = false;
            signBtn.textContent = 'Sign & Export PDF';
        }
    };
});
