"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import api from "@/lib/api";

export type UploadedImage = {
  url: string;
  public_id: string;
};

type UploadType = 'projects' | 'blogs' | 'avatars' | 'thumbnails';

interface ImageUploadProps {
  value: string[];
  onUploaded: (image: UploadedImage) => void;
  onRemove: (url: string) => void;
  disabled?: boolean;
  uploadType?: UploadType;
}

export default function ImageUpload({
  value,
  onUploaded,
  onRemove,
  disabled,
  uploadType = 'projects',
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post(`/upload?type=${uploadType}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploaded({
        url: res.data.url,
        public_id: res.data.publicId || res.data.public_id,
      });
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* PREVIEW */}
      <div className="mb-4 flex gap-4 flex-wrap">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden border"
          >
            <Button
              type="button"
              onClick={() => onRemove(url)}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10"
            >
              <X className="h-4 w-4" />
            </Button>

            <img
              src={url}
              alt="Uploaded image"
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* UPLOAD */}
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        ) : (
          <ImagePlus className="h-8 w-8 text-gray-500" />
        )}
        <p className="text-sm text-gray-500 mt-2">
          <span className="font-semibold">Click to upload</span>
        </p>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
          disabled={disabled || loading}
        />
      </label>
    </div>
  );
}
