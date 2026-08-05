import{h as R,s as D}from"./alerts-Cf_U-u9c.js";const P=e=>{e.innerHTML=`
                            <div class="tabs">
                                <button class="tab-button active" data-tab="timerTab">Timer</button>
                                <button class="tab-button" data-tab="stopwatchTab">Stopwatch</button>
                            </div>


                            <div id="timerTab" class="tab-content" style="padding-top:1rem;">
                                <h3>Timer</h3>
                                <div style="display:flex; justify-content:space-around; margin-bottom:1rem;">
                                    <div><label for="timerHours">Hours:</label><br><input type="number" id="timerHours" min="0" max="99" value="0" style="width:60px;"></div>
                                    <div><label for="timerMinutes">Mins:</label><br><input type="number" id="timerMinutes" min="0" max="59" value="5" style="width:60px;"></div>
                                    <div><label for="timerSeconds">Secs:</label><br><input type="number" id="timerSeconds" min="0" max="59" value="0" style="width:60px;"></div>
                                </div>
                                <div class="timer-display" id="timerDisplay">00:05:00</div>
                                <div style="text-align:center;">
                                    <button id="timerStart">Start</button>
                                    <button id="timerPause" disabled>Pause</button>
                                    <button id="timerReset">Reset</button>
                                </div>
                            </div>


                            <div id="stopwatchTab" class="tab-content" style="display:none; padding-top:1rem;">
                                <h3>Stopwatch</h3>
                                <div class="stopwatch-display" id="stopwatchDisplay">00:00:00.00</div>
                                <div style="text-align:center; margin-bottom:1rem;">
                                    <button id="stopwatchStart">Start</button>
                                    <button id="stopwatchStop" disabled>Stop</button>
                                    <button id="stopwatchReset" disabled>Reset</button>
                                    <button id="stopwatchLap" disabled>Lap</button>
                                </div>
                                <ul id="lapsList" class="laps-list"></ul>
                            </div>
                        `;const g=e.querySelectorAll(".tab-button"),$=e.querySelectorAll(".tab-content");g.forEach(t=>{t.onclick=()=>{g.forEach(a=>a.classList.remove("active")),t.classList.add("active"),$.forEach(a=>a.style.display="none"),e.querySelector(`#${t.dataset.tab}`).style.display="block",t.dataset.tab==="timerTab"?w(!1):x(!1)}});const l=e.querySelector("#timerHours"),i=e.querySelector("#timerMinutes"),r=e.querySelector("#timerSeconds"),y=e.querySelector("#timerDisplay"),d=e.querySelector("#timerStart"),c=e.querySelector("#timerPause"),B=e.querySelector("#timerReset");let u,s,o=!1;function q(){const t=Math.floor(s/3600),a=Math.floor(s%3600/60),b=s%60;y.textContent=`${String(t).padStart(2,"0")}:${String(a).padStart(2,"0")}:${String(b).padStart(2,"0")}`}function p(){const t=parseInt(l.value)||0,a=parseInt(i.value)||0,b=parseInt(r.value)||0;s=t*3600+a*60+b,q()}[l,i,r].forEach(t=>{t.onchange=()=>{o||p()},t.onkeyup=()=>{o||p()}}),d.onclick=()=>{if(!o){if((s===void 0||s===0)&&p(),s<=0){D("Set a duration greater than 0.","error");return}R(),o=!0,d.disabled=!0,c.disabled=!1,[l,i,r].forEach(t=>t.disabled=!0),u=setInterval(()=>{if(s>0)s--,q();else{clearInterval(u),o=!1,y.textContent="Time's Up!",D("Timer finished!","success"),d.disabled=!1,c.disabled=!0,[l,i,r].forEach(t=>t.disabled=!1);try{new Audio("https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3").play()}catch{}}},1e3)}},c.onclick=()=>{clearInterval(u),o=!1,d.disabled=!1,c.disabled=!0,[l,i,r].forEach(t=>t.disabled=!1)};function w(t=!0){clearInterval(u),o=!1,t&&(l.value="0",i.value="5",r.value="0"),p(),d.disabled=!1,c.disabled=!0,[l,i,r].forEach(a=>a.disabled=!1),R(),y.textContent="00:05:00",t&&p()}B.onclick=()=>w(!0);const M=e.querySelector("#stopwatchDisplay"),m=e.querySelector("#stopwatchStart"),f=e.querySelector("#stopwatchStop"),I=e.querySelector("#stopwatchReset"),h=e.querySelector("#stopwatchLap"),L=e.querySelector("#lapsList");let S,k,n=0,E=1,v=!1;function T(t){const a=Math.floor(t/1e3),b=Math.floor(a/60),C=a%60,H=Math.floor(t%1e3/10);return`${String(b).padStart(2,"0")}:${String(C).padStart(2,"0")}.${String(H).padStart(2,"0")}`}m.onclick=()=>{v||(v=!0,k=Date.now()-n,S=setInterval(()=>{n=Date.now()-k,M.textContent=T(n)},10),m.disabled=!0,f.disabled=!1,h.disabled=!1,I.disabled=!1)},f.onclick=()=>{clearInterval(S),v=!1,m.disabled=!1,f.disabled=!0,h.disabled=n===0};function x(t=!1){clearInterval(S),v=!1,n=0,E=1,M.textContent=T(0),t||(L.innerHTML=""),m.disabled=!1,f.disabled=!0,h.disabled=!0,I.disabled=!0}I.onclick=()=>x(!1),h.onclick=()=>{if(n>0){const t=n,a=document.createElement("li");a.textContent=`Lap ${E++}: ${T(t)}`,L.prepend(a)}},w(!0),x(!1),window.currentToolCleanup=()=>{clearInterval(u),clearInterval(S)}};export{P as default};
