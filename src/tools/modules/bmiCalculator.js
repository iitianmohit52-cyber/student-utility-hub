import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div>
                    <label for="bmiWeight">Weight (kg):</label>
                    <input type="number" id="bmiWeight" placeholder="e.g., 70" min="1" max="500" step="0.1">
                </div>
                <div>
                    <label for="bmiHeight">Height (cm):</label>
                    <input type="number" id="bmiHeight" placeholder="e.g., 175" min="30" max="300" step="0.5">
                </div>
            </div>

            <button id="calculateBmiBtn" style="margin-top:1.2rem;">⚖️ Calculate BMI</button>

            <div id="bmiResult" class="result-area" style="display:none; text-align:center; margin-top:1.2rem;"></div>
        </div>
    `;

    const weightInput = container.querySelector('#bmiWeight');
    const heightInput = container.querySelector('#bmiHeight');
    const calculateBtn = container.querySelector('#calculateBmiBtn');
    const resultDiv = container.querySelector('#bmiResult');

    calculateBtn.onclick = () => {
        const weight = parseFloat(weightInput.value);
        const heightCm = parseFloat(heightInput.value);

        if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
            showAlert('Please enter valid positive numbers for weight and height.', 'error');
            resultDiv.style.display = 'none';
            return;
        }

        hideAlert();
        const heightM = heightCm / 100;
        const bmi = weight / (heightM * heightM);
        let category = '';
        let color = 'var(--text-primary)';

        // Standard WHO Classification
        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#38bdf8'; // Sky blue
        } else if (bmi < 25.0) {
            category = 'Normal weight (Healthy)';
            color = '#22c55e'; // Green
        } else if (bmi < 30.0) {
            category = 'Overweight';
            color = '#eab308'; // Amber
        } else if (bmi < 35.0) {
            category = 'Obesity Class I (Moderate)';
            color = '#f97316'; // Orange
        } else if (bmi < 40.0) {
            category = 'Obesity Class II (Severe)';
            color = '#ef4444'; // Red
        } else {
            category = 'Obesity Class III (Very Severe)';
            color = '#b91c1c'; // Dark Red
        }

        // Ideal weight range for height
        const minIdeal = (18.5 * heightM * heightM).toFixed(1);
        const maxIdeal = (24.9 * heightM * heightM).toFixed(1);

        resultDiv.innerHTML = `
            <p style="color:var(--text-secondary); margin-bottom:0.2rem;">Your Calculated Body Mass Index</p>
            <h2 style="font-size:2.6rem; color:${color}; margin:0.3rem 0;">${bmi.toFixed(2)}</h2>
            <p style="font-size:1.1rem; font-weight:700; color:${color}; margin-bottom:0.8rem;">Category: ${category}</p>
            <div style="background:var(--surface-color); padding:0.8rem; border-radius:6px; border:1px solid var(--tool-card-border); font-size:0.9rem; color:var(--text-secondary);">
                Ideal healthy weight range for ${heightCm} cm: <strong>${minIdeal} kg – ${maxIdeal} kg</strong>
            </div>
        `;
        resultDiv.style.display = 'block';
    };
};
