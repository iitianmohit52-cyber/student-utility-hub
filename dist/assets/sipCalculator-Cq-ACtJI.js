import{s as v,h as y}from"./alerts-Cf_U-u9c.js";const h=e=>{e.innerHTML=`
                            <label for="monthlyInvestment">Monthly Investment (₹):</label>
                            <input type="number" id="monthlyInvestment" placeholder="e.g., 5000" min="0">
                            <label for="expectedReturnRate">Expected Annual Return Rate (%):</label>
                            <input type="number" id="expectedReturnRate" placeholder="e.g., 12" min="0" step="0.01">
                            <label for="investmentDuration">Investment Duration (years):</label>
                            <input type="number" id="investmentDuration" placeholder="e.g., 10" min="1">
                            <button id="calculateSipBtn">Calculate Future Value</button>
                            <div id="sipResult" class="result-area" style="display:none;"></div>
                        `;const i=e.querySelector("#monthlyInvestment"),c=e.querySelector("#expectedReturnRate"),p=e.querySelector("#investmentDuration"),d=e.querySelector("#calculateSipBtn"),a=e.querySelector("#sipResult");d.onclick=()=>{const t=parseFloat(i.value),s=parseFloat(c.value),r=parseInt(p.value);if(isNaN(t)||isNaN(s)||isNaN(r)||t<=0||s<0||r<=0){v("Please enter valid positive numbers for investment & duration, and a non-negative rate.","error"),a.style.display="none";return}const o=r*12,n=s/12/100;let l;n===0?l=t*o:l=t*((Math.pow(1+n,o)-1)/n)*(1+n);const u=t*o,m=l-u;a.innerHTML=`Invested Amount: <strong>₹${u.toFixed(2)}</strong><br>
                                                Estimated Returns: <strong>₹${m.toFixed(2)}</strong><br>
                                                Total Future Value: <strong>₹${l.toFixed(2)}</strong>`,a.style.display="block",y()}};export{h as default};
