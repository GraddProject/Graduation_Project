import { isAfter, isBefore, addMinutes, parseISO } from "date-fns";

export function AppointmentAction(appointment) {
  const { status, visitType, date, time } = appointment;

  if (status === "Completed") {
    return [{ label: "View Summary", variant: "outline" }];
  }

  if (status === "Cancelled") {
    return [{ label: "Reschedule", variant: "outline" }];
  }

  if (status === "Pending") {
    return [
      { label: "Confirm", variant: "primary" },
      { label: "Decline", variant: "outline-danger" },
    ];
  }

  if (visitType === "In-Person") {
    return [
      { label: "View Profile", variant: "outline" },
      { label: "Reschedule", variant: "outline" },
    ];
  }

  if (visitType === "Online") {
    const apptDateTime = parseISO(`${date}T${to24h(time)}`);
    const now = new Date();
    const windowStart = addMinutes(apptDateTime, -15);
    const windowEnd = addMinutes(apptDateTime, 60);
    const isLive = isAfter(now, windowStart) && isBefore(now, windowEnd);

    return [
      {
        label: isLive ? "Join" : `Join`,
        variant: isLive ? "primary-green" : "disabled",
        icon: "video",
        isLive,
        apptDateTime,
      },
      { label: "Reschedule", variant: "outline" },
    ];
  }

  return [];
}

// Convert "09:00 AM" → "09:00:00"
function to24h(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}