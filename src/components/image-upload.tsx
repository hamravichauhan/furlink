"use client";

import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  return (
    <div>
      {value ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border">
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
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
              className="w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition text-gray-600"
            >
              <UploadCloud className="w-8 h-8 text-emerald-600" />
              <span className="text-sm font-medium">Click to upload photo</span>
              <span className="text-xs text-gray-400">
                PNG, JPG, WEBP up to 10MB
              </span>
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
