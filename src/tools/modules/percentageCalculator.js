import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <div style="margin-bottom:1.5rem;">
                <label style="font-weight:600;">1. What is X% of Y?</label>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.5rem; align-items:center;">
                    <input type="number" id="pctP" placeholder="Percentage %" value="15">
                    <input type="number" id="pctTotal" placeholder="Total Y" value="200">
                    <button type="button" id="btnCalcPct1" class="tool-button">Calculate</button>
                </div>
                <div id="resPct1" style="margin-top:0.5rem; font-weight:600; color:var(--accent-color);"></div>
            </div>

            <div style="border-top:1px solid var(--tool-card-border); padding-top:1.5rem; margin-bottom:1.5rem;">
                <label style="font-weight:600;">2. X is what percentage of Y?</label>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.5rem; align-items:center;">
                    <input type="number" id="pctX2" placeholder="Value X" value="30">
                    <input type="number" id="pctY2" placeholder="Total Y" value="150">
                    <button type="button" id="btnCalcPct2" class="tool-button">Calculate</button>
                </div>
                <div id="resPct2" style="margin-top:0.5rem; font-weight:600; color:var(--accent-color);"></div>
            </div>

            <div style="border-top:1px solid var(--tool-card-border); padding-top:1.5rem;">
                <label style="font-weight:600;">3. Percentage Increase / Decrease from X to Y:</label>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.5rem; align-items:center;">
                    <input type="number" id="pctFrom" placeholder="From X" value="100">
                    <input type="number" id="pctTo" placeholder="To Y" value="125">
                    <button type="button" id="btnCalcPct3" class="tool-button">Calculate</button>
                </div>
                <div id="resPct3" style="margin-top:0.5rem; font-weight:600; color:var(--accent-color);"></div>
            </div>
        </div>
    `;

    const p = container.querySelector('#pctP');
    const total = container.querySelector('#pctTotal');
    const btn1 = container.querySelector('#btnCalcPct1');
    const res1 = container.querySelector('#resPct1');

    btn1.onclick = () => {
        const valP = parseFloat(p.value);
        const valT = parseFloat(total.value);
        if (isNaN(valP) || isNaN(valT)) return;
        const ans = (valP / 100) * valT;
        res1.textContent = `Result: ${ans}`;
    };

    const x2 = container.querySelector('#pctX2');
    const y2 = container.querySelector('#pctY2');
    const btn2 = container.querySelector('#btnCalcPct2');
    const res2 = container.querySelector('#resPct2');

    btn2.onclick = () => {
        const valX = parseFloat(x2.value);
        const valY = parseFloat(y2.value);
        if (isNaN(valX) || isNaN(valY) || valY === 0) return;
        const ans = (valX / valY) * 100;
        res2.textContent = `Result: ${ans.toFixed(2)}%`;
    };

    const from = container.querySelector('#pctFrom');
    const to = container.querySelector('#pctTo');
    const btn3 = container.querySelector('#btnCalcPct3');
    const res3 = container.querySelector('#resPct3');

    btn3.onclick = () => {
        const valF = parseFloat(from.value);
        const valT = parseFloat(to.value);
        if (isNaN(valF) || isNaN(valT) || valF === 0) return;
        const diff = valT - valF;
        const ans = (diff / valF) * 100;
        const sign = ans >= 0 ? 'Increase' : 'Decrease';
        res3.textContent = `Result: ${Math.abs(ans).toFixed(2)}% ${sign}`;
    };
};
