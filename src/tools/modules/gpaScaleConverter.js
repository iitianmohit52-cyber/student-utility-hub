import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="gpaValInput">Enter GPA / Grade Score:</label>
            <input type="number" id="gpaValInput" step="0.01" min="0" placeholder="e.g. 3.6" value="3.6">

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1rem;">
                <div>
                    <label for="fromScale">Source Scale:</label>
                    <select id="fromScale">
                        <option value="4.0">4.0 Scale (US / Standard)</option>
                        <option value="5.0">5.0 Scale (Weighted)</option>
                        <option value="10.0">10.0 Scale (Indian / European)</option>
                    </select>
                </div>
                <div>
                    <label for="toScale">Target Scale:</label>
                    <select id="toScale">
                        <option value="10.0">10.0 Scale (Indian / European)</option>
                        <option value="4.0">4.0 Scale (US / Standard)</option>
                        <option value="5.0">5.0 Scale (Weighted)</option>
                    </select>
                </div>
            </div>

            <button id="convertScaleBtn" style="margin-top:1.2rem;">🔄 Convert GPA Scale</button>

            <div id="scaleResult" class="result-area" style="display:none; margin-top:1.2rem; text-align:center;">
                <span style="font-size:1rem; color:var(--text-secondary);">Converted Score:</span>
                <h2 id="scaleOutVal" style="font-size:2.5rem; color:var(--accent-color); margin:0.4rem 0;">--</h2>
                <p id="scaleNoteOut" style="font-weight:600; color:var(--text-primary);"></p>
            </div>
        </div>
    `;

    const input = container.querySelector('#gpaValInput');
    const fromSelect = container.querySelector('#fromScale');
    const toSelect = container.querySelector('#toScale');
    const convertBtn = container.querySelector('#convertScaleBtn');
    const resultDiv = container.querySelector('#scaleResult');
    const scaleOut = container.querySelector('#scaleOutVal');
    const noteOut = container.querySelector('#scaleNoteOut');

    convertBtn.onclick = () => {
        const val = parseFloat(input.value);
        const from = parseFloat(fromSelect.value);
        const to = parseFloat(toSelect.value);

        if (isNaN(val) || val < 0 || val > from) {
            showAlert(`Please enter a valid score between 0 and ${from}.`, 'error');
            return;
        }
        hideAlert();

        const converted = ((val / from) * to).toFixed(2);
        scaleOut.textContent = `${converted} / ${to.toFixed(1)}`;
        noteOut.textContent = `Equivalent ${to.toFixed(1)} Scale Grade`;

        resultDiv.style.display = 'block';
    };
};
