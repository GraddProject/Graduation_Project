import { useState, useRef, useEffect, useContext } from "react";
import { Video, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { AppointmentAction } from "../AppointmentAction/AppointmentAction";
import RescheduleModal from "../DoctorModals/RescheduleModal";
import { UserContext } from "../../Components/context/User.context";

const VISIT_STYLES = {
  "In-Person": "bg-blue-50 text-blue-500",
  Online: "bg-green-50 text-green-600",
};

const DATE_LABEL_COLOR = {
  Today: "text-green-600",
  Tomorrow: "text-blue-500",
  Yesterday: "text-gray-400",
};

function dateLabelColor(dateLabel, isCancelled) {
  if (isCancelled) return "text-red-400";
  return DATE_LABEL_COLOR[dateLabel] ?? "text-gray-400";
}

function ActionsMenu({ actions, onReschedule }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const VARIANT_STYLES = {
    primary: "text-green-700 font-semibold",
    "primary-green": "text-green-600 font-semibold",
    outline: "text-gray-600",
    "outline-danger": "text-red-500",
    disabled: "text-gray-300 cursor-not-allowed",
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-50 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 overflow-hidden">
          {actions.map((action, i) => {
            const { label, variant, icon, apptDateTime } = action;
            const countdown =
              variant === "disabled" && apptDateTime
                ? formatDistanceToNow(apptDateTime, { addSuffix: true })
                : null;

            return (
              <button
                key={i}
                disabled={variant === "disabled"}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  if (label === "Reschedule") {
                    onReschedule();
                  } else if (action.onClick) {
                    action.onClick();
                  }
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${VARIANT_STYLES[variant] ?? VARIANT_STYLES.outline}`}
              >
                {icon === "video" && <Video size={13} />}
                <span>{countdown ? `Starts ${countdown}` : label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AppointmentRow({ appointment }) {
  const [showReschedule, setShowReschedule] = useState(false);
  const { token } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    patientAvatar,
    patientName,
    appointmentType,
    visitType,
    time,
    duration,
    dateLabel,
    status,
    patientId,
  } = appointment;

  const actions = AppointmentAction(appointment, token);
  const isCancelled = status === "Cancelled";
  const labelColor = dateLabelColor(dateLabel, isCancelled);

  return (
    <>
      <div
        onClick={() => navigate(`/doctor/patient-profile/${patientId}`)}
        className="cursor-pointer flex items-center gap-3 px-3 lg:px-5 py-3 lg:py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
      >
        <div className="hidden lg:flex w-24 shrink-0 flex-col gap-0.5">
          <p className={`text-xs font-semibold ${labelColor}`}>{dateLabel}</p>
          <p className="text-base font-extrabold text-gray-800 leading-tight">{time}</p>
          <p className="text-xs text-gray-400">{duration}</p>
        </div>

        <img
          src={patientAvatar}
          alt={patientName}
          className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full object-cover shrink-0 ${isCancelled ? "grayscale opacity-60" : ""}`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 lg:hidden">
            <span className={`text-[10px] font-semibold ${labelColor}`}>{dateLabel}</span>
            <span className="text-[10px] text-gray-300">·</span>
            <span className="text-[10px] font-bold text-gray-600">{time}</span>
            <span className="text-[10px] text-gray-400">({duration})</span>
          </div>

          <p className={`text-sm font-semibold truncate ${isCancelled ? "line-through text-gray-400" : "text-gray-800"}`}>
            {patientName}
          </p>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400 truncate hidden sm:inline">{appointmentType}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${VISIT_STYLES[visitType]}`}>
              {visitType}
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {actions.map((action, i) => (
            <DesktopActionButton
              key={i}
              action={action}
              onClick={(e) => {
                e.stopPropagation();
                if (action.label === "Reschedule") {
                  setShowReschedule(true);
                } else if (action.onClick) {
                  action.onClick();
                }
              }}
            />
          ))}
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MoreVertical size={15} />
          </button>
        </div>

        <div className="lg:hidden shrink-0">
          <ActionsMenu actions={actions} onReschedule={() => setShowReschedule(true)} />
        </div>
      </div>

      {showReschedule && (
        <RescheduleModal
          isOpen={showReschedule}
          slot={appointment}
          onClose={() => setShowReschedule(false)}
          token={token}
          onSaved={() => setShowReschedule(false)}
        />
      )}
    </>
  );
}

function DesktopActionButton({ action, onClick }) {
  const { label, variant, icon, apptDateTime } = action;
  const countdown =
    variant === "disabled" && apptDateTime
      ? formatDistanceToNow(apptDateTime, { addSuffix: true })
      : null;

  const base = "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all";
  const styles = {
    primary: "bg-green-700 text-white hover:bg-[#3a6b3a]",
    "primary-green": "bg-green-600 text-white hover:bg-green-700",
    outline: "border border-gray-200 text-gray-600 hover:border-gray-300",
    "outline-danger": "border border-red-300 text-red-500 hover:bg-red-50",
    disabled: "border border-gray-200 text-gray-300 cursor-not-allowed",
  };

  return (
    <button
      onClick={onClick}
      disabled={variant === "disabled"}
      title={countdown ? `Starts ${countdown}` : undefined}
      className={`${base} ${styles[variant] ?? styles.outline}`}
    >
      {icon === "video" && <Video size={13} />}
      {countdown ? `Starts ${countdown}` : label}
    </button>
  );
}