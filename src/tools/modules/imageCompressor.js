import { showAlert, hideAlert } from '../../utils/alerts.js';
import { isSafeFile } from '../../utils/validate.js';

/**
 * Robust Client-Side Image Compressor
 * - Supports JPEG, PNG, and WebP
 * - Multi-candidate evaluation (never reports success if output is larger)
 * - Safe handling of transparency
 * - Preserves original if no smaller candidate can be achieved
 */
export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="imgCompFile">Select Image File (JPEG, PNG, WebP):</label>
            <input type="file" id="imgCompFile" accept="image/jpeg,image/png,image/webp">

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1rem;">
                <div>
                    <label for="imgCompFormat">Output Format:</label>
                    <select id="imgCompFormat">
                        <option value="auto" selected>Auto (Smallest Size)</option>
                        <option value="image/webp">WebP (Best Compression)</option>
                        <option value="image/jpeg">JPEG</option>
                        <option value="image/png">PNG</option>
                    </select>
                </div>
                <div>
                    <label for="imgCompQuality">Target Quality (<span id="qualityValDisplay">70</span>%):</label>
                    <input type="range" id="imgCompQuality" min="10" max="95" value="70" step="5">
                </div>
            </div>

            <div style="margin-top:0.8rem;">
                <label for="imgCompScale">Resize / Scale Dimension:</label>
                <select id="imgCompScale">
                    <option value="1.0" selected>Original Dimensions (100%)</option>
                    <option value="0.8">Scale to 80%</option>
                    <option value="0.6">Scale to 60%</option>
                    <option value="0.5">Scale to 50% (Half Size)</option>
                </select>
            </div>

            <button id="imgCompButton" style="margin-top:1.2rem;">🗜️ Compress Image</button>

            <div id="compressionInfo" class="result-area" style="display:none; text-align:center; margin-top:1.2rem;"></div>
            <img id="imagePreviewComp" src="#" alt="Preview" style="display:none; max-width: 100%; max-height:300px; border-radius:8px; margin: 1rem auto 0 auto;">
        </div>
    `;

    const fileInput = container.querySelector('#imgCompFile');
    const formatSelect = container.querySelector('#imgCompFormat');
    const qualityInput = container.querySelector('#imgCompQuality');
    const qualityValDisplay = container.querySelector('#qualityValDisplay');
    const scaleSelect = container.querySelector('#imgCompScale');
    const compressButton = container.querySelector('#imgCompButton');
    const compressionInfo = container.querySelector('#compressionInfo');
    const preview = container.querySelector('#imagePreviewComp');

    let originalFileName = 'compressed_image';
    let loadedImage = null;
    let previewObjectUrl = null;

    qualityInput.oninput = () => {
        qualityValDisplay.textContent = qualityInput.value;
    };

    fileInput.onchange = (e) => {
        if (previewObjectUrl) {
            URL.revokeObjectURL(previewObjectUrl);
            previewObjectUrl = null;
        }

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!isSafeFile(file, ['image/jpeg', 'image/png', 'image/webp'], 50)) {
                showAlert('Invalid file. Please select a valid JPEG, PNG, or WebP under 50MB.', 'error');
                fileInput.value = '';
                preview.style.display = 'none';
                loadedImage = null;
                return;
            }

            originalFileName = file.name.replace(/\.[^/.]+$/, "") || 'image';
            previewObjectUrl = URL.createObjectURL(file);
            loadedImage = new Image();
            loadedImage.onload = () => {
                preview.src = previewObjectUrl;
                preview.style.display = 'block';
                hideAlert();
            };
            loadedImage.onerror = () => {
                showAlert('Failed to load selected image.', 'error');
                preview.style.display = 'none';
            };
            loadedImage.src = previewObjectUrl;
        } else {
            preview.style.display = 'none';
            loadedImage = null;
        }
    };

    const getBlobFromCanvas = (canvas, mimeType, quality) => {
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, mimeType, quality);
        });
    };

    compressButton.onclick = async () => {
        if (!fileInput.files || fileInput.files.length === 0 || !loadedImage) {
            showAlert('Please select an image file first.', 'error');
            return;
        }

        const file = fileInput.files[0];
        const quality = parseFloat(qualityInput.value) / 100;
        const scale = parseFloat(scaleSelect.value) || 1.0;
        const targetFormatSetting = formatSelect.value;
        const origSizeBytes = file.size;
        const origSizeKb = (origSizeBytes / 1024).toFixed(1);

        showAlert('Compressing image...', 'info');
        compressButton.disabled = true;

        try {
            const targetWidth = Math.max(1, Math.round(loadedImage.naturalWidth * scale));
            const targetHeight = Math.max(1, Math.round(loadedImage.naturalHeight * scale));

            // Setup canvas
            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                showAlert('Canvas context is unavailable in this environment.', 'error');
                compressButton.disabled = false;
                return;
            }

            // Test candidate formats
            const formatsToTest = [];
            if (targetFormatSetting === 'auto') {
                formatsToTest.push('image/webp', 'image/jpeg');
                if (file.type === 'image/png') formatsToTest.push('image/png');
            } else {
                formatsToTest.push(targetFormatSetting);
            }

            let bestBlob = null;
            let bestFormat = '';

            for (const fmt of formatsToTest) {
                // For JPEG, fill with white background first to avoid black transparency
                ctx.clearRect(0, 0, targetWidth, targetHeight);
                if (fmt === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, targetWidth, targetHeight);
                }
                ctx.drawImage(loadedImage, 0, 0, targetWidth, targetHeight);

                const blob = await getBlobFromCanvas(canvas, fmt, fmt === 'image/png' ? undefined : quality);
                if (blob && blob.size > 0) {
                    if (!bestBlob || blob.size < bestBlob.size) {
                        bestBlob = blob;
                        bestFormat = fmt;
                    }
                }
            }

            // If best candidate is STILL larger than original and format was auto/original, try stepping down quality
            if (bestBlob && bestBlob.size >= origSizeBytes && scale === 1.0 && targetFormatSetting === 'auto') {
                const lowerQuality = Math.max(0.3, quality * 0.7);
                for (const fmt of ['image/webp', 'image/jpeg']) {
                    ctx.clearRect(0, 0, targetWidth, targetHeight);
                    if (fmt === 'image/jpeg') {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, targetWidth, targetHeight);
                    }
                    ctx.drawImage(loadedImage, 0, 0, targetWidth, targetHeight);
                    const blob = await getBlobFromCanvas(canvas, fmt, lowerQuality);
                    if (blob && blob.size < bestBlob.size) {
                        bestBlob = blob;
                        bestFormat = fmt;
                    }
                }
            }

            // Comparison and Decision
            const isTrulyReduced = bestBlob && bestBlob.size < origSizeBytes;
            const finalBlob = isTrulyReduced ? bestBlob : file;
            const finalSizeBytes = finalBlob.size;
            const finalSizeKb = (finalSizeBytes / 1024).toFixed(1);
            const ext = isTrulyReduced ? (bestFormat.split('/')[1] === 'jpeg' ? 'jpg' : bestFormat.split('/')[1]) : (file.name.split('.').pop() || 'png');

            const downloadUrl = URL.createObjectURL(finalBlob);
            const safeBaseName = originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
            const downloadName = isTrulyReduced ? `${safeBaseName}_compressed.${ext}` : file.name;

            if (isTrulyReduced) {
                const savingsPct = ((1 - finalSizeBytes / origSizeBytes) * 100).toFixed(1);
                compressionInfo.innerHTML = `
                    <p style="color:var(--success-color); font-weight:700; font-size:1.1rem; margin-bottom:0.5rem;">
                        🎉 Compression Successful! Reduced by ${savingsPct}%
                    </p>
                    <p style="color:var(--text-secondary); margin-bottom:1rem; font-size:0.9rem;">
                        Original: <strong>${origSizeKb} KB</strong> ➔ Compressed: <strong>${finalSizeKb} KB</strong> (${ext.toUpperCase()})
                    </p>
                    <a href="${downloadUrl}" download="${downloadName}" class="primary-button" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">
                        📥 Download Compressed Image
                    </a>
                `;
                showAlert(`Image compressed! Saved ${(origSizeBytes - finalSizeBytes > 1024 ? ((origSizeBytes - finalSizeBytes)/1024).toFixed(1) + ' KB' : (origSizeBytes - finalSizeBytes) + ' B')} (${savingsPct}% reduction).`, 'success');
            } else {
                compressionInfo.innerHTML = `
                    <p style="color:var(--primary-color); font-weight:600; font-size:1.05rem; margin-bottom:0.5rem;">
                        ⚡ File is Already Optimally Compressed!
                    </p>
                    <p style="color:var(--text-secondary); margin-bottom:1rem; font-size:0.85rem;">
                        The original image (${origSizeKb} KB) is already smaller than the re-encoded output (${finalSizeKb} KB). We've preserved your original file so quality is not lost.
                    </p>
                    <a href="${downloadUrl}" download="${downloadName}" class="secondary-button" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">
                        📥 Download Original (${origSizeKb} KB)
                    </a>
                `;
                showAlert('Original image is already optimal. Preserved original file.', 'info');
            }

            compressionInfo.style.display = 'block';
        } catch (err) {
            console.error(err);
            showAlert('An error occurred during compression. Please try again.', 'error');
        } finally {
            compressButton.disabled = false;
        }
    };

    window.currentToolCleanup = () => {
        if (previewObjectUrl) {
            URL.revokeObjectURL(previewObjectUrl);
            previewObjectUrl = null;
        }
    };
};
