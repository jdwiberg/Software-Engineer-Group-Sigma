import React, { useState, useRef, useCallback } from "react";

type PhotoDropzoneProps = {
  onFileSubmitted?: (file: File) => void;
  maxSizeMB?: number;
};

export default function PhotoDropzone({
  onFileSubmitted,
  maxSizeMB = 10,
}: PhotoDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCEPT = ["image/jpeg", "image/png"];

  const validate = (file: File): string | null => {
    if (!ACCEPT.includes(file.type)) {
      return "Only JPEG and PNG files are allowed.";
    }
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File must be smaller than ${maxSizeMB} MB.`;
    }
    return null;
  };

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      setError(null);

      const validationError = validate(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Revoke previous preview
      if (previewUrl) URL.revokeObjectURL(previewUrl);

      const newUrl = URL.createObjectURL(file);
      setPreviewUrl(newUrl);
      setSelectedFile(file);
    },
    [onFileSubmitted, previewUrl, maxSizeMB]
  );

  const onDrop = (e: React.DragEvent) => {
    setIsSubmitting(true)
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
    setIsSubmitting(false)
  };

  const handleSubmitClick = () => {
    if (!selectedFile) {
      setError("Please select a file before submitting.");
      return;
    }

    setIsSubmitting(true);
    onFileSubmitted?.(selectedFile);
    window.location.reload();
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        style={{
          border: "2px dashed gray",
          borderRadius: "8px",
          padding: "40px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragging ? "#f0f0f0" : "transparent",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(",")}
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          style={{ display: "none" }}
        />
        <p>Drag & drop a JPEG or PNG here, or click to browse.</p>
        <p>Max {maxSizeMB} MB.</p>
        {isSubmitting && <p>Uploading...</p>}
        {previewUrl && (<div>
          <p>Image Uploaded</p>

          <img src={previewUrl} alt="Preview" style={{ maxWidth: "10%", marginTop: "20px" }} />
          
          <p><button type="button" onClick={() => {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            setSelectedFile(null);
            }
          }>Remove Image</button></p>

          <p><button type="button" onClick={handleSubmitClick}>Submit</button></p>
        </div>)}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
