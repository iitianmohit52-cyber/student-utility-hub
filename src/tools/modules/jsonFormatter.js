import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        container.innerHTML = `
                            <textarea id="jsonInput" placeholder="Paste your JSON data here..." rows="7"></textarea>
                            <div style="display:flex; align-items:center; margin-bottom:1rem;">
                                <label for="jsonSpaces" style="margin-right:10px; margin-bottom:0;">Indentation:</label>
                                <select id="jsonSpaces" style="width:auto; margin-bottom:0;">
                                    <option value="2">2 Spaces</option>
                                    <option value="4" selected>4 Spaces</option>
                                    <option value="tab">Tabs</option>
                                </select>
                                <button id="formatJsonBtn" style="margin-left:auto;">Format JSON</button>
                            </div>
                            <label for="jsonOutput" style="display:block; margin-bottom:0.5rem;">Formatted JSON:
                                <button id="copyJsonBtn" style="float:right; padding:0.3em 0.6em; margin-top:-5px;">Copy</button>
                            </label>
                            <textarea id="jsonOutput" readonly rows="7"></textarea>
                        `;
                        const inputArea = container.querySelector('#jsonInput');
                        const outputArea = container.querySelector('#jsonOutput');
                        const formatBtn = container.querySelector('#formatJsonBtn');
                        const copyBtn = container.querySelector('#copyJsonBtn');
                        const spacesSelect = container.querySelector('#jsonSpaces');


                        formatBtn.onclick = () => {
                            const jsonString = inputArea.value.trim();
                            if (!jsonString) {
                                showAlert('Input is empty. Paste some JSON data.', 'info');
                                outputArea.value = '';
                                return;
                            }
                            try {
                                const jsonObj = JSON.parse(jsonString);
                                const spacesOption = spacesSelect.value;
                                let indent;
                                if (spacesOption === 'tab') {
                                    indent = '\t';
                                } else {
                                    indent = parseInt(spacesOption);
                                }
                                outputArea.value = JSON.stringify(jsonObj, null, indent);
                                showAlert('JSON formatted successfully!', 'success');
                            } catch (e) {
                                outputArea.value = 'Error: Invalid JSON\n\n' + e.message;
                                showAlert('Invalid JSON: ' + e.message, 'error');
                            }
                        };
                        copyBtn.onclick = () => {
                            if (outputArea.value && !outputArea.value.startsWith('Error:')) {
                                navigator.clipboard.writeText(outputArea.value)
                                    .then(() => showAlert('Formatted JSON copied!', 'success'))
                                    .catch(err => showAlert('Failed to copy.', 'error'));
                            } else if (outputArea.value.startsWith('Error:')) {
                                showAlert('Cannot copy error message. Please format valid JSON first.', 'info');
                            } else {
                                 showAlert('Nothing to copy. Format some JSON first.', 'info');
                            }
                        };
                    };
