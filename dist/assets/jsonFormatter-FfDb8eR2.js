import{s as e}from"./alerts-Cf_U-u9c.js";const m=o=>{o.innerHTML=`
                            <textarea id="jsonInput" placeholder="Paste your JSON data here..." rows="7"></textarea>
                            <div style="display:flex; align-items:center; margin-bottom:1rem;">
                                <label for="jsonSpaces" style="margin-right:10px; margin-bottom:0;">Indentation:</label>
                                <select id="jsonSpaces" style="width:auto; margin-bottom:0;">
                                    <option value="2">2 Spaces</option>
                                    <option value="4" selected>4 Spaces</option>
                                    <option value="tab">Tabs</option>
                                </select>
                                <button id="formatJsonBtn" style="margin-left:auto;">Format JSON</button>
                            </div>
                            <label for="jsonOutput" style="display:block; margin-bottom:0.5rem;">Formatted JSON:
                                <button id="copyJsonBtn" style="float:right; padding:0.3em 0.6em; margin-top:-5px;">Copy</button>
                            </label>
                            <textarea id="jsonOutput" readonly rows="7"></textarea>
                        `;const l=o.querySelector("#jsonInput"),t=o.querySelector("#jsonOutput"),i=o.querySelector("#formatJsonBtn"),c=o.querySelector("#copyJsonBtn"),p=o.querySelector("#jsonSpaces");i.onclick=()=>{const s=l.value.trim();if(!s){e("Input is empty. Paste some JSON data.","info"),t.value="";return}try{const a=JSON.parse(s),n=p.value;let r;n==="tab"?r="	":r=parseInt(n),t.value=JSON.stringify(a,null,r),e("JSON formatted successfully!","success")}catch(a){t.value=`Error: Invalid JSON

`+a.message,e("Invalid JSON: "+a.message,"error")}},c.onclick=()=>{t.value&&!t.value.startsWith("Error:")?navigator.clipboard.writeText(t.value).then(()=>e("Formatted JSON copied!","success")).catch(s=>e("Failed to copy.","error")):t.value.startsWith("Error:")?e("Cannot copy error message. Please format valid JSON first.","info"):e("Nothing to copy. Format some JSON first.","info")}};export{m as default};
