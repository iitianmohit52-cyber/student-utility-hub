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
            <label for="imgPdfFiles">Select Images (JPG, PNG, WEBP):</label>
            <input type="file" id="imgPdfFiles" accept="image/*" multiple>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.3rem;">Hold Ctrl/Cmd to select multiple images.</p>

            <button id="convertImgToPdfBtn" style="margin-top:1.2rem;">📸 Convert Images to PDF</button>
            <div id="imgPdfResult" class="result-area" style="display:none; text-align:center;"></div>
        </div>
    `;

    const fileInput = container.querySelector('#imgPdfFiles');
    const convertBtn = container.querySelector('#convertImgToPdfBtn');
    const resultDiv = container.querySelector('#imgPdfResult');

    convertBtn.onclick = async () => {
        const files = Array.from(fileInput.files);
        if (files.length === 0) {
            showAlert('Please select at least one image file.', 'error');
            return;
        }

        try {
            convertBtn.disabled = true;
            convertBtn.textContent = 'Generating PDF...';
            hideAlert();

            const { PDFDocument } = await loadPdfLib();
            const pdfDoc = await PDFDocument.create();

            for (const file of files) {
                // Convert any image format to JPEG or PNG via HTML Canvas
                const imgUrl = URL.createObjectURL(file);
                const img = new Image();
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = imgUrl;
                });

                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth || img.width;
                canvas.height = img.naturalHeight || img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
                const jpegBytes = await fetch(jpegDataUrl).then(res => res.arrayBuffer());

                const imageEmbed = await pdfDoc.embedJpg(jpegBytes);
                const page = pdfDoc.addPage([imageEmbed.width, imageEmbed.height]);
                page.drawImage(imageEmbed, {
                    x: 0,
                    y: 0,
                    width: imageEmbed.width,
                    height: imageEmbed.height,
                });
                URL.revokeObjectURL(imgUrl);
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const downloadUrl = URL.createObjectURL(blob);

            resultDiv.innerHTML = `
                <p style="color:var(--accent-color); font-weight:600; margin-bottom:1rem;">✅ PDF Created from ${files.length} Image(s)!</p>
                <a href="${downloadUrl}" download="images-converted.pdf" class="primary-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download PDF Document</a>
            `;
            resultDiv.style.display = 'block';
        } catch (err) {
            console.error(err);
            showAlert('Error converting images to PDF. Please try again.', 'error');
        } finally {
            convertBtn.disabled = false;
            convertBtn.textContent = '📸 Convert Images to PDF';
        }
    };
};
