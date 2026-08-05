import { showAlert, hideAlert } from '../../utils/alerts.js';
import { isSafeFile } from '../../utils/validate.js';
import { escapeHTML } from '../../utils/sanitize.js';

export default (container) => {
    container.innerHTML = `
        <input type="file" id="imgCompFile" accept="image/jpeg,image/png">
        <label for="imgCompQuality">Quality (0.1 - 1.0 for JPEG, ignored for PNG):</label>
        <input type="number" id="imgCompQuality" value="0.7" min="0.1" max="1.0" step="0.1">
        <button id="imgCompButton">Compress & Download</button>
        <p>PNG compression is lossless and quality setting is ignored.</p>
        <div id="compressionInfo" class="result-area" style="display:none;"></div>
        <img id="imagePreviewComp" src="#" alt="Preview" style="display:none; max-width: 100%; margin-top: 10px;">
    `;
    const fileInput = container.querySelector('#imgCompFile');
    const qualityInput = container.querySelector('#imgCompQuality');
    const compressButton = container.querySelector('#imgCompButton');
    const compressionInfo = container.querySelector('#compressionInfo');
    const preview = container.querySelector('#imagePreviewComp');
    let originalFileName = 'compressed_image';

    fileInput.onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!isSafeFile(file, ['image/jpeg', 'image/png'], 50)) {
                showAlert('Invalid or unsupported file. Please select a valid JPEG/PNG under 50MB.', 'error');
                fileInput.value = '';
                preview.style.display = 'none';
                return;
            }
            
            originalFileName = file.name.split('.')[0] || 'image';
            const reader = new FileReader();
            reader.onload = (event) => {
                preview.src = event.target.result;
                preview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
            preview.src = "#";
        }
    };

    compressButton.onclick = () => {
        if (!fileInput.files || fileInput.files.length === 0) {
            showAlert('Please select an image file.', 'error');
            return;
        }
        const file = fileInput.files[0];
        if (!isSafeFile(file, ['image/jpeg', 'image/png'], 50)) {
            showAlert('Invalid or unsupported file.', 'error');
            return;
        }
        
        const quality = parseFloat(qualityInput.value);
        const originalSize = (file.size / 1024).toFixed(2);
        showAlert('Processing...', 'info');

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                let outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                let extension = outputFormat.split('/')[1];

                canvas.toBlob((blob) => {
                    if (blob) {
                        const compressedSize = (blob.size / 1024).toFixed(2);
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        // Safe File Name
                        a.download = escapeHTML(originalFileName) + `_compressed.${extension}`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        
                        const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(2);
                        compressionInfo.innerHTML = `Original Size: ${originalSize} KB<br>Compressed Size: ${compressedSize} KB<br>Reduction: ${reduction}%`;
                        compressionInfo.style.display = 'block';
                        showAlert('Compression successful!', 'success');
                    } else {
                        showAlert('Error during compression.', 'error');
                    }
                }, outputFormat, outputFormat === 'image/jpeg' ? quality : undefined);
            };
            img.onerror = () => showAlert('Could not load image.', 'error');
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };
};
