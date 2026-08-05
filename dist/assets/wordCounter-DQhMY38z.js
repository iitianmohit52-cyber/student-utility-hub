const q=e=>{e.innerHTML=`
                            <textarea id="wcText" placeholder="Paste or type your text here..." rows="8"></textarea>
                            <div id="wcResult" class="result-area" style="margin-top:1rem;">
                                Words: <strong id="wcWords">0</strong><br>
                                Characters (with spaces): <strong id="wcCharsWithSpaces">0</strong><br>
                                Characters (no spaces): <strong id="wcCharsNoSpaces">0</strong><br>
                                Spaces: <strong id="wcSpaces">0</strong><br>
                                Sentences: <strong id="wcSentences">0</strong><br>
                                Paragraphs: <strong id="wcParagraphs">0</strong><br>
                                Reading Time: <strong id="wcReadingTime">~0 min</strong>
                            </div>
                        `;const n=e.querySelector("#wcText"),g=e.querySelector("#wcWords"),h=e.querySelector("#wcCharsWithSpaces"),i=e.querySelector("#wcCharsNoSpaces"),d=e.querySelector("#wcSpaces"),l=e.querySelector("#wcSentences"),S=e.querySelector("#wcParagraphs"),w=e.querySelector("#wcReadingTime");n.oninput=()=>{const t=n.value,a=t.match(/\b[-'\w]+\b/g),c=a?a.length:0,m=t.length,u=t.replace(/\s+/g,"").length,x=(t.match(/\s/g)||[]).length,o=t.match(/[^.!?]+[.!?]+(\s|$)/g),y=o?o.length:t.trim()?1:0,C=t.split(/\n\s*\n/).filter(p=>p.trim()!=="").length||(t.trim()?1:0),s=c/200;let r="";s===0?r="~0 min":s<1?r=`~${Math.round(s*60)} sec`:r=`~${Math.ceil(s)} min`,g.textContent=c,h.textContent=m,i.textContent=u,d.textContent=x,l.textContent=y,S.textContent=C,w.textContent=r}};export{q as default};
