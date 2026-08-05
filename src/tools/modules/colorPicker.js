import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        container.innerHTML = `
                            <label for="htmlColorPicker">Select a Color:</label>
                            <input type="color" id="htmlColorPicker" value="#FFD700" style="width:100%; height: 40px; margin-bottom:1rem;">
                            <div class="color-picker-display result-area">
                                <div id="colorPreview" class="color-preview"></div>
                                <div id="colorValues" class="color-values">
                                    <p>HEX: <strong id="hexValue"></strong> <button class="copy-color-val" data-type="hex" title="Copy HEX">📋</button></p>
                                    <p>RGB: <strong id="rgbValue"></strong> <button class="copy-color-val" data-type="rgb" title="Copy RGB">📋</button></p>
                                    <p>HSL: <strong id="hslValue"></strong> <button class="copy-color-val" data-type="hsl" title="Copy HSL">📋</button></p>
                                </div>
                            </div>
                        `;
                        const colorPickerInput = container.querySelector('#htmlColorPicker');
                        const colorPreviewDiv = container.querySelector('#colorPreview');
                        const hexValueSpan = container.querySelector('#hexValue');
                        const rgbValueSpan = container.querySelector('#rgbValue');
                        const hslValueSpan = container.querySelector('#hslValue');
                        const copyButtons = container.querySelectorAll('.copy-color-val');


                        let currentHex, currentRgb, currentHsl;


                        function updateColorValues(hex) {
                            currentHex = hex.toUpperCase();
                            colorPreviewDiv.style.backgroundColor = currentHex;
                            hexValueSpan.textContent = currentHex;


                            const rgb = hexToRgb(currentHex);
                            currentRgb = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                            rgbValueSpan.textContent = currentRgb;


                            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                            currentHsl = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
                            hslValueSpan.textContent = currentHsl;
                        }


                        colorPickerInput.oninput = (e) => {
                            updateColorValues(e.target.value);
                            hideAlert();
                        };
                        
                        copyButtons.forEach(btn => {
                            btn.style.padding = "0.2em 0.5em"; // Smaller copy buttons
                            btn.style.marginLeft = "5px";
                            btn.onclick = () => {
                                let valueToCopy;
                                const type = btn.dataset.type;
                                if (type === 'hex') valueToCopy = currentHex;
                                else if (type === 'rgb') valueToCopy = currentRgb;
                                else if (type === 'hsl') valueToCopy = currentHsl;


                                if (valueToCopy) {
                                    navigator.clipboard.writeText(valueToCopy)
                                        .then(() => showAlert(`${type.toUpperCase()} value copied!`, 'success'))
                                        .catch(() => showAlert('Failed to copy.', 'error'));
                                }
                            };
                        });


                        updateColorValues(colorPickerInput.value); // Initial value


                        function hexToRgb(hex) {
                            let r = 0, g = 0, b = 0;
                            if (hex.length === 4) {
                                r = parseInt(hex[1] + hex[1], 16);
                                g = parseInt(hex[2] + hex[2], 16);
                                b = parseInt(hex[3] + hex[3], 16);
                            } else if (hex.length === 7) {
                                r = parseInt(hex.substring(1, 3), 16);
                                g = parseInt(hex.substring(3, 5), 16);
                                b = parseInt(hex.substring(5, 7), 16);
                            }
                            return { r, g, b };
                        }


                        function rgbToHsl(r, g, b) {
                            r /= 255; g /= 255; b /= 255;
                            const max = Math.max(r, g, b), min = Math.min(r, g, b);
                            let h, s, l = (max + min) / 2;


                            if (max === min) {
                                h = s = 0;
                            } else {
                                const d = max - min;
                                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                                switch (max) {
                                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                                    case g: h = (b - r) / d + 2; break;
                                    case b: h = (r - g) / d + 4; break;
                                }
                                h /= 6;
                            }
                            return {
                                h: Math.round(h * 360),
                                s: Math.round(s * 100),
                                l: Math.round(l * 100)
                            };
                        }
                    };
