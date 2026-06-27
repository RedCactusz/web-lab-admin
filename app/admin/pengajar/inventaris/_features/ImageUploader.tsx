"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  namaAlat: string;
  kodeAlat: string;
  existingPhotos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function ImageUploader({
  namaAlat,
  kodeAlat,
  existingPhotos,
  onPhotosChange,
  maxPhotos = 5,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  const processImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
          }
          ctx.drawImage(img, 0, 0);

          const now = new Date();
          const timestamp = now.toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });

          const fontSize = Math.max(24, img.width * 0.03);
          ctx.font = `bold ${fontSize}px monospace`;
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";

          const padding = fontSize * 1.5;
          const textWidth = ctx.measureText(timestamp).width;
          const x = img.width - padding;
          const y = img.height - padding;

          ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
          ctx.fillRect(
            x - textWidth - padding * 0.5,
            y - fontSize - padding * 0.3,
            textWidth + padding,
            fontSize + padding * 0.6
          );

          ctx.fillStyle = "#ffffff";
          ctx.fillText(timestamp, x, y);

          const base64 = canvas.toDataURL("image/jpeg", 0.85);
          resolve(base64);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setProcessing(true);
    try {
      const newPhotos = [...existingPhotos];
      for (const file of Array.from(files)) {
        if (newPhotos.length >= maxPhotos) break;
        if (!file.type.startsWith("image/")) continue;
        const processed = await processImage(file);
        newPhotos.push(processed);
      }
      onPhotosChange(newPhotos);
    } catch (err) {
      console.error("Error processing image:", err);
    } finally {
      setProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    const updated = [...existingPhotos];
    updated.splice(index, 1);
    onPhotosChange(updated);
  };

  const canAddMore = existingPhotos.length < maxPhotos;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Foto Alat ({existingPhotos.length}/{maxPhotos})
      </label>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          {existingPhotos.map((photo, index) => (
            <div key={index} className="relative group">
              <Image
                src={photo}
                alt={`Foto ${index + 1}`}
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                ×
              </button>
            </div>
          ))}

          {canAddMore && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={processing}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-emerald-600 transition-all disabled:opacity-50"
            >
              {processing ? (
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-2xl">+</span>
                  <span className="text-[10px]">Tambah</span>
                </>
              )}
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <p className="text-xs text-gray-400">
          Klik untuk upload dari galeri atau kamera. Timestamp akan otomatis ditambahkan.
        </p>
      </div>
    </div>
  );
}
