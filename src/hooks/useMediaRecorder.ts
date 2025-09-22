import { useState, useRef, useCallback } from 'react';

interface UseMediaRecorderProps {
  maxDuration: number; // in seconds
  mediaType: 'video' | 'audio';
}

interface UseMediaRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  stream: MediaStream | null;
  recordedBlob: Blob | null;
  duration: number;
  error: string | null;
  startRecording: (overrides?: MediaStreamConstraints) => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  resetRecording: () => void;
}

export const useMediaRecorder = ({ 
  maxDuration, 
  mediaType 
}: UseMediaRecorderProps): UseMediaRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async (overrides?: MediaStreamConstraints) => {
    try {
      setError(null);
      const baseConstraints: MediaStreamConstraints =
        mediaType === 'video' ? { video: true, audio: true } : { audio: true };

      const constraints = overrides ? { ...baseConstraints, ...overrides } : baseConstraints;

      const localStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = localStream;
      setStream(localStream);

      // Pick a supported mime type if available
      let options: MediaRecorderOptions = {};
      const candidates = mediaType === 'video'
        ? ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
        : ['audio/webm', 'audio/mp4'];
      for (const type of candidates) {
        // @ts-expect-error runtime support check
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported?.(type)) {
          options.mimeType = type;
          break;
        }
      }

      const mediaRecorder = options.mimeType
        ? new MediaRecorder(localStream, options)
        : new MediaRecorder(localStream);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: options.mimeType || (mediaType === 'video' ? 'video/webm' : 'audio/webm'),
        });
        setRecordedBlob(blob);
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        setStream(null);
      };

      mediaRecorder.start(100); // Record in 100ms chunks
      setIsRecording(true);
      setDuration(0);

      // Start duration timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 0.1;
          if (newDuration >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newDuration;
        });
      }, 100);

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please check your camera/microphone permissions.');
    }
  }, [maxDuration, mediaType, stopRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 0.1;
          if (newDuration >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newDuration;
        });
      }, 100);
    }
  }, [isRecording, isPaused, maxDuration, stopRecording]);

  const resetRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStream(null);
    
    setIsRecording(false);
    setIsPaused(false);
    setRecordedBlob(null);
    setDuration(0);
    setError(null);
    chunksRef.current = [];
  }, []);

  return {
    isRecording,
    isPaused,
    stream,
    recordedBlob,
    duration,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  };
};