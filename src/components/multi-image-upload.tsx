"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { X, ImageIcon, Link as LinkIcon } from "lucide-react";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

const SAMPLE_STORY_IMAGES = [
  "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80",
];

export default function MultiImageUpload({
  value,
  onChange,
  maxFiles = 6,
}: MultiImageUploadProps) {
  const [urlDraft, setUrlDraft] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleUpload = (result: any) => {
    const url = result?.info?.secure_url;
    if (typeof url !== "string") return;
    if (value.includes(url)) return;
    if (value.length >= maxFiles) return;
    onChange([...value, url]);
  };

  const handleLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (value.length >= maxFiles) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string" && !value.includes(reader.result)) {
          onChange([...value, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addUrl = () => {
    if (urlDraft.trim() && !value.includes(urlDraft.trim()) && value.length < maxFiles) {
      onChange([...value, urlDraft.trim()]);
      setUrlDraft("");
      setShowUrlInput(false);
    }
  };

  const addSample = (url: string) => {
    if (!value.includes(url) && value.length < maxFiles) {
      onChange([...value, url]);
    }
  };

  const remove = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  return (
    <div className="space-y-3">
      {/* Upload actions bar */}
      <div className="border-2 border-dashed rounded-xl p-4 bg-gray-50/60 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Choose from computer */}
          <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition inline-flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Select Photos ({value.length}/{maxFiles})</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleLocalFile}
              className="hidden"
              disabled={value.length >= maxFiles}
            />
          </label>

          {/* Cloudinary Upload (if preset configured) */}
          {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET && (
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{
                multiple: true,
                maxFiles,
                resourceType: "image",
              }}
              onSuccess={handleUpload}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  disabled={value.length >= maxFiles}
                  className="border text-gray-700 hover:bg-gray-100 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                >
                  Cloud Upload
                </button>
              )}
            </CldUploadWidget>
          )}

          {/* URL input toggle */}
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            disabled={value.length >= maxFiles}
            className="border text-gray-700 hover:bg-gray-100 text-xs font-medium px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1"
          >
            <LinkIcon className="w-3 h-3" />
            <span>Paste URL</span>
          </button>
        </div>

        {/* URL Input */}
        {showUrlInput && (
          <div className="flex items-center gap-2 max-w-md mx-auto pt-1">
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="https://..."
              className="border rounded-lg px-2.5 py-1 text-xs flex-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={addUrl}
              className="bg-gray-900 text-white text-xs px-3 py-1 rounded-lg hover:bg-gray-800"
            >
              Add
            </button>
          </div>
        )}

        {/* Demo Samples */}
        <div className="pt-2 border-t text-[11px] text-gray-500 flex items-center justify-center gap-1.5 flex-wrap">
          <span className="font-medium text-gray-600">Quick add samples:</span>
          {SAMPLE_STORY_IMAGES.map((sampleUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addSample(sampleUrl)}
              className="bg-white border hover:bg-emerald-50 hover:border-emerald-300 text-gray-700 text-[10px] px-2 py-0.5 rounded-full transition"
            >
              Sample {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Uploaded thumbnails */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
          {value.map((url, i) => (
            <div
              key={url + i}
              className="relative aspect-square rounded-lg overflow-hidden border bg-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Upload ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {i === 0 && (
                <div className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                  Cover
                </div>
              )}
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-600 transition shadow"
                aria-label="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        First photo is the cover. Up to {maxFiles} photos supported.
      </p>
    </div>
  );
}
