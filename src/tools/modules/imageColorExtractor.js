import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="colorExtFileInput">Select Image File:</label>
            <input type="file" id="colorExtFileInput" accept="image/*">

            <button id="extractColorsBtn" style="margin-top:1.2rem;">🖌️ Extract Color Palette</button>

            <div id="paletteResult" class="result-area" style="display:none; text-align:center;">
                <p style="font-weight:600; margin-bottom:1rem; color:var(--text-primary);">Dominant Color Palette:</p>
                <div id="paletteGrid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(100px, 1fr)); gap:0.8rem;"></div>
            </div>
        </div>
    `;

    const fileInput = container.querySelector('#colorExtFileInput');
    const extractBtn = container.querySelector('#extractColorsBtn');
    const resultDiv = container.querySelector('#paletteResult');
    const paletteGrid = container.querySelector('#paletteGrid');

    extractBtn.onclick = () => {
        const file = fileInput.files[0];
        if (!file) {
            showAlert('Please select an image file.', 'error');
            return;
        }
        hideAlert();

        const imgUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 100, 100);

            const imgData = ctx.getImageData(0, 0, 100, 100).data;
            const colorCounts = {};

            for (let i = 0; i < imgData.length; i += 16) {
                const r = imgData[i];
                const g = imgData[i + 1];
                const b = imgData[i + 2];
                const a = imgData[i + 3];
                if (a < 128) continue; // skip transparent

                // Quantize
                const qr = Math.round(r / 32) * 32;
                const qg = Math.round(g / 32) * 32;
                const qb = Math.round(b / 32) * 32;
                const hex = `#${((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1)}`;
                colorCounts[hex] = (colorCounts[hex] || 0) + 1;
            }

            const sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]).slice(0, 6);

            paletteGrid.innerHTML = '';
            sortedColors.forEach(hex => {
                const item = document.createElement('div');
                item.style.cssText = 'background:var(--surface-color); padding:0.6rem; border-radius:8px; border:1px solid var(--tool-card-border); cursor:pointer;';
                item.innerHTML = `
                    <div style="background:${hex}; height:50px; border-radius:6px; margin-bottom:0.4rem; border:1px solid rgba(255,255,255,0.1);"></div>
                    <span style="font-family:monospace; font-size:0.85rem; font-weight:600;">${hex}</span>
                `;
                item.onclick = () => {
                    navigator.clipboard.writeText(hex);
                    showAlert(`Copied ${hex} to clipboard!`, 'info');
                };
                paletteGrid.appendChild(item);
            });

            resultDiv.style.display = 'block';
            URL.revokeObjectURL(imgUrl);
        };
        img.src = imgUrl;
    };
};
