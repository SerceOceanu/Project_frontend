'use client';

import { useState } from 'react';
import { Trash2Icon } from "lucide-react";
import { SlCloudDownload } from "react-icons/sl";

interface LoadImageProps {
  value: File | null;
  currentImage?: string;
  onChange: (file: File | null) => void;
  onDelete?: () => void;
}

export default function LoadImage({ value, currentImage, onChange, onDelete }: LoadImageProps) {
  const [imageDeleted, setImageDeleted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const showImage = (value && value instanceof File) || (currentImage && !imageDeleted);
  const imageSrc = value && value instanceof File 
    ? URL.createObjectURL(value) 
    : currentImage;

  const handleDelete = () => {
    onChange(null);
    setImageDeleted(true);
    onDelete?.();
    if (value && value instanceof File) {
      URL.revokeObjectURL(URL.createObjectURL(value));
    }
  };

  const handleFileSelect = (file: File | null) => {
    onChange(file);
    if (file) {
      setImageDeleted(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray">Фото товару</label>
      
      {showImage ? (
        <div className="mt-2 border border-2 border-dashed p-6 rounded-xl relative">
          <div 
            className="absolute top-3 right-3 cursor-pointer flex rounded-full bg-white shadow p-2 hover:scale-110 transition-all duration-300 z-10"
            onClick={handleDelete}
          >
            <Trash2Icon className="size-5 text-red-500" />
          </div>
          <img 
            src={imageSrc} 
            alt="Product" 
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>
      ) : (
        <label 
          className={`p-8 border flex flex-col border-2 border-dashed rounded-xl items-center justify-center cursor-pointer transition-colors ${
            isDragging ? ' bg-orange/5' : 'hover:border-black/20'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file && file.type.startsWith('image/')) {
              handleFileSelect(file);
            }
          }}
        >
          <input
            value=""
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              handleFileSelect(file);
            }}
            className="hidden"
          />
          <SlCloudDownload className="size-[64px] text-[#A4A7AE] " />
          <p className=" text-gray text-center mt-4">Перетягніть файли сюди або натисніть на поле для завантаження</p>
        </label>
      )}
    </div>
  );
}
