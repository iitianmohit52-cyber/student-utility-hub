import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="cgpaVal">Enter CGPA (Scale of 10):</label>
            <input type="number" id="cgpaVal" step="0.01" min="0" max="10" placeholder="e.g. 8.5" value="8.5">

            <label for="multiplier" style="margin-top:1rem;">Conversion Formula Standard:</label>
            <select id="multiplier">
                <option value="9.5">CBSE / Standard (CGPA × 9.5)</option>
                <option value="10">Direct Percentage (CGPA × 10)</option>
                <option value="9.0">Mumbai / VTU Formula (CGPA × 9.0)</option>
            </select>

            <button id="calcCgpaBtn" style="margin-top:1.2rem;">🎓 Convert CGPA to Percentage</button>

            <div id="cgpaResult" class="result-area" style="display:none; margin-top:1.2rem; text-align:center;">
                <p style="font-size:1.1rem; color:var(--text-secondary);">Equivalent Percentage:</p>
                <h3 id="pctOutputVal" style="font-size:2rem; color:var(--accent-color); margin:0.5rem 0;">--</h3>
                <p id="gradeOutputVal" style="font-weight:600; color:var(--text-primary);"></p>
            </div>
        </div>
    `;

    const cgpaInput = container.querySelector('#cgpaVal');
    const multiplierSelect = container.querySelector('#multiplier');
    const calcBtn = container.querySelector('#calcCgpaBtn');
    const resultDiv = container.querySelector('#cgpaResult');
    const pctOut = container.querySelector('#pctOutputVal');
    const gradeOut = container.querySelector('#gradeOutputVal');

    calcBtn.onclick = () => {
        const cgpa = parseFloat(cgpaInput.value);
        const mult = parseFloat(multiplierSelect.value);

        if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
            showAlert('Please enter a valid CGPA between 0 and 10.', 'error');
            return;
        }
        hideAlert();

        const pct = (cgpa * mult).toFixed(2);
        pctOut.textContent = `${pct}%`;

        let gradeClass = 'First Class Distinction';
        if (cgpa >= 9) gradeClass = 'O (Outstanding / Distinction)';
        else if (cgpa >= 8) gradeClass = 'A+ (Excellent / First Class)';
        else if (cgpa >= 7) gradeClass = 'A (Very Good)';
        else if (cgpa >= 6) gradeClass = 'B (Good / Second Class)';
        else if (cgpa >= 5) gradeClass = 'C (Average)';
        else gradeClass = 'Pass / Needs Improvement';

        gradeOut.textContent = `Grade Classification: ${gradeClass}`;
        resultDiv.style.display = 'block';
    };
};
