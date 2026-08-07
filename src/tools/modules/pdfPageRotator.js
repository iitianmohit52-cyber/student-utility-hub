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
            <label for="rotatePdfFile">Select PDF File:</label>
            <input type="file" id="rotatePdfFile" accept="application/pdf">
            
            <label for="rotationAngle" style="margin-top:1rem;">Rotation Angle:</label>
            <select id="rotationAngle">
                <option value="90">90° Clockwise</option>
                <option value="180">180° Turn Upside Down</option>
                <option value="270">270° Counter-Clockwise</option>
            </select>

            <button id="rotatePdfBtn" style="margin-top:1.2rem;">🔄 Rotate Pages & Save</button>
            <div id="rotateResult" class="result-area" style="display:none; text-align:center;"></div>
        </div>
    `;

    const fileInput = container.querySelector('#rotatePdfFile');
    const angleSelect = container.querySelector('#rotationAngle');
    const rotateBtn = container.querySelector('#rotatePdfBtn');
    const resultDiv = container.querySelector('#rotateResult');

    rotateBtn.onclick = async () => {
        const file = fileInput.files[0];
        const angle = parseInt(angleSelect.value, 10);

        if (!file) {
            showAlert('Please select a PDF file.', 'error');
            return;
        }

        try {
            rotateBtn.disabled = true;
            rotateBtn.textContent = 'Rotating PDF...';
            hideAlert();

            const { PDFDocument, degrees } = await loadPdfLib();
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            const pages = pdfDoc.getPages();
            pages.forEach((page) => {
                const currentRotation = page.getRotation().angle;
                page.setRotation(degrees((currentRotation + angle) % 360));
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const downloadUrl = URL.createObjectURL(blob);

            resultDiv.innerHTML = `
                <p style="color:var(--accent-color); font-weight:600; margin-bottom:1rem;">✅ Rotated ${pages.length} Page(s) by ${angle}°!</p>
                <a href="${downloadUrl}" download="rotated-document.pdf" class="primary-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download Rotated PDF</a>
            `;
            resultDiv.style.display = 'block';
        } catch (err) {
            console.error(err);
            showAlert('Failed to rotate PDF. Please check if the file is valid.', 'error');
        } finally {
            rotateBtn.disabled = false;
            rotateBtn.textContent = '🔄 Rotate Pages & Save';
        }
    };
};
