import { showAlert, hideAlert } from '../../utils/alerts.js';

export default (container) => {
                        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        container.innerHTML = `
                            <input type="file" id="trimAudioFile" accept="audio/*">
                            <audio id="trimAudioPreview" controls style="width:100%; margin-top:10px; display:none;"></audio>
                            <div id="trimControls" style="display:none; margin-top:10px;">
                                <label for="trimStartTime">Start Time (s):</label>
                                <input type="number" id="trimStartTime" value="0" min="0" step="0.01">
                                <label for="trimEndTime">End Time (s):</label>
                                <input type="number" id="trimEndTime" value="0" min="0" step="0.01">
                                <p id="audioDurationInfo"></p>
                                <button id="trimButton">Trim & Download WAV</button>
                            </div>
                        `;
                        const fileInput = container.querySelector('#trimAudioFile');
                        const audioPreview = container.querySelector('#trimAudioPreview');
                        const trimControls = container.querySelector('#trimControls');
                        const startTimeInput = container.querySelector('#trimStartTime');
                        const endTimeInput = container.querySelector('#trimEndTime');
                        const durationInfo = container.querySelector('#audioDurationInfo');
                        const trimButton = container.querySelector('#trimButton');
                        
                        let sourceBuffer = null;
                        let originalFileName = 'trimmed_audio';


                        fileInput.onchange = (e) => {
                            if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                originalFileName = file.name.split('.')[0] || 'audio';
                                showAlert('Loading audio...', 'info');
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    audioContext.decodeAudioData(event.target.result)
                                        .then(decodedBuffer => {
                                            sourceBuffer = decodedBuffer;
                                            const tempUrl = URL.createObjectURL(file);
                                            audioPreview.src = tempUrl;
                                            audioPreview.style.display = 'block';
                                            audioPreview.onloadedmetadata = () => {
                                                URL.revokeObjectURL(tempUrl); // Revoke after duration is known
                                                const duration = sourceBuffer.duration; // Use buffer duration for accuracy
                                                durationInfo.textContent = `Duration: ${duration.toFixed(2)}s`;
                                                endTimeInput.value = duration.toFixed(2);
                                                endTimeInput.max = duration.toFixed(2);
                                                startTimeInput.max = duration.toFixed(2);
                                                trimControls.style.display = 'block';
                                                showAlert('Audio loaded. Set trim times.', 'success');
                                            };
                                            audioPreview.onerror = () => showAlert('Error playing preview.', 'error');
                                        })
                                        .catch(err => showAlert(`Error decoding audio: ${err.message}`, 'error'));
                                };
                                reader.readAsArrayBuffer(file);
                            } else {
                                 audioPreview.style.display = 'none';
                                 trimControls.style.display = 'none';
                                 audioPreview.src = "";
                                 sourceBuffer = null;
                            }
                        };


                        trimButton.onclick = () => {
                            if (!sourceBuffer) {
                                showAlert('Please load an audio file first.', 'error');
                                return;
                            }
                            const startTime = parseFloat(startTimeInput.value);
                            const endTime = parseFloat(endTimeInput.value);


                            if (isNaN(startTime) || isNaN(endTime) || startTime < 0 || endTime <= startTime || endTime > sourceBuffer.duration) {
                                showAlert('Invalid start/end times. Ensure End Time is after Start Time and within audio duration.', 'error');
                                return;
                            }
                            
                            showAlert('Trimming audio...', 'info');
                            try {
                                const startOffset = Math.floor(startTime * sourceBuffer.sampleRate);
                                const endOffset = Math.floor(endTime * sourceBuffer.sampleRate);
                                const frameCount = endOffset - startOffset;


                                if (frameCount <=0) {
                                    showAlert('Trimmed duration is zero or negative.', 'error');
                                    return;
                                }


                                const trimmedBuffer = audioContext.createBuffer(
                                    sourceBuffer.numberOfChannels,
                                    frameCount,
                                    sourceBuffer.sampleRate
                                );


                                for (let i = 0; i < sourceBuffer.numberOfChannels; i++) {
                                    const channelData = sourceBuffer.getChannelData(i);
                                    const trimmedChannelData = trimmedBuffer.getChannelData(i);
                                    // Use subarray correctly: source.subarray(begin, end)
                                    trimmedChannelData.set(channelData.subarray(startOffset, endOffset));
                                }
                                
                                if (typeof toolInitializers.audioConverter.bufferToWave !== 'function') {
                                    showAlert('Audio conversion utility not found.', 'error');
                                    return;
                                }
                                const wavBlob = toolInitializers.audioConverter.bufferToWave(trimmedBuffer);


                                const url = URL.createObjectURL(wavBlob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${originalFileName}_trimmed.wav`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                                showAlert('Audio trimmed and downloaded!', 'success');


                            } catch (err) {
                                showAlert(`Error trimming audio: ${err.message}`, 'error');
                                console.error("Trimming error:", err);
                            }
                        };
                        window.currentToolCleanup = () => {
                            if (audioPreview && audioPreview.src && audioPreview.src.startsWith('blob:')) {
                                URL.revokeObjectURL(audioPreview.src);
                            }
                        };
                    };
