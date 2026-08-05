import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        container.innerHTML = `
                            <textarea id="ttsText" placeholder="Enter text to speak..." rows="6"></textarea>
                            <div class="option-group">
                                <label for="ttsVoice">Voice:</label>
                                <select id="ttsVoice"></select>
                                <label for="ttsRate" style="margin-left:10px;">Rate: <span id="ttsRateVal">1</span></label>
                                <input type="range" id="ttsRate" min="0.5" max="2" value="1" step="0.1" style="vertical-align: middle;">
                                <label for="ttsPitch" style="margin-left:10px;">Pitch: <span id="ttsPitchVal">1</span></label>
                                <input type="range" id="ttsPitch" min="0" max="2" value="1" step="0.1" style="vertical-align: middle;">
                            </div>
                            <button id="ttsSpeakBtn">Speak</button>
                            <button id="ttsPauseBtn">Pause</button>
                            <button id="ttsResumeBtn">Resume</button>
                            <button id="ttsStopBtn">Stop</button>
                        `;
                        const textInput = container.querySelector('#ttsText');
                        const voiceSelect = container.querySelector('#ttsVoice');
                        const rateInput = container.querySelector('#ttsRate');
                        const pitchInput = container.querySelector('#ttsPitch');
                        const rateValSpan = container.querySelector('#ttsRateVal');
                        const pitchValSpan = container.querySelector('#ttsPitchVal');
                        const speakBtn = container.querySelector('#ttsSpeakBtn');
                        const pauseBtn = container.querySelector('#ttsPauseBtn');
                        const resumeBtn = container.querySelector('#ttsResumeBtn');
                        const stopBtn = container.querySelector('#ttsStopBtn');


                        const synth = window.speechSynthesis;
                        if (!synth) {
                            container.innerHTML = "<p>Sorry, your browser doesn't support Text to Speech.</p>";
                            return;
                        }
                        let voices = [];
                        let currentUtterance = null;


                        function populateVoiceList() {
                            voices = synth.getVoices().sort((a,b) => a.name.localeCompare(b.name));
                            const selectedVoiceName = voiceSelect.value;
                            voiceSelect.innerHTML = '';
                            voices.forEach(voice => {
                                const option = document.createElement('option');
                                option.textContent = `${voice.name} (${voice.lang})`;
                                option.value = voice.name;
                                if (voice.default) option.selected = true;
                                voiceSelect.appendChild(option);
                            });
                            if (selectedVoiceName) voiceSelect.value = selectedVoiceName; // Retain selection
                        }


                        populateVoiceList();
                        if (synth.onvoiceschanged !== undefined) {
                            synth.onvoiceschanged = populateVoiceList;
                        }
                        
                        rateInput.oninput = () => rateValSpan.textContent = rateInput.value;
                        pitchInput.oninput = () => pitchValSpan.textContent = pitchInput.value;




                        speakBtn.onclick = () => {
                            if (synth.speaking) { // If speaking, stop current and start new
                                synth.cancel();
                            }
                            if (textInput.value.trim() !== '') {
                                hideAlert();
                                currentUtterance = new SpeechSynthesisUtterance(textInput.value.trim());
                                const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
                                if (selectedVoice) currentUtterance.voice = selectedVoice;
                                currentUtterance.pitch = parseFloat(pitchInput.value);
                                currentUtterance.rate = parseFloat(rateInput.value);
                                currentUtterance.onstart = () => {
                                    speakBtn.disabled = true; pauseBtn.disabled = false; resumeBtn.disabled = true; stopBtn.disabled = false;
                                }
                                currentUtterance.onend = () => {
                                    speakBtn.disabled = false; pauseBtn.disabled = true; resumeBtn.disabled = true; stopBtn.disabled = true;
                                    currentUtterance = null;
                                };
                                currentUtterance.onerror = (e) => {
                                    showAlert(`Error during speech: ${e.error}`, 'error');
                                    speakBtn.disabled = false; pauseBtn.disabled = true; resumeBtn.disabled = true; stopBtn.disabled = true;
                                    currentUtterance = null;
                                };
                                synth.speak(currentUtterance);
                            } else {
                                showAlert('Please enter some text to speak.', 'error');
                            }
                        };
                        pauseBtn.onclick = () => {
                            if(synth.speaking && !synth.paused) {
                                 synth.pause();
                                 pauseBtn.disabled = true; resumeBtn.disabled = false;
                            }
                        };
                        resumeBtn.onclick = () => {
                             if(synth.paused) {
                                synth.resume();
                                pauseBtn.disabled = false; resumeBtn.disabled = true;
                             }
                        };
                        stopBtn.onclick = () => {
                            if(synth.speaking || synth.paused) {
                                synth.cancel(); // This also triggers onend for the utterance
                            }
                             speakBtn.disabled = false; pauseBtn.disabled = true; resumeBtn.disabled = true; stopBtn.disabled = true;
                             currentUtterance = null;
                        };
                         // Initial button states
                        speakBtn.disabled = false; pauseBtn.disabled = true; resumeBtn.disabled = true; stopBtn.disabled = true;


                        window.currentToolCleanup = () => {
                            if (synth && (synth.speaking || synth.paused)) {
                                synth.cancel();
                            }
                        };
                    };
