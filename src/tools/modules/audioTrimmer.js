import { showAlert, hideAlert } from '../../utils/alerts.js';
import { isSafeFile } from '../../utils/validate.js';

function bufferToWave(abuffer) { 
    let numOfChan = abuffer.numberOfChannels,
        length = abuffer.length * numOfChan * 2 + 44, 
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [], i, sample,
        offset = 0, 
        pos = 0;        

    // write WAVE header
    view.setUint32(pos, 0x46464952, false); pos += 4; // "RIFF"
    view.setUint32(pos, length - 8, true); pos += 4;  // file length - 8
    view.setUint32(pos, 0x45564157, false); pos += 4; // "WAVE"

    view.setUint32(pos, 0x20746d66, false); pos += 4; // "fmt " chunk
    view.setUint32(pos, 16, true); pos += 4;              
    view.setUint16(pos, 1, true); pos += 2;               
    view.setUint16(pos, numOfChan, true); pos += 2;
    view.setUint32(pos, abuffer.sampleRate, true); pos += 4;
    view.setUint32(pos, abuffer.sampleRate * 2 * numOfChan, true); pos += 4; 
    view.setUint16(pos, numOfChan * 2, true); pos += 2; 
    view.setUint16(pos, 16, true); pos += 2;              

    view.setUint32(pos, 0x61746164, false); pos += 4; // "data" - chunk
    view.setUint32(pos, abuffer.length * numOfChan * 2, true); pos += 4; 

    for (i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

    // Write interleaved data
    for (offset = 0; offset < abuffer.length; offset++) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][offset]));
            sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF; 
            view.setInt16(pos, sample, true);
            pos += 2;
        }
    }
    return new Blob([view], { type: 'audio/wav' });
}

export default (container) => {
    container.innerHTML = `
        <div class="tool-form">
            <label for="trimAudioFile">Select Audio File to Trim:</label>
            <input type="file" id="trimAudioFile" accept="audio/*">
            <audio id="trimAudioPreview" controls style="width:100%; margin-top:10px; display:none;"></audio>
            
            <div id="trimControls" style="display:none; margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div>
                        <label for="trimStartTime">Start Time (seconds):</label>
                        <input type="number" id="trimStartTime" value="0" min="0" step="0.1">
                    </div>
                    <div>
                        <label for="trimEndTime">End Time (seconds):</label>
                        <input type="number" id="trimEndTime" value="0" min="0" step="0.1">
                    </div>
                </div>
                <p id="audioDurationInfo" style="color:var(--text-secondary); margin: 0.8rem 0; font-size:0.9rem;"></p>
                <button id="trimButton" style="margin-top:0.5rem;">✂️ Trim & Download WAV</button>
            </div>
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
    let audioContext = null;

    const getAudioContext = () => {
        if (!audioContext) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) throw new Error('Web Audio API is not supported in this environment.');
            audioContext = new AudioCtx();
        }
        return audioContext;
    };

    fileInput.onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!isSafeFile(file, null, 150)) {
                showAlert('Invalid file or too large (Max 150MB).', 'error');
                fileInput.value = '';
                return;
            }

            originalFileName = file.name.replace(/\.[^/.]+$/, "") || 'audio';
            showAlert('Loading audio...', 'info');
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const ctx = getAudioContext();
                    ctx.decodeAudioData(event.target.result)
                        .then(decodedBuffer => {
                            sourceBuffer = decodedBuffer;
                            const tempUrl = URL.createObjectURL(file);
                            audioPreview.src = tempUrl;
                            audioPreview.style.display = 'block';
                            
                            const duration = sourceBuffer.duration;
                            durationInfo.textContent = `Total Audio Duration: ${duration.toFixed(2)} seconds`;
                            startTimeInput.value = "0.00";
                            endTimeInput.value = duration.toFixed(2);
                            endTimeInput.max = duration.toFixed(2);
                            startTimeInput.max = duration.toFixed(2);
                            trimControls.style.display = 'block';
                            showAlert('Audio loaded successfully. Adjust start and end times to trim.', 'success');
                        })
                        .catch(err => showAlert(`Error decoding audio: ${err.message}`, 'error'));
                } catch (err) {
                    showAlert(err.message, 'error');
                }
            };
            reader.onerror = () => showAlert('Error reading file.', 'error');
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
            showAlert(`Invalid trim range. Start time must be >= 0 and End time must be > Start time up to ${sourceBuffer.duration.toFixed(2)}s.`, 'error');
            return;
        }
        
        showAlert('Trimming audio...', 'info');
        try {
            const ctx = getAudioContext();
            const startOffset = Math.floor(startTime * sourceBuffer.sampleRate);
            const endOffset = Math.floor(endTime * sourceBuffer.sampleRate);
            const frameCount = endOffset - startOffset;

            if (frameCount <= 0) {
                showAlert('Trimmed duration is zero or invalid.', 'error');
                return;
            }

            const trimmedBuffer = ctx.createBuffer(
                sourceBuffer.numberOfChannels,
                frameCount,
                sourceBuffer.sampleRate
            );

            for (let i = 0; i < sourceBuffer.numberOfChannels; i++) {
                const channelData = sourceBuffer.getChannelData(i);
                const trimmedChannelData = trimmedBuffer.getChannelData(i);
                trimmedChannelData.set(channelData.subarray(startOffset, endOffset));
            }
            
            const wavBlob = bufferToWave(trimmedBuffer);
            const url = URL.createObjectURL(wavBlob);
            const a = document.createElement('a');
            a.href = url;
            const safeName = originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
            a.download = `${safeName}_trimmed.wav`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showAlert('Audio trimmed and downloaded successfully!', 'success');
        } catch (err) {
            showAlert(`Error trimming audio: ${err.message}`, 'error');
            console.error("Trimming error:", err);
        }
    };

    window.currentToolCleanup = () => {
        if (audioPreview && audioPreview.src && audioPreview.src.startsWith('blob:')) {
            URL.revokeObjectURL(audioPreview.src);
        }
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close().catch(() => {});
        }
    };
};
