
import { useState, useRef, useCallback } from "react";

interface AudioRecorderHook {
  isRecording: boolean;
  audioURL: string | null;
  audioBlob: Blob | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetRecording: () => void;
  error: string | null;
}

export function useAudioRecorder(): AudioRecorderHook {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 22050, // Lower sample rate (standard is 44100)
          channelCount: 1    // Mono instead of stereo
        } 
      });
      
      // Reset state before starting new recording
      audioChunksRef.current = [];
      setAudioURL(null);
      setAudioBlob(null);
      setError(null);
      
      // Use audio/webm for broader browser support during recording
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        try {
          // Combine all chunks into a single blob
          const audioData = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
          
          // Convert the recorded audio to proper WAV format using Web Audio API
          const audioContext = new AudioContext();
          const audioBuffer = await audioContext.decodeAudioData(await audioData.arrayBuffer());
          
          // Create optimized WAV file
          const wavBlob = await createWavFromAudioBuffer(audioBuffer, {
            sampleRate: 22050,    // Reduced sample rate
            bitDepth: 16,         // Standard bit depth
            channels: 1           // Mono audio
          });
          
          const url = URL.createObjectURL(wavBlob);
          setAudioURL(url);
          setAudioBlob(wavBlob);
          setIsRecording(false);
          
          // Release the microphone when recording stops
          stream.getTracks().forEach(track => track.stop());
        } catch (err) {
          console.error("Error processing audio:", err);
          setError("Failed to process audio recording.");
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please check your permissions.");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    return Promise.resolve();
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setAudioBlob(null);
    audioChunksRef.current = [];
  }, [audioURL]);

  // Function to convert AudioBuffer to WAV format with optimization options
  // Now returns a Promise<Blob> to handle the async operation properly
  async function createWavFromAudioBuffer(buffer: AudioBuffer, options = {
    sampleRate: 22050,
    bitDepth: 16,
    channels: 1
  }): Promise<Blob> {
    // Create a new AudioContext with the target sample rate
    const offlineCtx = new OfflineAudioContext(
      options.channels, 
      buffer.duration * options.sampleRate,
      options.sampleRate
    );
    
    // Create a new buffer source
    const source = offlineCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(offlineCtx.destination);
    source.start();
    
    // Render the audio to get the downsampled buffer
    const resampledBuffer = await offlineCtx.startRendering();
    
    const numOfChannels = resampledBuffer.numberOfChannels;
    const length = resampledBuffer.length * numOfChannels * (options.bitDepth / 8);
    const sampleRate = resampledBuffer.sampleRate;
    
    // Create the buffer for the WAV file
    const wavBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(wavBuffer);
    
    // Write the WAV header
    // "RIFF" chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, 'WAVE');
    
    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);           // subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true);            // audioFormat (PCM = 1)
    view.setUint16(22, numOfChannels, true);// numChannels
    view.setUint32(24, sampleRate, true);   // sampleRate
    view.setUint32(28, sampleRate * (options.bitDepth / 8) * numOfChannels, true); // byteRate
    view.setUint16(32, numOfChannels * (options.bitDepth / 8), true); // blockAlign
    view.setUint16(34, options.bitDepth, true); // bitsPerSample
    
    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, length, true);       // subchunk2Size
    
    // Write the PCM samples
    const channelData = [];
    for (let i = 0; i < numOfChannels; i++) {
      channelData.push(resampledBuffer.getChannelData(i));
    }
    
    let offset = 44;
    for (let i = 0; i < resampledBuffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        // Convert float audio data to PCM
        const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
        const value = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF);
        view.setInt16(offset, value, true);
        offset += 2;
      }
    }
    
    return new Blob([wavBuffer], { type: 'audio/wav' });
  }

  // Helper function to write strings to DataView
  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  return {
    isRecording,
    audioURL,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
    error
  };
}