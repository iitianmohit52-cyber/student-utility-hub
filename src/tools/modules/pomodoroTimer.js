import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
    container.innerHTML = `
        <div class="tool-form" style="text-align:center;">
            <div id="pomoModeDisplay" style="font-size:1.1rem; font-weight:700; color:var(--accent-color); margin-bottom:0.5rem;">🧠 Work Session (25 Min)</div>
            <div id="pomoTime" style="font-size:3.5rem; font-weight:800; font-family:monospace; margin:1rem 0; color:var(--text-primary);">25:00</div>

            <div style="display:flex; justify-content:center; gap:0.8rem; margin-bottom:1.5rem;">
                <button type="button" id="startPomoBtn" class="primary-btn">▶️ Start</button>
                <button type="button" id="pausePomoBtn" class="tool-button" style="display:none;">⏸️ Pause</button>
                <button type="button" id="resetPomoBtn" class="tool-button">🔄 Reset</button>
            </div>

            <div style="display:flex; justify-content:center; gap:0.5rem;">
                <button type="button" id="btnWork25" class="tool-button" style="padding:0.4rem 0.8rem; font-size:0.85rem;">25m Work</button>
                <button type="button" id="btnBreak5" class="tool-button" style="padding:0.4rem 0.8rem; font-size:0.85rem;">5m Break</button>
                <button type="button" id="btnBreak15" class="tool-button" style="padding:0.4rem 0.8rem; font-size:0.85rem;">15m Long Break</button>
            </div>
        </div>
    `;

    const modeDisplay = container.querySelector('#pomoModeDisplay');
    const timeDisplay = container.querySelector('#pomoTime');
    const startBtn = container.querySelector('#startPomoBtn');
    const pauseBtn = container.querySelector('#pausePomoBtn');
    const resetBtn = container.querySelector('#resetPomoBtn');

    let totalSeconds = 25 * 60;
    let timerId = null;
    let isWork = true;

    function updateDisplay() {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        timeDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function setTimer(minutes, modeName, isWorkSession) {
        clearInterval(timerId);
        timerId = null;
        totalSeconds = minutes * 60;
        isWork = isWorkSession;
        modeDisplay.textContent = modeName;
        startBtn.style.display = 'inline-flex';
        pauseBtn.style.display = 'none';
        updateDisplay();
    }

    startBtn.onclick = () => {
        if (timerId) return;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-flex';
        timerId = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateDisplay();
            } else {
                clearInterval(timerId);
                timerId = null;
                startBtn.style.display = 'inline-flex';
                pauseBtn.style.display = 'none';
                if (isWork) {
                    showAlert('🎉 Work session complete! Take a break.', 'success');
                    setTimer(5, '☕ Short Break (5 Min)', false);
                } else {
                    showAlert('🔔 Break over! Ready to focus?', 'info');
                    setTimer(25, '🧠 Work Session (25 Min)', true);
                }
            }
        }, 1000);
    };

    pauseBtn.onclick = () => {
        clearInterval(timerId);
        timerId = null;
        startBtn.style.display = 'inline-flex';
        pauseBtn.style.display = 'none';
    };

    resetBtn.onclick = () => {
        setTimer(25, '🧠 Work Session (25 Min)', true);
    };

    container.querySelector('#btnWork25').onclick = () => setTimer(25, '🧠 Work Session (25 Min)', true);
    container.querySelector('#btnBreak5').onclick = () => setTimer(5, '☕ Short Break (5 Min)', false);
    container.querySelector('#btnBreak15').onclick = () => setTimer(15, '🌴 Long Break (15 Min)', false);

    window.currentToolCleanup = () => {
        if (timerId) clearInterval(timerId);
    };
};
