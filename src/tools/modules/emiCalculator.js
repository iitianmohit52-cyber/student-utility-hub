import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        container.innerHTML = `
                            <label for="loanAmount">Loan Amount (₹):</label>
                            <input type="number" id="loanAmount" placeholder="e.g., 100000" min="0">
                            <label for="interestRate">Annual Interest Rate (%):</label>
                            <input type="number" id="interestRate" placeholder="e.g., 10.5" min="0" step="0.01">
                            <label for="loanTenure">Loan Tenure (months):</label>
                            <input type="number" id="loanTenure" placeholder="e.g., 12" min="1">
                            <button id="calculateEmiBtn">Calculate EMI</button>
                            <div id="emiResult" class="result-area" style="display:none;"></div>
                        `;
                        const amountInput = container.querySelector('#loanAmount');
                        const rateInput = container.querySelector('#interestRate');
                        const tenureInput = container.querySelector('#loanTenure');
                        const calculateBtn = container.querySelector('#calculateEmiBtn');
                        const resultDiv = container.querySelector('#emiResult');


                        calculateBtn.onclick = () => {
                            const P = parseFloat(amountInput.value);
                            const annualRate = parseFloat(rateInput.value);
                            const N = parseInt(tenureInput.value);


                            if (isNaN(P) || isNaN(annualRate) || isNaN(N) || P <= 0 || annualRate < 0 || N <= 0) {
                                showAlert('Please enter valid positive numbers for amount & tenure, and a non-negative rate.', 'error');
                                resultDiv.style.display = 'none';
                                return;
                            }
                            
                            if (annualRate === 0) { // Handle zero interest rate
                                 const EMI = P / N;
                                 resultDiv.innerHTML = `Monthly EMI: <strong>₹${EMI.toFixed(2)}</strong><br>
                                           Total Interest Payable: <strong>₹0.00</strong><br>
                                           Total Payment (Principal + Interest): <strong>₹${P.toFixed(2)}</strong>`;
                                resultDiv.style.display = 'block';
                                hideAlert();
                                return;
                            }




                            const r = annualRate / (12 * 100); // Monthly interest rate
                            const EMI = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
                            const totalPayment = EMI * N;
                            const totalInterest = totalPayment - P;


                            if (!isFinite(EMI)) {
                                showAlert('Calculation resulted in an invalid number. Please check your inputs.', 'error');
                                resultDiv.style.display = 'none';
                                return;
                            }


                            resultDiv.innerHTML = `Monthly EMI: <strong>₹${EMI.toFixed(2)}</strong><br>
                                                Total Interest Payable: <strong>₹${totalInterest.toFixed(2)}</strong><br>
                                                Total Payment (Principal + Interest): <strong>₹${totalPayment.toFixed(2)}</strong>`;
                            resultDiv.style.display = 'block';
                            hideAlert();
                        };
                    };
