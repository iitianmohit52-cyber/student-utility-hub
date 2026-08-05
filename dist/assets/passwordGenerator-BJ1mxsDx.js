import{s as a,h as y}from"./alerts-Cf_U-u9c.js";const f=r=>{r.innerHTML=`
                            <label for="passLength">Password Length:</label>
                            <input type="number" id="passLength" value="16" min="8" max="128">
                            <div class="option-group">
                                <input type="checkbox" id="incUppercase" checked> <label for="incUppercase">Uppercase (A-Z)</label><br>
                                <input type="checkbox" id="incLowercase" checked> <label for="incLowercase">Lowercase (a-z)</label><br>
                                <input type="checkbox" id="incNumbers" checked> <label for="incNumbers">Numbers (0-9)</label><br>
                                <input type="checkbox" id="incSymbols" checked> <label for="incSymbols">Symbols (!@#$%^&*)</label>
                            </div>
                            <button id="generatePassBtn">Generate Password</button>
                            <div class="result-area" style="margin-top:1rem; display:flex; align-items:center; justify-content:space-between;">
                                <input type="text" id="generatedPassword" readonly style="flex-grow:1; margin-right:10px; background-color: var(--background-color); border: 1px solid var(--tool-card-background); color: var(--text-color);">
                                <button id="copyPassBtn" title="Copy to Clipboard" style="padding: 0.5em 0.8em;">📋</button>
                            </div>
                        `;const p=r.querySelector("#passLength"),d=r.querySelector("#incUppercase"),i=r.querySelector("#incLowercase"),h=r.querySelector("#incNumbers"),u=r.querySelector("#incSymbols"),b=r.querySelector("#generatePassBtn"),c=r.querySelector("#generatedPassword"),m=r.querySelector("#copyPassBtn"),e={uppercase:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",lowercase:"abcdefghijklmnopqrstuvwxyz",numbers:"0123456789",symbols:"!@#$%^&*()_+-=[]{}|;:,.<>?"};b.onclick=()=>{const s=parseInt(p.value);let t="",o="";if(d.checked&&(t+=e.uppercase,o+=e.uppercase[Math.floor(Math.random()*e.uppercase.length)]),i.checked&&(t+=e.lowercase,o+=e.lowercase[Math.floor(Math.random()*e.lowercase.length)]),h.checked&&(t+=e.numbers,o+=e.numbers[Math.floor(Math.random()*e.numbers.length)]),u.checked&&(t+=e.symbols,o+=e.symbols[Math.floor(Math.random()*e.symbols.length)]),t===""){a("Please select at least one character type.","error"),c.value="";return}if(s<8||s>128){a("Password length must be between 8 and 128.","error");return}if(s<o.length){a("Password length is too short to include one of each selected character type.","error");return}let l=o;for(let n=o.length;n<s;n++)l+=t.charAt(Math.floor(Math.random()*t.length));l=l.split("").sort(()=>.5-Math.random()).join(""),c.value=l,y()},m.onclick=()=>{c.value&&navigator.clipboard.writeText(c.value).then(()=>a("Password copied to clipboard!","success")).catch(s=>a("Failed to copy password.","error"))}};export{f as default};
