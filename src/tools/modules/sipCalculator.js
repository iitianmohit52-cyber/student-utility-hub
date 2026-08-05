import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        container.innerHTML = `
                            <label for="monthlyInvestment">Monthly Investment (₹):</label>
                            <input type="number" id="monthlyInvestment" placeholder="e.g., 5000" min="0">
                            <label for="expectedReturnRate">Expected Annual Return Rate (%):</label>
                            <input type="number" id="expectedReturnRate" placeholder="e.g., 12" min="0" step="0.01">
                            <label for="investmentDuration">Investment Duration (years):</label>
                            <input type="number" id="investmentDuration" placeholder="e.g., 10" min="1">
                            <button id="calculateSipBtn">Calculate Future Value</button>
                            <div id="sipResult" class="result-area" style="display:none;"></div>
                        `;
                        const monthlyInvestmentInput = container.querySelector('#monthlyInvestment');
                        const returnRateInput = container.querySelector('#expectedReturnRate');
                        const durationInput = container.querySelector('#investmentDuration');
                        const calculateBtn = container.querySelector('#calculateSipBtn');
                        const resultDiv = container.querySelector('#sipResult');


                        calculateBtn.onclick = () => {
                            const P = parseFloat(monthlyInvestmentInput.value);
                            const annualRate = parseFloat(returnRateInput.value);
                            const t_years = parseInt(durationInput.value);


                            if (isNaN(P) || isNaN(annualRate) || isNaN(t_years) || P <= 0 || annualRate < 0 || t_years <= 0) {
                                showAlert('Please enter valid positive numbers for investment & duration, and a non-negative rate.', 'error');
                                resultDiv.style.display = 'none';
                                return;
                            }


                            const n = t_years * 12;
                            const i = annualRate / 12 / 100;
                            let M;


                            if (i === 0) { // Handle zero interest rate for SIP
                                M = P * n;
                            } else {
                                M = P * ( (Math.pow(1 + i, n) - 1) / i ) * (1 + i);
                            }
                            
                            const totalInvestment = P * n;
                            const wealthGained = M - totalInvestment;


                            resultDiv.innerHTML = `Invested Amount: <strong>₹${totalInvestment.toFixed(2)}</strong><br>
                                                Estimated Returns: <strong>₹${wealthGained.toFixed(2)}</strong><br>
                                                Total Future Value: <strong>₹${M.toFixed(2)}</strong>`;
                            resultDiv.style.display = 'block';
                            hideAlert();
                        };
                    };
