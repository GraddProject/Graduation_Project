import { Loader2 } from "lucide-react";

export default function Loading({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-5 py-8 text-gray-400 text-sm">
      <Loader2 size={18} className="animate-spin" />
      <span>{text}</span>
    </div>
  );
}