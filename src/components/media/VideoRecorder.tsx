import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
import { Play, Square, Pause, RotateCcw, Video } from 'lucide-react';

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  maxDuration?: number;
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({ 
  onRecordingComplete, 
  maxDuration = 60 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
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
  } = useMediaRecorder({ maxDuration, mediaType: 'video' });

  useEffect(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      if (videoRef.current) {
        videoRef.current.src = url;
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
        <Video className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={resetRecording} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls={!!recordedBlob}
          autoPlay={isRecording}
          muted={isRecording}
        />
        
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>REC {formatTime(duration)}</span>
          </div>
        )}

        {!isRecording && !recordedBlob && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Ready to Record</p>
              <p className="text-sm opacity-70">Maximum {maxDuration} seconds</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-2">
        {!isRecording && !recordedBlob && (
          <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600 text-white">
            <Video className="h-4 w-4 mr-2" />
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
        <div className="text-center">
          <div className="text-sm text-neutral-600 mb-2">
            Duration: {formatTime(duration)} / {formatTime(maxDuration)}
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