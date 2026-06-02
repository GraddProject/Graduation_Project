import React, { useState, useRef } from "react";
import { Mail, Phone, MapPin, BadgeCheck, Users, Star, Pencil, X, Plus, Loader2, Camera } from "lucide-react";

export const avatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4e6d4&color=2d4a2d&size=128`;

function StatPill({ icon: Icon, value, label, iconColor, iconBg }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 min-w-[72px]">
      <div className={`w-7 h-7 rounded-full ${iconBg} flex items-center justify-center`}>
        <Icon size={14} className={iconColor} />
      </div>
      <p className="text-base font-bold text-gray-800 leading-none">{value}</p>
      <p className="text-[10px] text-gray-400">{label}</p>
    </div>
  );
}

const INITIAL = {
  name: "Dr. Ahmed Hassan",
  email: "ahmed.hassan@herjourney.com",
  phone: "+20 102 345 6789",
  location: "Cairo, Egypt",
  yearsOfExperience: 12,
  photoUrl: null,
  specializations: ["Obstetrics", "Gynecology", "Prenatal Care", "High-Risk Pregnancy", "Ultrasound"],
};

export default function ProfileCard({ token }) {
  const [profile, setProfile]     = useState(INITIAL);
  const [editing, setEditing]     = useState(false);
  const [form, setForm]           = useState(INITIAL);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [tagInput, setTagInput]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const fileRef = useRef();

  const openEdit = () => { setForm(profile); setEditing(true); setError(""); };
  const closeEdit = () => { setEditing(false); setPhotoFile(null); setPhotoPreview(null); setTagInput(""); };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || form.specializations.includes(trimmed)) return;
    setForm((f) => ({ ...f, specializations: [...f.specializations, trimmed] }));
    setTagInput("");
  };

  const removeTag = (tag) =>
    setForm((f) => ({ ...f, specializations: f.specializations.filter((t) => t !== tag) }));

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      // ── 1. Upload photo separately if changed ──
      let newPhotoUrl = form.photoUrl;
      if (photoFile) {
        const fd = new FormData();
        fd.append("photo", photoFile);
        const res = await fetch(
          "https://her-journey-669913381811.us-central1.run.app/api/Doctor/UploadPhoto",
          { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd }
        );
        if (!res.ok) throw new Error("Photo upload failed");
        const data = await res.json();
        newPhotoUrl = data.photoUrl; 
      }

      // ── 2. Update profile fields ──
      const res = await fetch(
        "https://her-journey-669913381811.us-central1.run.app/api/Doctor/UpdateProfile",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            location: form.location,
            yearsOfExperience: Number(form.yearsOfExperience),
            specializations: form.specializations,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update profile");

      setProfile({ ...form, photoUrl: newPhotoUrl });
      closeEdit();
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const displayPhoto = profile.photoUrl || avatar(profile.name);
  const previewPhoto = photoPreview || form.photoUrl || avatar(form.name);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="relative shrink-0">
              <img
                src={displayPhoto}
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
            </div>

            <div className="pb-0.5">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-gray-900">{profile.name}</h2>
                <span className="text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-0.5 rounded-full border border-green-200">
                  Active
                </span>
                <button
                  onClick={openEdit}
                  className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#2d4a2d] transition-colors ml-1"
                >
                  <Pencil size={11} /> Edit
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><Mail size={11} className="text-gray-400" />{profile.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={11} className="text-gray-400" />{profile.phone}</span>
                {profile.location && (
                  <span className="flex items-center gap-1.5"><MapPin size={11} className="text-gray-400" />{profile.location}</span>
                )}
              </div>

              {profile.specializations.length > 0 && (
                <div className="flex gap-1.5 mt-2.5 flex-wrap">
                  {profile.specializations.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef4ee] text-[#2d4a2d] font-medium border border-[#c8ddc8]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <StatPill icon={BadgeCheck} value={`${profile.yearsOfExperience} yrs`} label="Experience" iconColor="text-green-700" iconBg="bg-green-50" />
            <StatPill icon={Users} value="284" label="Patients" iconColor="text-blue-500" iconBg="bg-blue-50" />
            <StatPill icon={Star} value="4.9" label="Rating" iconColor="text-amber-500" iconBg="bg-amber-50" />
          </div>
        </div>
      </div>

      
    </>
  );
}