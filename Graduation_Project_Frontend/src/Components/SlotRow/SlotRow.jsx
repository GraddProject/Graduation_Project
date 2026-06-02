import { Calendar, Edit2, Trash2, RefreshCw, Loader2 } from "lucide-react";

const TYPE_STYLE = {
  Online: "bg-teal-50 text-teal-700 border border-teal-100",
  Offline: "bg-gray-100 text-gray-500 border border-gray-200",
};

const avatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4e6d4&color=2d4a2d&size=64`;

export default function SlotRow({
  slot,
  isBooked,
  isDeleting,
  onEdit,
  onDelete,
  onReschedule,
}) {
  const label = slot.dateLabel || slot.date || "—";
  const time = slot.time || "—";
  const duration = slot.duration || "—";
  const visitType = slot.visitType || "Online";
  const patient = slot.patientName || null;

  return (
    <div
      className={`flex items-center gap-4 px-6 py-4 transition-colors
        hover:bg-gray-50
        ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Icon */}
      <div className="w-8 h-8 rounded-lg bg-[#eef4ee] flex items-center justify-center shrink-0">
        {isDeleting ? (
          <Loader2 size={14} className="text-[#2d4a2d] animate-spin" />
        ) : (
          <Calendar size={14} className="text-[#2d4a2d]" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">
          {label} <span className="text-gray-300">·</span> {time}
        </p>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">{duration}</span>

          {patient && (
            <>
              <span className="text-gray-300">·</span>
              <img
                src={avatar(patient)}
                className="w-4 h-4 rounded-full"
                alt={patient}
              />
              <span className="text-xs text-gray-600 font-medium">
                {patient}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Type badge */}
      <span
        className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
          TYPE_STYLE[visitType] || TYPE_STYLE["Online"]
        }`}
      >
        {visitType}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {isBooked ? (
          <button
            onClick={() => onReschedule?.(slot)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:border-[#2d4a2d] hover:text-[#2d4a2d] transition-colors"
          >
            <RefreshCw size={11} /> Reschedule
          </button>
        ) : (
          <>
            <button
              onClick={() => onEdit?.(slot)}
              title="Edit"
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-[#eef4ee] hover:text-[#2d4a2d] hover:border-[#2d4a2d] transition-colors"
            >
              <Edit2 size={13} />
            </button>

            <button
              onClick={() => onDelete?.(slot.id)}
              title="Delete"
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}