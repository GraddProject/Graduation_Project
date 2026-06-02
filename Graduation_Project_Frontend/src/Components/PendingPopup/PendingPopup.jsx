import { X, Clock } from "lucide-react";

const avatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4e6d4&color=2d4a2d&size=64`;

const VISIT_STYLES = {
  "In-Person": "bg-blue-50 text-blue-500",
  "Online": "bg-green-50 text-green-600",
};

export default function PendingPopup({ pendingList, onClose, onConfirm, onDecline }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg  overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 ">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-800">Pending Requests</h2>
            <span className="text-xs bg-red-100 text-red-500 font-semibold px-2 py-0.5 rounded-full">
              {pendingList.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
          {pendingList.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-10">No pending requests.</p>
          ) : (
            pendingList.map((appt) => (
              <div key={appt.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer">
                {/* Avatar */}
                <img
                  src={appt.patientAvatar || avatar(appt.patientName)}
                  alt={appt.patientName}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{appt.patientName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{appt.appointmentType}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${VISIT_STYLES[appt.visitType]}`}>
                      {appt.visitType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{appt.dateLabel} · {appt.time} · {appt.duration}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => onConfirm(appt)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-700 text-white hover:bg-green-800 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => onDecline(appt)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}