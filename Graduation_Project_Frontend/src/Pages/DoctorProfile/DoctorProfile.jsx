import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { UserContext } from "../../Components/context/User.context";
import SlotsList from "../../Components/SlotList/SlotList";
import AddSlotModal from "../../Components/DoctorModals/AddSlotModal";
import EditSlotModal from "../../Components/DoctorModals/EditSlotModal";
import RescheduleModal from "../../Components/DoctorModals/RescheduleModal";
import TopBar from "../../Components/TopBar/TopBar";
import ProfileCard from "../../Components/ProfileCard/ProfileCard";

const API_BASE = "https://her-journey-1044023551709.us-central1.run.app/";

const DAY_ABBR_TO_FULL = {
  Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday",
  Thu: "Thursday", Fri: "Friday", Sat: "Saturday",
};

export default function DoctorProfile() {
  const { token } = useContext(UserContext);

  const [slots,        setSlots]        = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError,   setSlotsError]   = useState("");
  const [deletingIds,  setDeletingIds]  = useState([]);
  const [showAddModal,   setShowAddModal]   = useState(false);
  const [editSlot,       setEditSlot]       = useState(null);
  const [rescheduleSlot, setRescheduleSlot] = useState(null);

  const [filterDay,    setFilterDay]    = useState(null);       
  const [filterType,   setFilterType]   = useState("All");     
  const [filterDate,   setFilterDate]   = useState("All");      

  const getSlots = useCallback(async () => {
    setSlotsLoading(true);
    setSlotsError("");
    try {
      const params = new URLSearchParams();
      if (filterType !== "All")  params.set("Type",       filterType);
      if (filterDay)             params.set("DayOfWeek",  DAY_ABBR_TO_FULL[filterDay]);
      if (filterDate !== "All")  params.set("DateFilter", filterDate);

      const { data } = await axios.get(
        `${API_BASE}/api/Doctor/GetAvailabilityOverview?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSlots(Array.isArray(data) ? data : []);
    } catch (e) {
      setSlotsError(e.message || "Failed to load slots.");
    } finally {
      setSlotsLoading(false);
    }
  }, [filterDay, filterType, filterDate, token]);

  useEffect(() => { getSlots(); }, [getSlots]);

  async function handleDelete(slotIds) {
    setDeletingIds(slotIds);
    try {
      await axios.delete(
        `${API_BASE}/api/Doctor/DeleteAvailabilitySlots`,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          data: { slotIds },
        }
      );
      getSlots();
    } catch (e) {
      // handle error
    } finally {
      setDeletingIds([]);
    }
  }

  const available = slots.filter((s) =>
    s.bookingStatus?.toLowerCase() === "available" ||
    s.displayStatus?.toLowerCase() === "available"
  );
  const booked = slots.filter((s) =>
    s.bookingStatus?.toLowerCase() === "booked" ||
    s.displayStatus?.toLowerCase() === "booked"
  );

  return (
    <div className="flex-1 flex flex-col bg-[#f5f7f5] min-h-screen overflow-auto">
 
      <div className="px-8 pb-8 pt-5 flex flex-col gap-5">
        <ProfileCard />

        <SlotsList
          title="My Availability"
          subtitle="Your available slots for booking"
          slots={available}
          loading={slotsLoading}
          error={slotsError}
          onRetry={getSlots}
          isBooked={false}
          onEdit={setEditSlot}
          deletingIds={deletingIds}
          onDelete={handleDelete}
          onDeleteAll={() => handleDelete(available.map((s) => s.id))}
          onAddSlot={() => setShowAddModal(true)}
        
        />

        <SlotsList
          title="Booked Appointments"
          subtitle="Slots reserved by patients"
          slots={booked}
          loading={slotsLoading}
          error={slotsError}
          onRetry={getSlots}
          isBooked={true}
          onReschedule={setRescheduleSlot}
          deletingIds={deletingIds}
         
        />

        <footer className="text-center pt-2">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
            {["About","Privacy","Support","Guidelines"].map((l) => (
              <a key={l} href="#" className="hover:text-gray-600 transition-colors">{l}</a>
            ))}
          </div>
        </footer>
      </div>

      {showAddModal && (
        <AddSlotModal token={token}
          onClose={() => setShowAddModal(false)}
          onSaved={getSlots} />
      )}
      {editSlot && (
        <EditSlotModal slot={editSlot} token={token}
          onClose={() => setEditSlot(null)}
          onSaved={getSlots} />
      )}
      {rescheduleSlot && (
        <RescheduleModal slot={rescheduleSlot} token={token}
          onClose={() => setRescheduleSlot(null)}
          onSaved={getSlots} />
      )}
    </div>
  );
}