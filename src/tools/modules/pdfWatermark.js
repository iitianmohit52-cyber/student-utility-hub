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
            <label for="watermarkPdfFile">Select PDF File:</label>
            <input type="file" id="watermarkPdfFile" accept="application/pdf">
            
            <label for="watermarkText" style="margin-top:1rem;">Watermark Text:</label>
            <input type="text" id="watermarkText" placeholder="e.g. CONFIDENTIAL / SAMPLE" value="CONFIDENTIAL">
            
            <button id="addWatermarkBtn" style="margin-top:1.2rem;">💧 Apply Watermark</button>
            <div id="watermarkResult" class="result-area" style="display:none; text-align:center;"></div>
        </div>
    `;

    const fileInput = container.querySelector('#watermarkPdfFile');
    const textInput = container.querySelector('#watermarkText');
    const applyBtn = container.querySelector('#addWatermarkBtn');
    const resultDiv = container.querySelector('#watermarkResult');

    applyBtn.onclick = async () => {
        const file = fileInput.files[0];
        const text = textInput.value.trim();

        if (!file) {
            showAlert('Please select a PDF file.', 'error');
            return;
        }
        if (!text) {
            showAlert('Please enter watermark text.', 'error');
            return;
        }

        try {
            applyBtn.disabled = true;
            applyBtn.textContent = 'Applying Watermark...';
            hideAlert();

            const { PDFDocument, rgb, degrees, StandardFonts } = await loadPdfLib();
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            const pages = pdfDoc.getPages();
            for (const page of pages) {
                const { width, height } = page.getSize();
                const fontSize = Math.min(width, height) / 8;
                page.drawText(text, {
                    x: width / 4,
                    y: height / 2,
                    size: fontSize,
                    font: font,
                    color: rgb(0.75, 0.75, 0.75),
                    opacity: 0.35,
                    rotate: degrees(45),
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const downloadUrl = URL.createObjectURL(blob);

            resultDiv.innerHTML = `
                <p style="color:var(--accent-color); font-weight:600; margin-bottom:1rem;">✅ Watermark Applied to ${pages.length} Page(s)!</p>
                <a href="${downloadUrl}" download="watermarked-document.pdf" class="primary-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download Watermarked PDF</a>
            `;
            resultDiv.style.display = 'block';
        } catch (err) {
            console.error(err);
            showAlert('Error adding watermark to PDF. Ensure file is valid.', 'error');
        } finally {
            applyBtn.disabled = false;
            applyBtn.textContent = '💧 Apply Watermark';
        }
    };
};
