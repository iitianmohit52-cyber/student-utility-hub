import{h as _}from"./alerts-Cf_U-u9c.js";const U=a=>{const d={length:{name:"Length",items:{meter:1,kilometer:1e3,centimeter:.01,millimeter:.001,mile:1609.34,yard:.9144,foot:.3048,inch:.0254,nautical_mile:1852}},weight:{name:"Weight/Mass",items:{kilogram:1,gram:.001,milligram:1e-6,metric_ton:1e3,pound:.45359237,ounce:.0283495231,stone:6.35029318}},temperature:{name:"Temperature",items:{celsius:"celsius",fahrenheit:"fahrenheit",kelvin:"kelvin"}},area:{name:"Area",items:{square_meter:1,square_kilometer:1e6,square_mile:258998811e-2,square_yard:.836127,square_foot:.092903,acre:4046.86,hectare:1e4}},volume:{name:"Volume",items:{cubic_meter:1,liter:.001,milliliter:1e-6,US_gallon:.00378541,US_quart:946353e-9,US_pint:473176e-9,US_cup:236588e-9,US_fluid_ounce:295735e-10,imperial_gallon:.00454609,imperial_quart:.00113652,imperial_pint:568261e-9,imperial_fluid_ounce:284131e-10}},speed:{name:"Speed",items:{meters_per_second:1,kilometers_per_hour:.277778,miles_per_hour:.44704,knot:.514444}},time:{name:"Time",items:{second:1,minute:60,hour:3600,day:86400,week:604800,month_avg:2629746,year_avg:31556952}}};a.innerHTML=`
                            <label for="ucCategory">Category:</label>
                            <select id="ucCategory"></select>
                            <div style="display:flex; gap:10px; margin-top:10px; align-items:flex-end;">
                                <div style="flex:2">
                                    <label for="ucInputValue">Value:</label>
                                    <input type="number" id="ucInputValue" value="1">
                                </div>
                                <div style="flex:3">
                                    <label for="ucFromUnit">From:</label>
                                    <select id="ucFromUnit"></select>
                                </div>
                                <div style="font-size:1.5rem; padding-bottom:0.5rem;">⇄</div>
                                <div style="flex:3">
                                    <label for="ucToUnit">To:</label>
                                    <select id="ucToUnit"></select>
                                </div>
                            </div>
                            <div id="ucResult" class="result-area" style="margin-top:1rem; font-weight:bold; font-size:1.2rem; text-align:center;">Enter values and see result here</div>
                        `;const m=a.querySelector("#ucCategory"),s=a.querySelector("#ucFromUnit"),l=a.querySelector("#ucToUnit"),v=a.querySelector("#ucInputValue"),c=a.querySelector("#ucResult");function h(){for(const o in d){const n=document.createElement("option");n.value=o,n.textContent=d[o].name,m.appendChild(n)}}function g(o){const n=d[o].items;s.innerHTML="",l.innerHTML="";let i=0;for(const t in n){const e=t.replace(/_/g," ").replace(/\b\w/g,f=>f.toUpperCase()),u=document.createElement("option");u.value=t,u.textContent=e,s.appendChild(u);const r=document.createElement("option");r.value=t,r.textContent=e,l.appendChild(r),i===1&&Object.keys(n).length>1&&(r.selected=!0),i++}Object.keys(n).length===1&&(l.selectedIndex=0)}function p(){const o=m.value,n=s.value,i=l.value,t=parseFloat(v.value);if(isNaN(t)){c.textContent="Invalid input value.",c.style.color="var(--accent-color)";return}_();let e;const u=d[o].items;if(o==="temperature"?n===i?e=t:n==="celsius"?i==="fahrenheit"?e=t*9/5+32:i==="kelvin"&&(e=t+273.15):n==="fahrenheit"?i==="celsius"?e=(t-32)*5/9:i==="kelvin"&&(e=(t-32)*5/9+273.15):n==="kelvin"&&(i==="celsius"?e=t-273.15:i==="fahrenheit"&&(e=(t-273.15)*9/5+32)):e=t*u[n]/u[i],typeof e>"u")c.textContent="Conversion not supported or error.",c.style.color="var(--accent-color)";else{const r=s.options[s.selectedIndex].text,f=l.options[l.selectedIndex].text,y=Math.abs(e)>1e-4||e===0?4:8;c.textContent=`${t} ${r} = ${e.toFixed(y)} ${f}`,c.style.color="var(--text-color)"}}m.onchange=()=>{g(m.value),p()},s.onchange=p,l.onchange=p,v.oninput=p,h(),g(m.value),p()};export{U as default};
