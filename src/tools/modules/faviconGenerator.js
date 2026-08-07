import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="favFileInput">Select Logo / Image File:</label>
            <input type="file" id="favFileInput" accept="image/*">

            <button id="genFaviconBtn" style="margin-top:1.2rem;">🔖 Generate Favicon Pack</button>

            <div id="favResult" class="result-area" style="display:none; text-align:center;">
                <p style="font-weight:600; margin-bottom:1rem; color:var(--text-primary);">Generated Favicon Sizes:</p>
                <div id="favGrid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:1rem;"></div>
            </div>
        </div>
    `;

    const fileInput = container.querySelector('#favFileInput');
    const genBtn = container.querySelector('#genFaviconBtn');
    const resultDiv = container.querySelector('#favResult');
    const grid = container.querySelector('#favGrid');

    genBtn.onclick = () => {
        const file = fileInput.files[0];
        if (!file) {
            showAlert('Please select an image file.', 'error');
            return;
        }
        hideAlert();

        const sizes = [16, 32, 48, 180];
        const imgUrl = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            grid.innerHTML = '';
            sizes.forEach(size => {
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, size, size);

                const dataUrl = canvas.toDataURL('image/png');
                const card = document.createElement('div');
                card.style.cssText = 'background:var(--surface-color); padding:0.8rem; border-radius:8px; border:1px solid var(--tool-card-border);';
                card.innerHTML = `
                    <div style="height:60px; display:flex; align-items:center; justify-content:center; margin-bottom:0.5rem;">
                        <img src="${dataUrl}" style="max-width:100%; max-height:100%; border:1px solid var(--tool-card-border);" alt="${size}x${size}">
                    </div>
                    <span style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.4rem;">${size} x ${size} px</span>
                    <a href="${dataUrl}" download="favicon-${size}x${size}.png" class="tool-button" style="padding:0.3rem 0.6rem; font-size:0.75rem; text-decoration:none;">📥 Download</a>
                `;
                grid.appendChild(card);
            });

            resultDiv.style.display = 'block';
            URL.revokeObjectURL(imgUrl);
        };
        img.src = imgUrl;
    };
};
