import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="ciPrincipal">Initial Principal ($ / ₹):</label>
            <input type="number" id="ciPrincipal" placeholder="10000" value="10000">

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1rem;">
                <div>
                    <label for="ciRate">Annual Interest Rate (%):</label>
                    <input type="number" id="ciRate" step="0.1" placeholder="8" value="8">
                </div>
                <div>
                    <label for="ciYears">Investment Period (Years):</label>
                    <input type="number" id="ciYears" placeholder="5" value="5">
                </div>
            </div>

            <label for="ciFrequency" style="margin-top:1rem;">Compounding Frequency:</label>
            <select id="ciFrequency">
                <option value="1">Annually (1x / year)</option>
                <option value="4">Quarterly (4x / year)</option>
                <option value="12" selected>Monthly (12x / year)</option>
                <option value="365">Daily (365x / year)</option>
            </select>

            <button id="calcCiBtn" style="margin-top:1.2rem;">💹 Calculate Compound Interest</button>

            <div id="ciResult" class="result-area" style="display:none; margin-top:1.2rem; text-align:center;">
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.5rem;">
                    <div>
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Total Balance:</span>
                        <h4 id="ciTotalOut" style="color:var(--accent-color); font-size:1.3rem; margin-top:0.3rem;">--</h4>
                    </div>
                    <div>
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Interest Earned:</span>
                        <h4 id="ciInterestOut" style="color:#4ade80; font-size:1.3rem; margin-top:0.3rem;">--</h4>
                    </div>
                    <div>
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Principal:</span>
                        <h4 id="ciPrincipalOut" style="color:var(--text-primary); font-size:1.3rem; margin-top:0.3rem;">--</h4>
                    </div>
                </div>
            </div>
        </div>
    `;

    const principalInput = container.querySelector('#ciPrincipal');
    const rateInput = container.querySelector('#ciRate');
    const yearsInput = container.querySelector('#ciYears');
    const freqSelect = container.querySelector('#ciFrequency');
    const calcBtn = container.querySelector('#calcCiBtn');
    const resultDiv = container.querySelector('#ciResult');
    const totalOut = container.querySelector('#ciTotalOut');
    const interestOut = container.querySelector('#ciInterestOut');
    const principalOut = container.querySelector('#ciPrincipalOut');

    calcBtn.onclick = () => {
        const P = parseFloat(principalInput.value);
        const r = parseFloat(rateInput.value) / 100;
        const t = parseFloat(yearsInput.value);
        const n = parseInt(freqSelect.value, 10);

        if (isNaN(P) || isNaN(r) || isNaN(t) || P <= 0 || t <= 0) {
            showAlert('Please enter valid positive values.', 'error');
            return;
        }
        hideAlert();

        const A = P * Math.pow(1 + (r / n), n * t);
        const interest = A - P;

        totalOut.textContent = `$${A.toFixed(2)}`;
        interestOut.textContent = `$${interest.toFixed(2)}`;
        principalOut.textContent = `$${P.toFixed(2)}`;

        resultDiv.style.display = 'block';
    };
};
