import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="resizeFileInput">Select Image File:</label>
            <input type="file" id="resizeFileInput" accept="image/*">

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1rem;">
                <div>
                    <label for="resizeWidth">Width (px):</label>
                    <input type="number" id="resizeWidth" placeholder="800">
                </div>
                <div>
                    <label for="resizeHeight">Height (px):</label>
                    <input type="number" id="resizeHeight" placeholder="600">
                </div>
            </div>

            <label style="margin-top:0.8rem; font-size:0.9rem;">
                <input type="checkbox" id="lockAspect" checked> Lock Aspect Ratio
            </label>

            <button id="resizeImgBtn" style="margin-top:1.2rem;">📐 Resize Image</button>

            <div id="resizeResult" class="result-area" style="display:none; text-align:center;">
                <canvas id="resizeCanvas" style="max-width:100%; border-radius:8px; display:none;"></canvas>
                <img id="resizedPreview" style="max-width:100%; border-radius:8px; margin-bottom:1rem;" alt="Resized Preview">
                <br>
                <a id="downloadResizedBtn" class="primary-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download Resized Image</a>
            </div>
        </div>
    `;

    const fileInput = container.querySelector('#resizeFileInput');
    const widthInput = container.querySelector('#resizeWidth');
    const heightInput = container.querySelector('#resizeHeight');
    const lockAspect = container.querySelector('#lockAspect');
    const resizeBtn = container.querySelector('#resizeImgBtn');
    const resultDiv = container.querySelector('#resizeResult');
    const canvas = container.querySelector('#resizeCanvas');
    const previewImg = container.querySelector('#resizedPreview');
    const downloadBtn = container.querySelector('#downloadResizedBtn');

    let originalWidth = 0;
    let originalHeight = 0;
    let loadedImage = null;

    fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (!file) return;

        const imgUrl = URL.createObjectURL(file);
        loadedImage = new Image();
        loadedImage.onload = () => {
            originalWidth = loadedImage.naturalWidth;
            originalHeight = loadedImage.naturalHeight;
            widthInput.value = originalWidth;
            heightInput.value = originalHeight;
        };
        loadedImage.src = imgUrl;
    };

    widthInput.oninput = () => {
        if (lockAspect.checked && originalWidth > 0) {
            const w = parseFloat(widthInput.value) || 0;
            heightInput.value = Math.round(w * (originalHeight / originalWidth));
        }
    };

    heightInput.oninput = () => {
        if (lockAspect.checked && originalHeight > 0) {
            const h = parseFloat(heightInput.value) || 0;
            widthInput.value = Math.round(h * (originalWidth / originalHeight));
        }
    };

    resizeBtn.onclick = () => {
        if (!loadedImage) {
            showAlert('Please select an image file first.', 'error');
            return;
        }

        const targetW = parseInt(widthInput.value, 10);
        const targetH = parseInt(heightInput.value, 10);

        if (!targetW || !targetH || targetW <= 0 || targetH <= 0) {
            showAlert('Please enter valid width and height dimensions.', 'error');
            return;
        }
        hideAlert();

        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(loadedImage, 0, 0, targetW, targetH);

        const dataUrl = canvas.toDataURL('image/png');
        previewImg.src = dataUrl;
        downloadBtn.href = dataUrl;
        downloadBtn.download = `resized-${targetW}x${targetH}.png`;
        resultDiv.style.display = 'block';
    };
};
