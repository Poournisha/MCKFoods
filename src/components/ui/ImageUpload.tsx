import { useCallback, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
}

export function ImageUpload({
  onUpload,
  maxSizeMB = 1,
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Please upload: ${acceptedTypes.join(", ")}`;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    if (/[\u4e00-\u9fa5]/.test(file.name)) {
      return "Filename cannot contain Chinese characters";
    }

    return null;
  };

  const handleFile = async (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    e.target.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          isUploading && "opacity-50 pointer-events-none"
        )}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          disabled={isUploading}
        />

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">
                Drop image here or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, WEBP (Max {maxSizeMB}MB)
              </p>
            </>
          )}
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <X className="h-4 w-4 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
