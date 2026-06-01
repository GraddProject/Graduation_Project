import { Video, Phone, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AppointmentAction } from "../AppointmentAction/AppointmentAction";


const VISIT_STYLES = {
  "In-Person": "bg-blue-50 text-blue-500",
  "Online":    "bg-green-50 text-green-600",
};

export default function AppointmentRow({ appointment }) {
  const {
    patientAvatar, patientName, appointmentType,
    visitType, time, duration, dateLabel, status, phone,
  } = appointment;

  const actions = AppointmentAction(appointment);
  const isCancelled = status === "Cancelled";

  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      
      <div className="w-24 flex flex-col gap-1">
        <p className={`text-xs font-semibold mb-0.5 ${
          dateLabel === "Today" ? "text-green-600" :
          dateLabel === "Tomorrow" ? "text-blue-500" :
          isCancelled ? "text-red-400" : "text-gray-400"
        }`}>
          {dateLabel}
        </p>
        <p className="text-base font-extrabold text-gray-800 leading-tight">{time}</p>
        <p className="text-xs text-gray-400 mt-0.5">{duration}</p>
      </div>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <img
          src={patientAvatar}
          alt={patientName}
          className={`w-10 h-10 rounded-full object-cover shrink-0 ${isCancelled ? "grayscale opacity-60" : ""}`}
        />
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${isCancelled ? "line-through text-gray-400" : "text-gray-800"}`}>
            {patientName}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">{appointmentType}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${VISIT_STYLES[visitType]}`}>
              {visitType}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {actions.map((action, i) => (
          <ActionButton key={i} action={action} />
        ))}
        <button className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <MoreVertical size={15} />
        </button>
      </div>
    </div>
  );
}

function ActionButton({ action }) {
  const { label, variant, icon, apptDateTime } = action;

  const countdown = apptDateTime
    ? formatDistanceToNow(apptDateTime, { addSuffix: true })
    : null;

  const base = "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-all";

  const styles = {
    "primary":        "bg-green-700 text-white hover:bg-[#3a6b3a]",
    "primary-green":  "bg-green-600 text-white hover:bg-green-700",
    "outline":        "border border-gray-200 text-gray-600 hover:border-gray-300",
    "outline-danger": "border border-red-300 text-red-500 hover:bg-red-50",
    "disabled":       "border border-gray-200 text-gray-300 cursor-not-allowed",
  };

  return (
    <button
      disabled={variant === "disabled"}
      title={variant === "disabled" && countdown ? `Starts ${countdown}` : undefined}
      className={`${base} ${styles[variant] ?? styles["outline"]}`}
    >
      {icon === "video" && <Video size={13} />}
      {variant === "disabled" && countdown ? `Starts ${countdown}` : label}
    </button>
  );
}