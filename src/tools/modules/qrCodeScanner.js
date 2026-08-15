import { createTool } from '../core/ToolFactory.js';
import { createInput, createButton, createToolLayout, createResultBox } from '../../components/ui/index.js';
import { escapeHTML, sanitizeURL } from '../../utils/sanitize.js';

const loadJsQR = async () => {
    if (window.jsQR) return window.jsQR;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js';
        script.onload = () => resolve(window.jsQR);
        script.onerror = () => reject(new Error('Failed to load QR scanner library'));
        document.head.appendChild(script);
    });
};

export default createTool('qrCodeScanner', ({ container, showAlert, hideAlert }) => {
    let selectedFile = null;
    let videoStream = null;
    let scanningActive = false;

    const fileInput = createInput({
        id: 'qrFile',
        type: 'file',
        label: 'Upload QR Code Image:',
        onChange: (val, e) => {
            selectedFile = e.target.files[0];
            scanFromFile();
        }
    });
    fileInput.querySelector('input').accept = 'image/*';

    const startCamBtn = createButton({
        id: 'startCamBtn',
        text: 'Start Webcam Scanner',
        icon: '📷',
        onClick: () => toggleWebcam()
    });

    const resultBox = createResultBox({
        id: 'qrResult',
        title: 'Decoded QR Content'
    });

    // Camera Preview Video & Canvas
    const previewContainer = document.createElement('div');
    previewContainer.style.textAlign = 'center';
    previewContainer.style.marginTop = '1rem';
    previewContainer.style.position = 'relative';

    const videoEl = document.createElement('video');
    videoEl.autoplay = true;
    videoEl.playsInline = true;
    videoEl.style.width = '100%';
    videoEl.style.maxWidth = '400px';
    videoEl.style.borderRadius = 'var(--radius-md)';
    videoEl.style.display = 'none';
    previewContainer.appendChild(videoEl);

    const layout = createToolLayout({
        inputs: [fileInput, startCamBtn, previewContainer],
        actions: [],
        resultBox: resultBox
    });

    container.appendChild(layout);

    const scanFromFile = async () => {
        if (!selectedFile) return;

        try {
            hideAlert();
            const jsQR = await loadJsQR();
            const img = new Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imgData.data, imgData.width, imgData.height, {
                    inversionAttempts: 'dontInvert'
                });

                if (code) {
                    showResult(code.data);
                } else {
                    showAlert('Could not detect any QR code in this image. Try another file.', 'error');
                }
            };
            
            const reader = new FileReader();
            reader.onload = (e) => img.src = e.target.result;
            reader.readAsDataURL(selectedFile);
        } catch (err) {
            console.error(err);
            showAlert('Failed to process image scan.', 'error');
        }
    };

    const toggleWebcam = async () => {
        if (scanningActive) {
            stopWebcam();
            return;
        }

        try {
            hideAlert();
            const jsQR = await loadJsQR();

            videoStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            videoEl.srcObject = videoStream;
            videoEl.style.display = 'inline-block';
            scanningActive = true;
            startCamBtn.textContent = 'Stop Scanner';
            startCamBtn.className = 'secondary-button';

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const tick = () => {
                if (!scanningActive) return;

                if (videoEl.readyState === videoEl.HAVE_ENOUGH_DATA) {
                    canvas.width = videoEl.videoWidth;
                    canvas.height = videoEl.videoHeight;
                    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imgData.data, imgData.width, imgData.height, {
                        inversionAttempts: 'dontInvert'
                    });

                    if (code) {
                        showResult(code.data);
                        stopWebcam();
                        return;
                    }
                }
                requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
        } catch (err) {
            console.error(err);
            showAlert('Unable to access webcam. Ensure permission is granted.', 'error');
        }
    };

    const stopWebcam = () => {
        scanningActive = false;
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
        }
        videoEl.style.display = 'none';
        videoEl.srcObject = null;
        startCamBtn.textContent = 'Start Webcam Scanner';
        startCamBtn.className = 'primary-button';
    };

    const showResult = (data) => {
        const safeData = String(data || '');
        const escapedData = escapeHTML(safeData);
        const validHttpUrl = sanitizeURL(safeData);
        const isHttp = validHttpUrl && (validHttpUrl.startsWith('http://') || validHttpUrl.startsWith('https://'));

        resultBox.update(`
            <div style="text-align: center;">
                <p style="color:var(--success-color); font-weight:600; margin-bottom:1rem;">✅ QR Code Decoded!</p>
                <textarea id="qrDataOutput" readonly style="width:100%; height:80px; padding:0.75rem; border:1px solid var(--tool-card-border); border-radius:var(--radius-md); background:var(--surface-color); color:var(--text-primary); font-family:monospace; margin-bottom:1rem;"></textarea>
                <div style="display:flex; gap:1rem; justify-content:center;">
                    <button type="button" class="primary-button" id="copyResultBtn">📋 Copy Data</button>
                    ${isHttp ? `<a href="${escapeHTML(validHttpUrl)}" target="_blank" rel="noopener noreferrer" class="secondary-button" style="text-decoration:none;">🌐 Open URL</a>` : ''}
                </div>
            </div>
        `);

        const out = resultBox.querySelector('#qrDataOutput');
        if (out) out.value = safeData;

        resultBox.querySelector('#copyResultBtn').onclick = () => {
            if (out) {
                out.select();
                navigator.clipboard.writeText(safeData)
                    .then(() => showAlert('QR data copied to clipboard!', 'success'))
                    .catch(() => showAlert('Failed to copy data.', 'error'));
            }
        };
    };

    // Cleanup video capture when modal closes
    window.currentToolCleanup = () => {
        stopWebcam();
    };
});
