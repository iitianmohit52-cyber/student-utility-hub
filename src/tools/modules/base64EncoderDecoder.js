import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        container.innerHTML = `
                            <textarea id="b64Input" placeholder="Enter text to encode or Base64 to decode" rows="5"></textarea>
                            <button id="b64EncodeBtn">Encode to Base64</button>
                            <button id="b64DecodeBtn">Decode from Base64</button>
                            <label for="b64Output" style="margin-top:1rem; display:block;">Result:</label>
                            <textarea id="b64Output" readonly rows="5"></textarea>
                        `;
                        const inputArea = container.querySelector('#b64Input');
                        const outputArea = container.querySelector('#b64Output');
                        const encodeBtn = container.querySelector('#b64EncodeBtn');
                        const decodeBtn = container.querySelector('#b64DecodeBtn');


                        encodeBtn.onclick = () => {
                            try {
                                // Handle UTF-8 characters correctly for btoa
                                const utf8Encoded = new TextEncoder().encode(inputArea.value);
                                let binaryString = '';
                                utf8Encoded.forEach(byte => binaryString += String.fromCharCode(byte));
                                outputArea.value = btoa(binaryString);
                                hideAlert();
                            } catch (e) {
                                showAlert('Error encoding: ' + e.message, 'error');
                                outputArea.value = '';
                            }
                        };


                        decodeBtn.onclick = () => {
                            try {
                                 // Handle UTF-8 characters correctly for atob
                                const binaryString = atob(inputArea.value);
                                const bytes = new Uint8Array(binaryString.length);
                                for (let i = 0; i < binaryString.length; i++) {
                                    bytes[i] = binaryString.charCodeAt(i);
                                }
                                outputArea.value = new TextDecoder().decode(bytes);
                                hideAlert();
                            } catch (e) {
                                showAlert('Error decoding: Invalid Base64 string or character issue. ' + e.message, 'error');
                                outputArea.value = '';
                            }
                        };
                    };
