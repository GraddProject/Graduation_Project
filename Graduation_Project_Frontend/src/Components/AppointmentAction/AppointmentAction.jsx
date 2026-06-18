import { isAfter, isBefore, addMinutes, parseISO } from "date-fns";

const BASE_URL = "https://her-journey-1044023551709.us-central1.run.app";

export function AppointmentAction(appointment, token) {
  const { status, visitType, date, time, id: appointmentId } = appointment;

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

    console.log("appointment object:", appointment); 
    console.log("appointmentId:", appointmentId); 
    console.log("token:", token); 

    return [
      {
        label: "Join",
        variant: isLive ? "primary-green" : "disabled",
        icon: "video",
        isLive,
        apptDateTime,
        onClick: isLive
          ? () => joinOnlineSession(appointmentId, token)
          : undefined,
      },
      { label: "Reschedule", variant: "outline" },
    ];
  }

  return [];
}

async function joinOnlineSession(appointmentId, token) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/Doctor/appointments/${appointmentId}/online-session/start`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch session: ${res.status}`);
    }

    const data = await res.json();
    console.log("session data:", data);

    if (!data.canStartNow) {
      alert("The session is not available to start yet.");
      return;
    }

    window.open(data.startUrl, "_blank");

    if (data.password) {
      console.log("Meeting password:", data.password);
    }
  } catch (err) {
    console.error("Error joining session:", err);
    alert("Could not join the session. Please try again.");
  }
}

function to24h(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}
