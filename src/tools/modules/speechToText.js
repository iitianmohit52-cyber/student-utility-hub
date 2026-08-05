import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        container.innerHTML = `
                            <p>Click "Start Listening" and speak into your microphone. Allow microphone access when prompted.</p>
                            <button id="sttStartBtn">Start Listening</button>
                            <button id="sttStopBtn" disabled>Stop Listening</button>
                            <textarea id="sttOutput" placeholder="Transcript will appear here..." readonly rows="6"></textarea>
                        `;
                        const startBtn = container.querySelector('#sttStartBtn');
                        const stopBtn = container.querySelector('#sttStopBtn');
                        const outputArea = container.querySelector('#sttOutput');


                        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                        if (!SpeechRecognition) {
                            container.innerHTML = '<p>Speech Recognition API is not supported in your browser.</p>';
                            return;
                        }
                        const recognition = new SpeechRecognition();
                        recognition.continuous = true;
                        recognition.interimResults = true;
                        recognition.lang = navigator.language || 'en-US'; // Use browser's language


                        let finalTranscript = '';


                        recognition.onstart = () => {
                            startBtn.disabled = true;
                            stopBtn.disabled = false;
                            showAlert('Listening... Speak clearly.', 'info');
                        };
                        recognition.onend = () => {
                            startBtn.disabled = false;
                            stopBtn.disabled = true;
                            if (outputArea.value.trim() === '') hideAlert(); // Keep "Listening" if no final output yet
                            else if (finalTranscript.trim() !== '') showAlert('Stopped listening.', 'success');
                            else showAlert('Stopped. No speech clearly recognized.', 'info');
                        };
                        recognition.onerror = (event) => {
                            let errorMessage = `Speech recognition error: ${event.error}`;
                            if (event.error === 'no-speech') {
                                errorMessage = 'No speech was detected. Try speaking louder or closer to the microphone.';
                            } else if (event.error === 'audio-capture') {
                                errorMessage = 'Audio capture failed. Ensure your microphone is working and permitted.';
                            } else if (event.error === 'not-allowed') {
                                errorMessage = 'Microphone access denied. Please allow access in browser settings.';
                            }
                            showAlert(errorMessage, 'error');
                            startBtn.disabled = false;
                            stopBtn.disabled = true;
                        };
                        recognition.onresult = (event) => {
                            let interimTranscript = '';
                            for (let i = event.resultIndex; i < event.results.length; ++i) {
                                if (event.results[i].isFinal) {
                                    finalTranscript += event.results[i][0].transcript + ' ';
                                } else {
                                    interimTranscript += event.results[i][0].transcript;
                                }
                            }
                            outputArea.value = finalTranscript + interimTranscript;
                            if (interimTranscript) hideAlert(); // Hide general alerts if interim results are coming
                        };


                        startBtn.onclick = () => {
                            finalTranscript = ''; // Reset final transcript
                            outputArea.value = '';
                            try {
                                recognition.start();
                            } catch (e) { // Catch if already started
                                if (e.name === 'InvalidStateError') {
                                    recognition.stop(); // Stop first, then it will be restartable on next click or via onend
                                    showAlert('Recognition was already active. Try again.', 'info');
                                } else {
                                    showAlert('Could not start recognition: ' + e.message, 'error');
                                }
                            }
                        };
                        stopBtn.onclick = () => recognition.stop();
                        
                        window.currentToolCleanup = () => {
                            if (recognition) {
                                try { recognition.stop(); } catch(e){}
                            }
                        };
                    };
