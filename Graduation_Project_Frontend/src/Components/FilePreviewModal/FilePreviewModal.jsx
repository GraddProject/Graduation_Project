import React from "react";
import { X } from "lucide-react";

export default function FilePreviewModal({ previewFile, setPreviewFile }) {
  if (!previewFile) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <button
        className="absolute top-3 right-3 bg-[#2d2d2d] text-white px-3 py-1 rounded"
        onClick={() => setPreviewFile(null)}
      >
        <X />
      </button>

      <div className="bg-white w-[80%] h-[85%] rounded-xl relative overflow-hidden">

        <div className="w-full h-full">

          {previewFile.type === "application/pdf" ? (
            <iframe
              src={previewFile.url}
              className="w-full h-full"
            />
          ) : (
            <img
              src={previewFile.url}
              className="w-full h-full object-contain"
              alt="preview"
            />
          )}

        </div>
      </div>
    </div>
  );
}