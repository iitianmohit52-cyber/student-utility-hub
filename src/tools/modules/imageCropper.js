import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        container.innerHTML = `
                            <input type="file" id="imgCropFile" accept="image/*">
                            <p>After selecting an image, adjust crop parameters below. A real cropper would have a draggable overlay.</p>
                            <canvas id="cropCanvas" style="display:none;"></canvas>
                            <br>
                            <label for="cropX">Crop Start X (px):</label> <input type="number" id="cropX" value="0" style="width:80px;">
                            <label for="cropY">Crop Start Y (px):</label> <input type="number" id="cropY" value="0" style="width:80px;">
                            <br>
                            <label for="cropW">Crop Width (px):</label> <input type="number" id="cropW" value="100" style="width:80px;">
                            <label for="cropH">Crop Height (px):</label> <input type="number" id="cropH" value="100" style="width:80px;">
                            <br>
                            <button id="cropButton">Crop & Download</button>
                            <img id="croppedImagePreview" src="#" alt="Cropped Preview" style="display:none;">
                        `;
                        const fileInput = container.querySelector('#imgCropFile');
                        const cropCanvas = container.querySelector('#cropCanvas'); // This is the preview canvas
                        const ctx = cropCanvas.getContext('2d');
                        const cropXInput = container.querySelector('#cropX');
                        const cropYInput = container.querySelector('#cropY');
                        const cropWInput = container.querySelector('#cropW');
                        const cropHInput = container.querySelector('#cropH');
                        const cropButton = container.querySelector('#cropButton');
                        const croppedPreview = container.querySelector('#croppedImagePreview');
                        let sourceImage = null;
                        let originalFileName = 'cropped_image';


                        fileInput.onchange = (e) => {
                            if (e.target.files && e.target.files[0]) {
                                originalFileName = e.target.files[0].name.split('.')[0] || 'image';
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    sourceImage = new Image();
                                    sourceImage.onload = () => {
                                        const MAX_PREVIEW_DIM = 300; // Max width/height for preview canvas
                                        let scale = Math.min(MAX_PREVIEW_DIM / sourceImage.width, MAX_PREVIEW_DIM / sourceImage.height, 1);
                                        cropCanvas.width = sourceImage.width * scale;
                                        cropCanvas.height = sourceImage.height * scale;
                                        ctx.drawImage(sourceImage, 0, 0, cropCanvas.width, cropCanvas.height);
                                        cropCanvas.style.display = 'block';
                                        
                                        cropWInput.value = Math.floor(sourceImage.width / 2);
                                        cropHInput.value = Math.floor(sourceImage.height / 2);
                                        cropXInput.value = Math.floor(sourceImage.width / 4);
                                        cropYInput.value = Math.floor(sourceImage.height / 4);
                                        showAlert('Image loaded. Adjust crop parameters based on original image dimensions.', 'info');
                                    };
                                    sourceImage.src = event.target.result;
                                };
                                reader.readAsDataURL(e.target.files[0]);
                            } else {
                                cropCanvas.style.display = 'none';
                                if (sourceImage) sourceImage.src = "";
                                sourceImage = null;
                            }
                        };


                        cropButton.onclick = () => {
                            if (!sourceImage) {
                                showAlert('Please select an image first.', 'error');
                                return;
                            }
                            const sx = parseInt(cropXInput.value);
                            const sy = parseInt(cropYInput.value);
                            const sWidth = parseInt(cropWInput.value);
                            const sHeight = parseInt(cropHInput.value);


                            if (isNaN(sx) || isNaN(sy) || isNaN(sWidth) || isNaN(sHeight) || sWidth <= 0 || sHeight <= 0) {
                                showAlert('Invalid crop dimensions. Ensure they are positive numbers.', 'error');
                                return;
                            }
                            if (sx + sWidth > sourceImage.width || sy + sHeight > sourceImage.height || sx < 0 || sy < 0) {
                                showAlert('Crop area is outside the image boundaries.', 'error');
                                return;
                            }
                            
                            showAlert('Cropping...', 'info');
                            const tempCanvas = document.createElement('canvas');
                            tempCanvas.width = sWidth;
                            tempCanvas.height = sHeight;
                            const tempCtx = tempCanvas.getContext('2d');
                            
                            try {
                                tempCtx.drawImage(sourceImage, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
                                const dataUrl = tempCanvas.toDataURL(fileInput.files[0].type || 'image/png');
                                croppedPreview.src = dataUrl;
                                croppedPreview.style.display = 'block';


                                const a = document.createElement('a');
                                a.href = dataUrl;
                                a.download = `${originalFileName}_cropped.${(fileInput.files[0].type || 'image/png').split('/')[1]}`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                showAlert('Image cropped and download started.', 'success');
                            } catch (error) {
                                showAlert('Error during cropping: ' + error.message, 'error');
                            }
                        };
                    };
