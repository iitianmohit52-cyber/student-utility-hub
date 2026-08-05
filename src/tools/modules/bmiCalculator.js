import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        container.innerHTML = `
                            <label for="bmiWeight">Weight (kg):</label>
                            <input type="number" id="bmiWeight" placeholder="e.g., 70" min="0">
                            <label for="bmiHeight">Height (cm):</label>
                            <input type="number" id="bmiHeight" placeholder="e.g., 175" min="0">
                            <button id="calculateBmiBtn">Calculate BMI</button>
                            <div id="bmiResult" class="result-area" style="display:none; text-align:center;"></div>
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
                            const heightM = heightCm / 100;
                            const bmi = weight / (heightM * heightM);
                            let category = '';
                            let color = 'var(--text-color)';


                            if (bmi < 18.5) { category = 'Underweight'; color = '#3498db'; } // Blue
                            else if (bmi < 24.9) { category = 'Normal weight'; color = '#2ecc71'; } // Green
                            else if (bmi < 29.9) { category = 'Overweight'; color = '#f1c40f'; } // Yellow
                            else if (bmi < 34.9) { category = 'Obesity Class I'; color = '#e67e22'; } // Orange
                            else if (bmi < 39.9) { category = 'Obesity Class II'; color = '#e74c3c'; } // Red
                            else { category = 'Obesity Class III (Severe)'; color = '#c0392b'; } // Darker Red




                            resultDiv.innerHTML = `Your BMI: <strong style="font-size:1.5em;">${bmi.toFixed(2)}</strong><br>
                                                Category: <strong style="color:${color};">${category}</strong>`;
                            resultDiv.style.display = 'block';
                            hideAlert();
                        };
                    };
