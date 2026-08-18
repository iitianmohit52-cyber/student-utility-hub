import { showAlert, hideAlert } from '../../utils/alerts.js';
import { isSafeFile } from '../../utils/validate.js';
import { escapeHTML } from '../../utils/sanitize.js';

export default (container) => {
    container.innerHTML = `
        <input type="file" id="imgConvFile" accept="image/jpeg,image/png,image/webp">
        <label for="imgConvFormat">Convert to:</label>
        <select id="imgConvFormat">
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
        </select>
        <button id="imgConvButton">Convert & Download</button>
        <p>Note: WEBP support varies by browser.</p>
        <img id="imagePreview" src="#" alt="Preview" style="display:none; max-width: 100%; margin-top: 10px;">
    `;
    const fileInput = container.querySelector('#imgConvFile');
    const formatSelect = container.querySelector('#imgConvFormat');
    const convertButton = container.querySelector('#imgConvButton');
    const preview = container.querySelector('#imagePreview');
    let originalFileName = 'converted_image';

    fileInput.onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!isSafeFile(file, ['image/jpeg', 'image/png', 'image/webp'], 50)) {
                showAlert('Invalid or unsupported file.', 'error');
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
             preview.src="#";
        }
    };

    convertButton.onclick = () => {
        if (!fileInput.files || fileInput.files.length === 0) {
            showAlert('Please select an image file first.', 'error');
            return;
        }
        const file = fileInput.files[0];
        if (!isSafeFile(file, ['image/jpeg', 'image/png', 'image/webp'], 50)) {
            showAlert('Invalid file.', 'error');
            return;
        }
        const targetFormat = formatSelect.value;
        const targetExtension = targetFormat === 'image/jpeg' ? 'jpg' : (targetFormat.split('/')[1] || 'png');

        showAlert('Processing...', 'info');

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth || img.width;
                canvas.height = img.naturalHeight || img.height;
                const ctx = canvas.getContext('2d');
                
                // If converting to JPEG, fill with white background first to prevent black transparency
                if (targetFormat === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }

                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        const safeBaseName = originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
                        a.download = `${safeBaseName}_converted.${targetExtension}`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        showAlert('Conversion successful!', 'success');
                    } else {
                        showAlert(`Error converting to ${targetFormat}. This format might not be supported for export by your browser.`, 'error');
                    }
                }, targetFormat, 0.92);
            };
            img.onerror = () => showAlert('Could not load image. Ensure it is a valid JPG, PNG, or WEBP.', 'error');
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };
};
