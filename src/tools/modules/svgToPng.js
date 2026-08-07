import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="svgFileInput">Upload SVG File OR Paste SVG Code:</label>
            <input type="file" id="svgFileInput" accept=".svg,image/svg+xml">
            <textarea id="svgCodeInput" rows="5" placeholder="<svg width='100' height='100'>...</svg>" style="margin-top:0.8rem;"></textarea>

            <button id="convertSvgBtn" style="margin-top:1.2rem;">⚡ Convert SVG to PNG</button>

            <div id="svgResult" class="result-area" style="display:none; text-align:center;">
                <canvas id="svgCanvas" style="display:none;"></canvas>
                <img id="svgPreview" style="max-width:100%; border-radius:8px; margin-bottom:1rem;" alt="Converted PNG">
                <br>
                <a id="downloadPngBtn" class="primary-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download PNG Image</a>
            </div>
        </div>
    `;

    const fileInput = container.querySelector('#svgFileInput');
    const codeInput = container.querySelector('#svgCodeInput');
    const convertBtn = container.querySelector('#convertSvgBtn');
    const resultDiv = container.querySelector('#svgResult');
    const canvas = container.querySelector('#svgCanvas');
    const previewImg = container.querySelector('#svgPreview');
    const downloadBtn = container.querySelector('#downloadPngBtn');

    fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => codeInput.value = e.target.result;
            reader.readAsText(file);
        }
    };

    convertBtn.onclick = () => {
        const svgText = codeInput.value.trim();
        if (!svgText) {
            showAlert('Please upload an SVG file or paste SVG code.', 'error');
            return;
        }
        hideAlert();

        const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = () => {
            canvas.width = img.naturalWidth || 800;
            canvas.height = img.naturalHeight || 600;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            const pngUrl = canvas.toDataURL('image/png');
            previewImg.src = pngUrl;
            downloadBtn.href = pngUrl;
            downloadBtn.download = 'converted-svg.png';
            resultDiv.style.display = 'block';
            URL.revokeObjectURL(url);
        };
        img.onerror = () => {
            showAlert('Invalid SVG markup. Could not render image.', 'error');
        };
        img.src = url;
    };
};
