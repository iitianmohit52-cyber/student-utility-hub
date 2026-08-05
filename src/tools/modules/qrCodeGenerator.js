import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        container.innerHTML = `
                            <label for="qrText">Text or URL for QR Code:</label>
                            <textarea id="qrText" placeholder="Enter text here"></textarea>
                            <label for="qrSize">Size (pixels):</label>
                            <input type="number" id="qrSize" value="200" min="50" max="500">
                            <button id="generateQrBtn">Generate QR Code</button>
                            <div id="qrCodeContainer" class="result-area" style="text-align:center; display:none; padding:10px; background-color:white;"></div>
                            <button id="downloadQrBtn" style="display:none;">Download QR Code</button>
                        `;
                        const textInput = container.querySelector('#qrText');
                        const sizeInput = container.querySelector('#qrSize');
                        const generateBtn = container.querySelector('#generateQrBtn');
                        const qrContainer = container.querySelector('#qrCodeContainer');
                        const downloadBtn = container.querySelector('#downloadQrBtn');
                        let qrCanvasInstance = null; // To hold the canvas element itself


                        generateBtn.onclick = () => {
                            const text = textInput.value.trim();
                            const size = parseInt(sizeInput.value);
                            if (!text) {
                                showAlert('Please enter text or URL for the QR code.', 'error');
                                qrContainer.style.display = 'none';
                                downloadBtn.style.display = 'none';
                                return;
                            }
                            if (isNaN(size) || size < 50 || size > 500) {
                                showAlert('Please enter a valid size between 50 and 500 pixels.', 'error');
                                return;
                            }


                            qrContainer.innerHTML = ''; // Clear previous QR code
                            
                            try {
                                if (typeof QRCode !== 'undefined') { // Check if a library like qrcode.js is loaded
                                    qrCanvasInstance = document.createElement('div'); // qrcode.js typically targets a div
                                    qrContainer.appendChild(qrCanvasInstance);
                                    new QRCode(qrCanvasInstance, {
                                        text: text,
                                        width: size,
                                        height: size,
                                        colorDark : "#000000",
                                        colorLight : "#ffffff",
                                        correctLevel : QRCode.CorrectLevel.H
                                    });
                                    // qrcode.js generates an img and a canvas, we want the canvas for download
                                    // Wait a moment for QRCode.js to render
                                    setTimeout(() => {
                                        const canvasFromLib = qrCanvasInstance.querySelector('canvas');
                                        if (canvasFromLib) {
                                            qrCanvasInstance = canvasFromLib; // Now qrCanvasInstance is the actual canvas
                                        } else {
                                            // Fallback if canvas not found, might be an img tag
                                            const imgFromLib = qrCanvasInstance.querySelector('img');
                                            if (imgFromLib) {
                                                // Create a canvas from the image
                                                const tempCanvas = document.createElement('canvas');
                                                tempCanvas.width = imgFromLib.width;
                                                tempCanvas.height = imgFromLib.height;
                                                tempCanvas.getContext('2d').drawImage(imgFromLib, 0, 0);
                                                qrCanvasInstance = tempCanvas;
                                            }
                                        }
                                    }, 100);
                                    showAlert('QR Code generated!', 'success');
                                } else {
                                    // Fallback to simplified canvas drawing if no library
                                    qrCanvasInstance = document.createElement('canvas');
                                    qrContainer.appendChild(qrCanvasInstance);
                                    const ctx = qrCanvasInstance.getContext('2d');
                                    qrCanvasInstance.width = size;
                                    qrCanvasInstance.height = size;
                                    ctx.fillStyle = 'white';
                                    ctx.fillRect(0, 0, size, size);
                                    ctx.fillStyle = 'black';
                                    ctx.font = `${size/15}px Arial`;
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    // Simple placeholder text rendering - not a real QR
                                    const lines = text.match(/.{1,20}/g) || [text]; // Split text
                                    lines.forEach((line, i) => {
                                        ctx.fillText(line, size / 2, size / 2 - (lines.length/2 * (size/10)) + (i * (size/10)) );
                                    });
                                    ctx.strokeRect(size*0.1, size*0.1, size*0.8, size*0.8); // Border
                                    showAlert('QR Code (placeholder - library not found) generated. For real QR codes, integrate a library.', 'info');
                                }
                                qrContainer.style.display = 'block';
                                downloadBtn.style.display = 'inline-block';
                            } catch (e) {
                                showAlert('Error generating QR code: ' + e.message, 'error');
                                console.error("QR Gen Error:", e);
                                qrContainer.style.display = 'none';
                                downloadBtn.style.display = 'none';
                            }
                        };


                        downloadBtn.onclick = () => {
                            if (qrCanvasInstance && qrCanvasInstance.tagName === 'CANVAS') {
                                const dataURL = qrCanvasInstance.toDataURL('image/png');
                                const a = document.createElement('a');
                                a.href = dataURL;
                                a.download = 'qrcode.png';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            } else if (qrCanvasInstance && qrCanvasInstance.tagName === 'IMG') { // If library generated an IMG
                                 const a = document.createElement('a');
                                 a.href = qrCanvasInstance.src;
                                 a.download = 'qrcode.png';
                                 document.body.appendChild(a);
                                 a.click();
                                 document.body.removeChild(a);
                            } else {
                                showAlert('QR Code canvas not available for download.', 'error');
                            }
                        };
                    };
