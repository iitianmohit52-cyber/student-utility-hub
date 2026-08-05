import{h as c,s as d}from"./alerts-Cf_U-u9c.js";const b=o=>{o.innerHTML=`
                            <textarea id="b64Input" placeholder="Enter text to encode or Base64 to decode" rows="5"></textarea>
                            <button id="b64EncodeBtn">Encode to Base64</button>
                            <button id="b64DecodeBtn">Decode from Base64</button>
                            <label for="b64Output" style="margin-top:1rem; display:block;">Result:</label>
                            <textarea id="b64Output" readonly rows="5"></textarea>
                        `;const a=o.querySelector("#b64Input"),n=o.querySelector("#b64Output"),l=o.querySelector("#b64EncodeBtn"),s=o.querySelector("#b64DecodeBtn");l.onclick=()=>{try{const e=new TextEncoder().encode(a.value);let r="";e.forEach(t=>r+=String.fromCharCode(t)),n.value=btoa(r),c()}catch(e){d("Error encoding: "+e.message,"error"),n.value=""}},s.onclick=()=>{try{const e=atob(a.value),r=new Uint8Array(e.length);for(let t=0;t<e.length;t++)r[t]=e.charCodeAt(t);n.value=new TextDecoder().decode(r),c()}catch(e){d("Error decoding: Invalid Base64 string or character issue. "+e.message,"error"),n.value=""}}};export{b as default};
