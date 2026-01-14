"use client";

import React, { ChangeEvent } from 'react';
import { Camera, X, ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (newImages: string[]) => void;
}

export default function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Limit to 3 images as per client request
        if (images.length < 3) {
          onImagesChange([...images, base64String]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const filtered = images.filter((_, i) => i !== index);
    onImagesChange(filtered);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase text-gray-500 flex items-center gap-2">
          <Camera size={14} /> Door Images (Max 3)
        </label>
        <span className="text-[10px] text-gray-400 font-mono">{images.length}/3</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Image Previews */}
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
            <img src={img} alt="Door proof" className="w-full h-full object-cover" />
            <button 
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        {images.length < 3 && (
          <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all">
            <ImageIcon className="text-gray-400 mb-1" size={20} />
            <span className="text-[10px] font-bold text-gray-400 uppercase">Add Photo</span>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
}