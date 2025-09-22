import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Upload, File, Image, Video, Volume2, X, CheckCircle } from 'lucide-react';

interface FileUploaderProps {
  onUploadComplete: (result: {
    file_url: string;
    file_type: string;
    file_size: number;
    duration?: number;
    thumbnail_url?: string;
  }) => void;
  fileType: 'video' | 'audio' | 'image';
  maxSize: number; // in MB
  acceptedTypes: string[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  fileType,
  maxSize,
  acceptedTypes,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const { uploading, progress, error, uploadFile, resetUpload } = useFileUpload();

  const getIcon = () => {
    switch (fileType) {
      case 'video':
        return Video;
      case 'audio':
        return Volume2;
      case 'image':
        return Image;
      default:
        return File;
    }
  };

  const Icon = getIcon();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      alert(`Please select a valid ${fileType} file.`);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB.`);
      return;
    }

    setSelectedFile(file);
  }, [acceptedTypes, fileType, maxSize]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    const result = await uploadFile(selectedFile, fileType);
    if (result) {
      setUploadResult(result);
      onUploadComplete(result);
    }
  }, [selectedFile, uploadFile, fileType, onUploadComplete]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setUploadResult(null);
    resetUpload();
  }, [resetUpload]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploadResult) {
    return (
      <div className="text-center p-6 border-2 border-dashed border-green-200 rounded-xl bg-green-50">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <p className="text-green-700 font-medium mb-2">Upload Successful!</p>
        <p className="text-sm text-green-600 mb-4">
          {selectedFile?.name} ({formatFileSize(uploadResult.file_size)})
        </p>
        <Button onClick={handleReset} variant="outline" size="sm">
          Upload Another File
        </Button>
      </div>
    );
  }

  if (selectedFile && !uploading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl border">
          <Icon className="h-8 w-8 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-neutral-500">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <Button
            onClick={() => setSelectedFile(null)}
            variant="ghost"
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleUpload} className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            Upload {fileType}
          </Button>
        </div>
      </div>
    );
  }

  if (uploading) {
    return (
      <div className="text-center p-6 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50">
        <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-bounce" />
        <p className="text-blue-700 font-medium mb-2">Uploading...</p>
        <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-blue-600">{Math.round(progress)}% complete</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 border-2 border-dashed border-red-200 rounded-xl bg-red-50">
        <Icon className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={handleReset} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        dragOver
          ? 'border-primary bg-primary/5'
          : 'border-neutral-300 hover:border-neutral-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Icon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-neutral-900 mb-2">
        Upload {fileType}
      </h3>
      <p className="text-sm text-neutral-600 mb-4">
        Drag and drop your {fileType} here, or click to browse
      </p>
      <p className="text-xs text-neutral-500 mb-6">
        Maximum size: {maxSize}MB • Supported formats: {acceptedTypes.map(type => 
          type.split('/')[1].toUpperCase()
        ).join(', ')}
      </p>
      
      <input
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <Button variant="outline">
        <Upload className="h-4 w-4 mr-2" />
        Choose File
      </Button>
    </div>
  );
};