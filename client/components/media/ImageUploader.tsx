import React, { useState } from 'react';
import { UploadDropzone } from '../../lib/uploadthing';
import { Button } from '../ui/button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: Error) => void;
  currentImage?: string;
  onRemove?: () => void;
  className?: string;
  maxFileSize?: string;
  accept?: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadComplete,
  onUploadError,
  currentImage,
  onRemove,
  className = '',
  maxFileSize = '4MB',
  accept = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  return (
    <div className={`space-y-4 ${className}`}>
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Image uploadée"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <Button
              variant="destructive"
              size="sm"
              onClick={onRemove}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Supprimer
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          {isUploading ? (
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p className="text-sm text-gray-600">Upload en cours... {uploadProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <UploadDropzone
              endpoint="articleImageUploader"
              onClientUploadComplete={(res) => {
                setIsUploading(false);
                setUploadProgress(0);
                if (res?.[0]?.url) {
                  onUploadComplete(res[0].url);
                }
              }}
              onUploadError={(error: Error) => {
                setIsUploading(false);
                setUploadProgress(0);
                console.error('Erreur upload:', error);
                onUploadError?.(error);
              }}
              onUploadBegin={() => {
                setIsUploading(true);
                setUploadProgress(0);
              }}
              onUploadProgress={(progress) => {
                setUploadProgress(progress);
              }}
              config={{
                mode: 'auto',
              }}
              appearance={{
                container: 'border-none p-0',
                uploadIcon: 'text-gray-400',
                label: 'text-sm text-gray-600',
                allowedContent: 'text-xs text-gray-500',
                button: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors',
              }}
              content={{
                uploadIcon: <ImageIcon className="w-8 h-8" />,
                label: 'Glissez une image ici ou cliquez pour sélectionner',
                allowedContent: `Formats acceptés: ${accept.join(', ')} (max ${maxFileSize})`,
                button: 'Choisir une image',
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
