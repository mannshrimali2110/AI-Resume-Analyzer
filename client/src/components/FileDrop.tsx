// src/components/FileDrop.tsx
import React, { useCallback, useState } from "react";
import axios from "axios";

interface FileDropProps {
  onExtracted: (text: string) => void;
}

export default function FileDrop({ onExtracted }: FileDropProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setSuccess(null);
      if (!file) return;

      const lower = file.name.toLowerCase();
      if (!lower.endsWith(".pdf") && !lower.endsWith(".docx")) {
        setError("Only .pdf and .docx files are allowed.");
        return;
      }

      const formData = new FormData();
      formData.append("resume", file);

      try {
        setUploading(true);

        const res = await axios.post("/api/upload/resume", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60_000,
        });

        if (res.status !== 200) {
          throw new Error(`Upload failed (${res.status})`);
        }

        const data = res.data;
        if (!data || data.success !== true || !data.text) {
          throw new Error(data?.message || "Failed to extract resume text");
        }

        onExtracted(data.text);
        setSuccess("File uploaded & parsed successfully !");
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
          err?.message ??
          "Upload failed. Check backend or network."
        );
      } finally {
        setUploading(false);
      }
    },
    [onExtracted]
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.currentTarget.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`card border-2 border-dashed p-6 text-center cursor-pointer transition
          ${dragOver
            ? "border-[var(--accent)] bg-[rgba(124,58,237,0.08)]"
            : "border-[rgba(255,255,255,0.1)] hover:border-[var(--accent-2)]"
          }`}
        role="button"
        aria-label="Upload resume"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".pdf,.docx";
          input.onchange = (ev: any) => {
            const file = ev.target.files?.[0];
            if (file) handleFile(file);
          };
          input.click();
        }}
      >
        <p className="text-sm text-[var(--text-secondary)]">
          {uploading
            ? "⏳ Uploading & parsing..."
            : "Drag & drop a PDF/DOCX here, or click to browse"}
        </p>

        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.docx"
          onChange={onFileChange}
          style={{ display: "none" }}
        />
      </div>

      {error && (
        <p className="text-sm text-[var(--danger)] font-medium">{error}</p>
      )}
      {success && (
        <p className="text-sm text-[var(--success)] font-medium">{success}</p>
      )}
    </div>
  );
}
