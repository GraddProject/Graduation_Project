import { CircleCheck, Circle } from "lucide-react";

export default function PassRequirement({ valid, text }) {
  return (
    <div className="flex items-center gap-2 transition">
      {valid ? (
        <CircleCheck className="w-4 h-4 shrink-0 text-green-600" />
      ) : (
        <Circle className="w-3 h-3 shrink-0 text-[#5C615666]" />
      )}
      <p className={`text-[11px]  ${valid ? "text-green-600" : "text-[#5C6156FF]"}`}>
        {text}
      </p>
    </div>
  );
}