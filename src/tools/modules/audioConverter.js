import { showAlert, hideAlert } from '../../utils/alerts.js';
import { isSafeFile } from '../../utils/validate.js';
import { escapeHTML } from '../../utils/sanitize.js';

export default (() => { // IIFE to share bufferToWave
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
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
                sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
                sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF; 
                view.setInt16(pos, sample, true);
                pos += 2;
            }
        }
        return new Blob([view], { type: 'audio/wav' });
    }

    return (container) => { 
        container.innerHTML = `
            <p>This tool converts various audio formats (that your browser can play) into WAV format.</p>
            <input type="file" id="audioConvFile" accept="audio/*">
            <button id="audioConvButton">Convert to WAV & Download</button>
            <audio id="audioConvPreview" controls style="width:100%; margin-top:10px; display:none;"></audio>
        `;
        const fileInput = container.querySelector('#audioConvFile');
        const convertButton = container.querySelector('#audioConvButton');
        const audioPreview = container.querySelector('#audioConvPreview');
        let decodedAudioBuffer = null; 
        let originalFileName = 'converted_audio';

        fileInput.onchange = (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                
                if (!isSafeFile(file, null, 150)) { // up to 150MB for audio
                    showAlert('Invalid file or too large (Max 150MB).', 'error');
                    fileInput.value = '';
                    return;
                }
                
                originalFileName = file.name.split('.')[0] || 'audio';
                showAlert('Loading audio...', 'info');
                const reader = new FileReader();
                reader.onload = (event) => {
                    audioContext.decodeAudioData(event.target.result)
                        .then(buffer => { 
                            decodedAudioBuffer = buffer;
                            const tempUrl = URL.createObjectURL(file);
                            audioPreview.src = tempUrl;
                            audioPreview.style.display = 'block';
                            audioPreview.oncanplaythrough = () => URL.revokeObjectURL(tempUrl); 
                            showAlert('Audio loaded. Ready to convert to WAV.', 'success');
                        })
                        .catch(err => showAlert(`Error decoding audio: ${err.message}. Try a different format.`, 'error'));
                };
                reader.onerror = () => showAlert('Error reading file.', 'error');
                reader.readAsArrayBuffer(file);
            } else {
                audioPreview.style.display = 'none';
                audioPreview.src = "";
                decodedAudioBuffer = null;
            }
        };

        convertButton.onclick = () => {
            if (!decodedAudioBuffer) {
                showAlert('Please select and load an audio file first.', 'error');
                return;
            }
            showAlert('Converting to WAV...', 'info');
            try {
                const wavBlob = bufferToWave(decodedAudioBuffer); 
                const url = URL.createObjectURL(wavBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${escapeHTML(originalFileName)}_converted.wav`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showAlert('Conversion to WAV successful!', 'success');
            } catch (err) {
                showAlert(`Error converting to WAV: ${err.message}`, 'error');
            }
        };

        window.currentToolCleanup = () => {
            if (audioPreview && audioPreview.src && audioPreview.src.startsWith('blob:')) {
                URL.revokeObjectURL(audioPreview.src);
            }
        };
    };
})();
