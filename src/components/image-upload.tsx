"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

const SAMPLE_IMAGES = [
  { label: "Street Dog", url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80" },
  { label: "Rescue Cat", url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80" },
  { label: "Young Pup", url: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80" },
  { label: "Injured Patient", url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80" },
];

export default function ImageUpload({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");

  const handleLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setShowUrlInput(false);
      setUrlDraft("");
    }
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative w-full h-56 rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2.5 right-2.5 bg-slate-900/80 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs transition"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div className="border border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50/60 text-center space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-800 block">
              Attach Photograph
            </span>
            <span className="text-xs text-slate-500 block">
              Choose a local photo, upload to cloud, or select a demo sample
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* Local Device Picker */}
            <label className="cursor-pointer text-xs font-semibold px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-full transition shadow-xs inline-block">
              <span>Select File</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLocalFile}
                className="hidden"
              />
            </label>

            {/* Cloudinary Upload (if preset configured) */}
            {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET && (
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{ maxFiles: 1, resourceType: "image" }}
                onSuccess={(result: any) => {
                  if (result?.info?.secure_url) {
                    onChange(result.info.secure_url);
                  }
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="text-xs font-semibold px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-full transition"
                  >
                    Cloud Upload
                  </button>
                )}
              </CldUploadWidget>
            )}

            {/* URL Toggle */}
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs font-semibold px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-full transition"
            >
              Paste Image URL
            </button>
          </div>

          {showUrlInput && (
            <div className="flex items-center gap-2 max-w-md mx-auto pt-2">
              <input
                type="url"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="border border-slate-200 bg-white rounded-full px-3.5 py-1.5 text-xs flex-1 focus:outline-hidden focus:border-emerald-500 shadow-2xs"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="text-xs font-semibold px-4 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-full transition shadow-xs cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}

          {/* Clean Samples */}
          <div className="pt-3 border-t border-slate-200 text-xs text-slate-500">
            <span className="mr-2">Quick Samples:</span>
            <div className="inline-flex gap-1.5 flex-wrap mt-1">
              {SAMPLE_IMAGES.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => onChange(s.url)}
                  className="px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-400 text-[11px] text-slate-700 transition"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
