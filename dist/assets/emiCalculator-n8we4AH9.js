import{s as i,h as u}from"./alerts-Cf_U-u9c.js";const I=e=>{e.innerHTML=`
                            <label for="loanAmount">Loan Amount (₹):</label>
                            <input type="number" id="loanAmount" placeholder="e.g., 100000" min="0">
                            <label for="interestRate">Annual Interest Rate (%):</label>
                            <input type="number" id="interestRate" placeholder="e.g., 10.5" min="0" step="0.01">
                            <label for="loanTenure">Loan Tenure (months):</label>
                            <input type="number" id="loanTenure" placeholder="e.g., 12" min="1">
                            <button id="calculateEmiBtn">Calculate EMI</button>
                            <div id="emiResult" class="result-area" style="display:none;"></div>
                        `;const c=e.querySelector("#loanAmount"),p=e.querySelector("#interestRate"),d=e.querySelector("#loanTenure"),y=e.querySelector("#calculateEmiBtn"),t=e.querySelector("#emiResult");y.onclick=()=>{const n=parseFloat(c.value),a=parseFloat(p.value),l=parseInt(d.value);if(isNaN(n)||isNaN(a)||isNaN(l)||n<=0||a<0||l<=0){i("Please enter valid positive numbers for amount & tenure, and a non-negative rate.","error"),t.style.display="none";return}if(a===0){const b=n/l;t.innerHTML=`Monthly EMI: <strong>₹${b.toFixed(2)}</strong><br>
                                           Total Interest Payable: <strong>₹0.00</strong><br>
                                           Total Payment (Principal + Interest): <strong>₹${n.toFixed(2)}</strong>`,t.style.display="block",u();return}const o=a/(12*100),r=n*o*Math.pow(1+o,l)/(Math.pow(1+o,l)-1),s=r*l,m=s-n;if(!isFinite(r)){i("Calculation resulted in an invalid number. Please check your inputs.","error"),t.style.display="none";return}t.innerHTML=`Monthly EMI: <strong>₹${r.toFixed(2)}</strong><br>
                                                Total Interest Payable: <strong>₹${m.toFixed(2)}</strong><br>
                                                Total Payment (Principal + Interest): <strong>₹${s.toFixed(2)}</strong>`,t.style.display="block",u()}};export{I as default};
