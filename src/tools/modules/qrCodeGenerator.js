import { showAlert, hideAlert } from '../../utils/alerts.js';

const loadQrLib = async () => {
    if (window.QRCode) return window.QRCode;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.onload = () => resolve(window.QRCode);
        script.onerror = () => reject(new Error('Failed to load QR code library'));
        document.head.appendChild(script);
    });
};

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="qrText">Text or URL for QR Code:</label>
            <textarea id="qrText" rows="3" placeholder="https://example.com or enter any text..."></textarea>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1rem;">
                <div>
                    <label for="qrSize">Size (pixels):</label>
                    <input type="number" id="qrSize" value="250" min="100" max="600" step="50">
                </div>
                <div>
                    <label for="qrCorrection">Error Correction Level:</label>
                    <select id="qrCorrection">
                        <option value="H" selected>High (30% recovery)</option>
                        <option value="Q">Quartile (25% recovery)</option>
                        <option value="M">Medium (15% recovery)</option>
                        <option value="L">Low (7% recovery)</option>
                    </select>
                </div>
            </div>

            <button id="generateQrBtn" style="margin-top:1.2rem;">📱 Generate QR Code</button>
            
            <div id="qrCodeContainer" class="result-area" style="text-align:center; display:none; margin-top:1.5rem; background:white; padding:1.5rem; border-radius:8px;"></div>
            <div id="qrActionArea" style="text-align:center; margin-top:1rem; display:none;">
                <button id="downloadQrBtn" class="primary-btn">📥 Download QR Code (PNG)</button>
            </div>
        </div>
    `;

    const textInput = container.querySelector('#qrText');
    const sizeInput = container.querySelector('#qrSize');
    const correctionSelect = container.querySelector('#qrCorrection');
    const generateBtn = container.querySelector('#generateQrBtn');
    const qrContainer = container.querySelector('#qrCodeContainer');
    const actionArea = container.querySelector('#qrActionArea');
    const downloadBtn = container.querySelector('#downloadQrBtn');

    let currentQrImageOrCanvas = null;

    generateBtn.onclick = async () => {
        const text = textInput.value.trim();
        const size = parseInt(sizeInput.value, 10) || 250;
        
        if (!text) {
            showAlert('Please enter text or URL for the QR code.', 'error');
            qrContainer.style.display = 'none';
            actionArea.style.display = 'none';
            return;
        }

        if (size < 100 || size > 600) {
            showAlert('Please enter a valid size between 100 and 600 pixels.', 'error');
            return;
        }

        try {
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';
            hideAlert();

            const QRCodeLib = await loadQrLib();
            qrContainer.innerHTML = '';

            const levelMap = {
                'L': QRCodeLib.CorrectLevel.L,
                'M': QRCodeLib.CorrectLevel.M,
                'Q': QRCodeLib.CorrectLevel.Q,
                'H': QRCodeLib.CorrectLevel.H
            };

            const qrHolder = document.createElement('div');
            qrHolder.style.display = 'inline-block';
            qrContainer.appendChild(qrHolder);

            new QRCodeLib(qrHolder, {
                text: text,
                width: size,
                height: size,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: levelMap[correctionSelect.value] || QRCodeLib.CorrectLevel.H
            });

            // Wait brief tick for rendering
            setTimeout(() => {
                const canvas = qrHolder.querySelector('canvas');
                const img = qrHolder.querySelector('img');
                currentQrImageOrCanvas = canvas || img;

                qrContainer.style.display = 'block';
                actionArea.style.display = 'block';
                showAlert('QR Code generated successfully!', 'success');
            }, 100);

        } catch (err) {
            console.error(err);
            showAlert(`Error generating QR code: ${err.message}`, 'error');
            qrContainer.style.display = 'none';
            actionArea.style.display = 'none';
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = '📱 Generate QR Code';
        }
    };

    downloadBtn.onclick = () => {
        if (!currentQrImageOrCanvas) {
            showAlert('QR code element is not available for download.', 'error');
            return;
        }

        let downloadUrl = '';
        if (currentQrImageOrCanvas.tagName === 'CANVAS') {
            downloadUrl = currentQrImageOrCanvas.toDataURL('image/png');
        } else if (currentQrImageOrCanvas.tagName === 'IMG') {
            downloadUrl = currentQrImageOrCanvas.src;
        }

        if (downloadUrl) {
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'qrcode.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showAlert('QR Code image downloaded!', 'success');
        }
    };
};
