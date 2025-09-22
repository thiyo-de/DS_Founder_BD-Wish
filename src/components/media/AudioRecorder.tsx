import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
import { Play, Square, Pause, RotateCcw, Mic, Volume2 } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  maxDuration?: number;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onRecordingComplete, 
  maxDuration = 30 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    isRecording,
    isPaused,
    recordedBlob,
    duration,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useMediaRecorder({ maxDuration, mediaType: 'audio' });

  useEffect(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      if (audioRef.current) {
        audioRef.current.src = url;
      }
      onRecordingComplete(recordedBlob);
      
      return () => URL.revokeObjectURL(url);
    }
  }, [recordedBlob, onRecordingComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="text-center p-6 border-2 border-dashed border-red-200 rounded-xl bg-red-50">
        <Mic className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={resetRecording} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center p-8 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-200">
        {isRecording ? (
          <div className="text-center">
            <div className="relative mb-4">
              <Mic className="h-16 w-16 text-red-500 mx-auto" />
              <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping opacity-20" />
            </div>
            <p className="text-lg font-medium text-red-600 mb-2">Recording...</p>
            <p className="text-2xl font-mono font-bold text-neutral-900">
              {formatTime(duration)}
            </p>
          </div>
        ) : recordedBlob ? (
          <div className="text-center">
            <Volume2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-neutral-900 mb-4">Recording Complete</p>
            <audio
              ref={audioRef}
              controls
              className="w-full max-w-sm"
            />
          </div>
        ) : (
          <div className="text-center">
            <Mic className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-neutral-900 mb-2">Ready to Record</p>
            <p className="text-sm text-neutral-600">Maximum {maxDuration} seconds</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-2">
        {!isRecording && !recordedBlob && (
          <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600 text-white">
            <Mic className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <>
            {!isPaused ? (
              <Button onClick={pauseRecording} variant="outline">
                <Pause className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={resumeRecording} className="bg-red-500 hover:bg-red-600 text-white">
                <Play className="h-4 w-4" />
              </Button>
            )}
            
            <Button onClick={stopRecording} variant="outline">
              <Square className="h-4 w-4" />
            </Button>
          </>
        )}

        {recordedBlob && (
          <Button onClick={resetRecording} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Record Again
          </Button>
        )}
      </div>

      {duration > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-neutral-600">
            <span>{formatTime(duration)}</span>
            <span>{formatTime(maxDuration)}</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${(duration / maxDuration) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};