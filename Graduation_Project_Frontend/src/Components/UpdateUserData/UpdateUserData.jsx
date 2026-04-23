import { useEffect, useState } from "react";
import { X, Pencil, Mail, Phone, Calendar, Search } from "lucide-react";
import axios from "axios";

export default function UpdateUserData({ user, onClose }) {
  const role = user?.role || "Patient";

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    blood: user?.blood || "",
    dob: user?.dob || "",
    week: user?.week || "",
    doctor: user?.doctor || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  async function handleUpdate() {
    try {
      const roleApi =
        user.role.toLowerCase() === "doctor" ? "Doctor" : "Patient";

      const id = user.id;

      const options = {
        url: `https://her-journey-161730893876.us-central1.run.app/api/Admin/Update${roleApi}/${id}`,
        method: "PUT",
        data: formData,
      };

      await axios.request(options);

      onClose(true);
    } catch (error) {
      console.error(error);
      onClose(false);
    }
  }
  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-[0px_2px_4px_#00000012] w-full max-w-xl px-6 py-6'>
        {/* close */}
        <div className="flex justify-end" onClick={() => onClose(false)}>
          <X size={20} className="text-[#8A9A8AFF] cursor-pointer" />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-[#F5FAF5FF] rounded-full flex items-center justify-center">
            <Pencil size={20} className="text-[#8A9A8AFF]" />
          </div>
          <div>
            <h1 className="text-[#2C3E2FFF] font-bold text-xl">Edit User Information</h1>
            <span className="text-[#7A8F7CFF] text-sm">Update details for {user.name}</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-[#7A8F7CFF] text-xs font-semibold uppercase">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className="w-full mt-2 border rounded-lg px-3 py-2 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#7A8F7CFF] text-xs font-semibold uppercase">Email Address</label>
              <div className="relative mt-2">
                <Mail size={16} className="absolute left-3 top-3 text-gray-400"/>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full border rounded-lg pl-9 pr-3 py-2 outline-none"/>
              </div>
            </div>
            <div>
              <label className="text-[#7A8F7CFF] text-xs font-semibold uppercase">Phone Number</label>
              <div className="relative mt-2">
                <Phone size={16} className="absolute left-3 top-3 text-gray-400"/>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full border rounded-lg pl-9 pr-3 py-2 outline-none"/>
              </div>
            </div>
          </div>

          {role === "Patient" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#7A8F7CFF] uppercase">Blood Type</label>
                  <select name="blood" value={formData.blood} onChange={handleChange}
                    className="w-full mt-2 border rounded-lg px-3 py-2">
                    <option>A+</option>
                    <option>B+</option>
                    <option>O+</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#7A8F7CFF] uppercase">Date of Birth</label>
                  <div className="relative mt-2">
                    <Calendar size={16} className="absolute left-3 top-3 text-gray-400"/>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange}
                      className="w-full border rounded-lg pl-9 pr-3 py-2 bg-gray-100"/>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#7A8F7CFF] uppercase">Current Pregnancy Week</label>
                  <input name="week" value={formData.week} onChange={handleChange}
                    className="w-full mt-2 border rounded-lg px-3 py-2"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#7A8F7CFF] uppercase">Assigned Doctor</label>
                  <div className="relative mt-2">
                    <Search size={16} className="absolute right-3 top-3 text-gray-400"/>
                    <input name="doctor" value={formData.doctor} onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2"/>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button className="border px-4 py-2 rounded-lg" onClick={() => onClose(false)}>Cancel</button>
          <button className="bg-[#667E68FF] text-white px-4 py-2 rounded-lg" onClick={handleUpdate}>
            Update User
          </button>
        </div>
      </div>
    </div>
  );
}