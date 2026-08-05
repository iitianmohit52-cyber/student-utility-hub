import{s as h,h as u}from"./alerts-Cf_U-u9c.js";const m=i=>{i.innerHTML=`
                            <label for="bmiWeight">Weight (kg):</label>
                            <input type="number" id="bmiWeight" placeholder="e.g., 70" min="0">
                            <label for="bmiHeight">Height (cm):</label>
                            <input type="number" id="bmiHeight" placeholder="e.g., 175" min="0">
                            <button id="calculateBmiBtn">Calculate BMI</button>
                            <div id="bmiResult" class="result-area" style="display:none; text-align:center;"></div>
                        `;const c=i.querySelector("#bmiWeight"),n=i.querySelector("#bmiHeight"),g=i.querySelector("#calculateBmiBtn"),s=i.querySelector("#bmiResult");g.onclick=()=>{const r=parseFloat(c.value),o=parseFloat(n.value);if(isNaN(r)||isNaN(o)||r<=0||o<=0){h("Please enter valid positive numbers for weight and height.","error"),s.style.display="none";return}const a=o/100,l=r/(a*a);let e="",t="var(--text-color)";l<18.5?(e="Underweight",t="#3498db"):l<24.9?(e="Normal weight",t="#2ecc71"):l<29.9?(e="Overweight",t="#f1c40f"):l<34.9?(e="Obesity Class I",t="#e67e22"):l<39.9?(e="Obesity Class II",t="#e74c3c"):(e="Obesity Class III (Severe)",t="#c0392b"),s.innerHTML=`Your BMI: <strong style="font-size:1.5em;">${l.toFixed(2)}</strong><br>
                                                Category: <strong style="color:${t};">${e}</strong>`,s.style.display="block",u()}};export{m as default};
