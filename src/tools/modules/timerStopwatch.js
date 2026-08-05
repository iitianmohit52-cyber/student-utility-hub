import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        container.innerHTML = `
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
                        `;


                        const tabButtons = container.querySelectorAll('.tab-button');
                        const tabContents = container.querySelectorAll('.tab-content');
                        tabButtons.forEach(button => {
                            button.onclick = () => {
                                tabButtons.forEach(btn => btn.classList.remove('active'));
                                button.classList.add('active');
                                tabContents.forEach(content => content.style.display = 'none');
                                container.querySelector(`#${button.dataset.tab}`).style.display = 'block';
                                if (button.dataset.tab === 'timerTab') resetTimerState(false); else resetStopwatchState(false);
                            };
                        });


                        // Timer Logic
                        const timerHoursInput = container.querySelector('#timerHours');
                        const timerMinutesInput = container.querySelector('#timerMinutes');
                        const timerSecondsInput = container.querySelector('#timerSeconds');
                        const timerDisplay = container.querySelector('#timerDisplay');
                        const timerStartBtn = container.querySelector('#timerStart');
                        const timerPauseBtn = container.querySelector('#timerPause');
                        const timerResetBtn = container.querySelector('#timerReset');
                        let timerInterval;
                        let timerTotalSeconds;
                        let timerIsRunning = false;


                        function updateTimerDisplayDOM() {
                            const h = Math.floor(timerTotalSeconds / 3600);
                            const m = Math.floor((timerTotalSeconds % 3600) / 60);
                            const s = timerTotalSeconds % 60;
                            timerDisplay.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
                        }
                        
                        function setTimerFromInputs() {
                            const h = parseInt(timerHoursInput.value) || 0;
                            const m = parseInt(timerMinutesInput.value) || 0;
                            const s = parseInt(timerSecondsInput.value) || 0;
                            timerTotalSeconds = (h * 3600) + (m * 60) + s;
                            updateTimerDisplayDOM();
                        }
                        [timerHoursInput, timerMinutesInput, timerSecondsInput].forEach(input => {
                            input.onchange = () => { if (!timerIsRunning) setTimerFromInputs(); };
                            input.onkeyup = () => { if (!timerIsRunning) setTimerFromInputs(); }; // For immediate update
                        });


                        timerStartBtn.onclick = () => {
                            if (timerIsRunning) return; // Already running
                            if (timerTotalSeconds === undefined || timerTotalSeconds === 0) setTimerFromInputs(); // Set if not set from pause or initially 0


                            if (timerTotalSeconds <= 0) {
                                showAlert('Set a duration greater than 0.', 'error');
                                return;
                            }
                            hideAlert();
                            timerIsRunning = true;
                            timerStartBtn.disabled = true;
                            timerPauseBtn.disabled = false;
                            [timerHoursInput, timerMinutesInput, timerSecondsInput].forEach(inp => inp.disabled = true);


                            timerInterval = setInterval(() => {
                                if (timerTotalSeconds > 0) {
                                    timerTotalSeconds--;
                                    updateTimerDisplayDOM();
                                } else {
                                    clearInterval(timerInterval);
                                    timerIsRunning = false;
                                    timerDisplay.textContent = "Time's Up!";
                                    showAlert("Timer finished!", "success");
                                    timerStartBtn.disabled = false;
                                    timerPauseBtn.disabled = true;
                                    [timerHoursInput, timerMinutesInput, timerSecondsInput].forEach(inp => inp.disabled = false);
                                    try { new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3').play(); } catch(e){} // Example sound
                                }
                            }, 1000);
                        };
                        timerPauseBtn.onclick = () => {
                            clearInterval(timerInterval);
                            timerIsRunning = false;
                            timerStartBtn.disabled = false;
                            timerPauseBtn.disabled = true;
                             [timerHoursInput, timerMinutesInput, timerSecondsInput].forEach(inp => inp.disabled = false); // Re-enable inputs on pause
                        };
                        
                        function resetTimerState(showDefaultTime = true) {
                            clearInterval(timerInterval);
                            timerIsRunning = false;
                            if (showDefaultTime) {
                                timerHoursInput.value = '0';
                                timerMinutesInput.value = '5';
                                timerSecondsInput.value = '0';
                            }
                            setTimerFromInputs();
                            timerStartBtn.disabled = false;
                            timerPauseBtn.disabled = true;
                            [timerHoursInput, timerMinutesInput, timerSecondsInput].forEach(inp => inp.disabled = false);
                            hideAlert();
                            timerDisplay.textContent = "00:05:00"; // Reset visual
                            if (showDefaultTime) setTimerFromInputs(); // Recalculate timerTotalSeconds
                        }
                        timerResetBtn.onclick = () => resetTimerState(true);
                        


                        // Stopwatch Logic
                        const stopwatchDisplay = container.querySelector('#stopwatchDisplay');
                        const stopwatchStartBtn = container.querySelector('#stopwatchStart');
                        const stopwatchStopBtn = container.querySelector('#stopwatchStop');
                        const stopwatchResetBtn = container.querySelector('#stopwatchReset');
                        const stopwatchLapBtn = container.querySelector('#stopwatchLap');
                        const lapsList = container.querySelector('#lapsList');
                        let stopwatchInterval;
                        let stopwatchStartTime;
                        let stopwatchElapsedTime = 0;
                        let lapNumber = 1;
                        let stopwatchIsRunning = false;


                        function formatStopwatchTime(ms) {
                            const totalSeconds = Math.floor(ms / 1000);
                            const minutes = Math.floor(totalSeconds / 60);
                            const seconds = totalSeconds % 60;
                            const milliseconds = Math.floor((ms % 1000)/10);
                            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
                        }


                        stopwatchStartBtn.onclick = () => {
                            if (stopwatchIsRunning) return;
                            stopwatchIsRunning = true;
                            stopwatchStartTime = Date.now() - stopwatchElapsedTime;
                            stopwatchInterval = setInterval(() => {
                                stopwatchElapsedTime = Date.now() - stopwatchStartTime;
                                stopwatchDisplay.textContent = formatStopwatchTime(stopwatchElapsedTime);
                            }, 10);
                            stopwatchStartBtn.disabled = true;
                            stopwatchStopBtn.disabled = false;
                            stopwatchLapBtn.disabled = false;
                            stopwatchResetBtn.disabled = false; // Enable reset when running or paused
                        };
                        stopwatchStopBtn.onclick = () => {
                            clearInterval(stopwatchInterval);
                            stopwatchIsRunning = false;
                            stopwatchStartBtn.disabled = false;
                            stopwatchStopBtn.disabled = true;
                            // Lap button can be active if paused with time
                            stopwatchLapBtn.disabled = stopwatchElapsedTime === 0;
                        };
                        function resetStopwatchState(fromTabSwitch = false) {
                            clearInterval(stopwatchInterval);
                            stopwatchIsRunning = false;
                            stopwatchElapsedTime = 0;
                            lapNumber = 1;
                            stopwatchDisplay.textContent = formatStopwatchTime(0);
                            if (!fromTabSwitch) lapsList.innerHTML = ''; // Clear laps only on explicit reset
                            stopwatchStartBtn.disabled = false;
                            stopwatchStopBtn.disabled = true;
                            stopwatchLapBtn.disabled = true;
                            stopwatchResetBtn.disabled = true; // Disabled when at 00:00
                        }
                        stopwatchResetBtn.onclick = () => resetStopwatchState(false);
                        
                        stopwatchLapBtn.onclick = () => {
                            if (stopwatchElapsedTime > 0) {
                                const lapTime = stopwatchElapsedTime;
                                const li = document.createElement('li');
                                li.textContent = `Lap ${lapNumber++}: ${formatStopwatchTime(lapTime)}`;
                                lapsList.prepend(li);
                            }
                        };
                        
                        resetTimerState(true); // Initial call for timer
                        resetStopwatchState(false); // Initial call for stopwatch


                        window.currentToolCleanup = () => {
                            clearInterval(timerInterval);
                            clearInterval(stopwatchInterval);
                        };
                    };
