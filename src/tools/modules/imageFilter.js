import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="filterFileInput">Select Image File:</label>
            <input type="file" id="filterFileInput" accept="image/*">

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1rem;">
                <div>
                    <label for="rangeBrightness">Brightness (<span id="valBrightness">100</span>%):</label>
                    <input type="range" id="rangeBrightness" min="0" max="200" value="100">
                </div>
                <div>
                    <label for="rangeContrast">Contrast (<span id="valContrast">100</span>%):</label>
                    <input type="range" id="rangeContrast" min="0" max="200" value="100">
                </div>
                <div>
                    <label for="rangeGrayscale">Grayscale (<span id="valGrayscale">0</span>%):</label>
                    <input type="range" id="rangeGrayscale" min="0" max="100" value="0">
                </div>
                <div>
                    <label for="rangeSepia">Sepia (<span id="valSepia">0</span>%):</label>
                    <input type="range" id="rangeSepia" min="0" max="100" value="0">
                </div>
                <div>
                    <label for="rangeBlur">Blur (<span id="valBlur">0</span>px):</label>
                    <input type="range" id="rangeBlur" min="0" max="20" value="0">
                </div>
                <div>
                    <label for="rangeInvert">Invert Colors (<span id="valInvert">0</span>%):</label>
                    <input type="range" id="rangeInvert" min="0" max="100" value="0">
                </div>
            </div>

            <button id="applyFilterBtn" style="margin-top:1.2rem;">🎨 Process Filter & Render</button>

            <div id="filterResult" class="result-area" style="display:none; text-align:center;">
                <canvas id="filterCanvas" style="max-width:100%; border-radius:8px; display:none;"></canvas>
                <img id="filterPreviewImg" style="max-width:100%; border-radius:8px; margin-bottom:1rem;" alt="Filtered Image">
                <br>
                <a id="downloadFilteredBtn" class="primary-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">📥 Download Filtered Image</a>
            </div>
        </div>
    `;

    const fileInput = container.querySelector('#filterFileInput');
    const bInput = container.querySelector('#rangeBrightness');
    const cInput = container.querySelector('#rangeContrast');
    const gInput = container.querySelector('#rangeGrayscale');
    const sInput = container.querySelector('#rangeSepia');
    const blurInput = container.querySelector('#rangeBlur');
    const invInput = container.querySelector('#rangeInvert');
    const applyBtn = container.querySelector('#applyFilterBtn');
    const resultDiv = container.querySelector('#filterResult');
    const canvas = container.querySelector('#filterCanvas');
    const previewImg = container.querySelector('#filterPreviewImg');
    const downloadBtn = container.querySelector('#downloadFilteredBtn');

    let loadedImage = null;

    fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (!file) return;
        const imgUrl = URL.createObjectURL(file);
        loadedImage = new Image();
        loadedImage.src = imgUrl;
    };

    const updateLabels = () => {
        container.querySelector('#valBrightness').textContent = bInput.value;
        container.querySelector('#valContrast').textContent = cInput.value;
        container.querySelector('#valGrayscale').textContent = gInput.value;
        container.querySelector('#valSepia').textContent = sInput.value;
        container.querySelector('#valBlur').textContent = blurInput.value;
        container.querySelector('#valInvert').textContent = invInput.value;
    };

    [bInput, cInput, gInput, sInput, blurInput, invInput].forEach(inp => inp.oninput = updateLabels);

    applyBtn.onclick = () => {
        if (!loadedImage) {
            showAlert('Please select an image file first.', 'error');
            return;
        }
        hideAlert();

        canvas.width = loadedImage.naturalWidth || loadedImage.width;
        canvas.height = loadedImage.naturalHeight || loadedImage.height;
        const ctx = canvas.getContext('2d');

        const filterString = `brightness(${bInput.value}%) contrast(${cInput.value}%) grayscale(${gInput.value}%) sepia(${sInput.value}%) blur(${blurInput.value}px) invert(${invInput.value}%)`;
        ctx.filter = filterString;
        ctx.drawImage(loadedImage, 0, 0);

        const dataUrl = canvas.toDataURL('image/png');
        previewImg.src = dataUrl;
        downloadBtn.href = dataUrl;
        downloadBtn.download = 'filtered-image.png';
        resultDiv.style.display = 'block';
    };
};
