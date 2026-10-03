"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { X } from "lucide-react";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export default function MultiImageUpload({
  value,
  onChange,
  maxFiles = 6,
}: MultiImageUploadProps) {
  const handleUpload = (result: any) => {
    const url = result?.info?.secure_url;
    if (typeof url !== "string") return;
    if (value.includes(url)) return;
    if (value.length >= maxFiles) return;
    onChange([...value, url]);
  };

  const remove = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  return (
    <div className="space-y-3">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          multiple: true,
          maxFiles,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        }}
        onSuccess={handleUpload}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            disabled={value.length >= maxFiles}
            className="w-full border-2 border-dashed rounded-md py-6 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            {value.length >= maxFiles
              ? `Maximum ${maxFiles} photos reached`
              : `+ Add photos (${value.length}/${maxFiles})`}
          </button>
        )}
      </CldUploadWidget>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div
              key={url}
              className="relative aspect-square rounded-md overflow-hidden border"
            >
              <Image
                src={url}
                alt={`Upload ${i + 1}`}
                fill
                sizes="150px"
                className="object-cover"
              />
              {i === 0 && (
                <div className="absolute top-1 left-1 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Cover
                </div>
              )}
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black"
                aria-label="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        First photo becomes the cover. Max {maxFiles} photos.
      </p>
    </div>
  );
}
