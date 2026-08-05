import{s as i,h as d}from"./alerts-Cf_U-u9c.js";const y=e=>{e.innerHTML=`
                            <label for="birthDate">Enter your Date of Birth:</label>
                            <input type="date" id="birthDate">
                            <button id="calculateAgeBtn">Calculate Age</button>
                            <div id="ageResult" class="result-area" style="display:none;"></div>
                        `;const u=e.querySelector("#birthDate"),g=e.querySelector("#calculateAgeBtn"),a=e.querySelector("#ageResult");g.onclick=()=>{const o=u.value;if(!o){i("Please enter your date of birth.","error"),a.style.display="none";return}const r=new Date(o),t=new Date;if(r>t){i("Birth date cannot be in the future.","error"),a.style.display="none";return}let s=t.getFullYear()-r.getFullYear(),l=t.getMonth()-r.getMonth(),n=t.getDate()-r.getDate();if(n<0){l--;const c=new Date(t.getFullYear(),t.getMonth(),0);n+=c.getDate()}l<0&&(s--,l+=12),a.innerHTML=`You are: <br>
                                                    <strong>${s}</strong> years,
                                                    <strong>${l}</strong> months, and
                                                    <strong>${n}</strong> days old.`,a.style.display="block",d()}};export{y as default};
