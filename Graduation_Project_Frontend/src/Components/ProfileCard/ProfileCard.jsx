import React, { useState, useRef, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  BadgeCheck,
  Users,
  Star,
  Pencil,
  X,
  Plus,
  Loader2,
  Camera,
} from "lucide-react";

const BASE_URL = "https://her-journey-1044023551709.us-central1.run.app/";

export const avatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4e6d4&color=2d4a2d&size=128`;

function StatPill({ icon: Icon, value, label, iconColor, iconBg }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-100 bg-gray-50 lg:min-w-[72px]">
      <div
        className={`w-7 h-7 rounded-full ${iconBg} flex items-center justify-center`}
      >
        <Icon size={14} className={iconColor} />
      </div>
      <p className="text-sm lg:text-base font-bold text-gray-800 leading-none">
        {value}
      </p>
      <p className="text-[10px] text-gray-400 text-center">{label}</p>
    </div>
  );
}

export default function ProfileCard({ token }) {
  const [profile, setProfile] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [lightbox, setLightbox] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const load = async () => {
      setFetchLoading(true);
      setFetchError("");
      try {
        const res = await fetch(`${BASE_URL}/api/Doctor/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);
        const data = await res.json();
        console.log("initial profile →", JSON.stringify(data));
        setProfile({
          name: data.displayName ?? "Doctor",
          email: data.email ?? "",
          phone: data.phoneNumber ?? "",
          location: data.location ?? "",
          yearsOfExperience: data.yearsOfExperience ?? 0,
          photoUrl: data.profileImageUrl ?? null,
          specializations: data.specializations ?? [],
          patientsCount: data.patientsCount ?? 0,
          status: data.status ?? "Active",
        });
      } catch (e) {
        setFetchError(e.message || "Could not load profile.");
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [token]);

  const openEdit = () => {
    setForm({
      location: profile.location,
      yearsOfExperience: profile.yearsOfExperience,
      specializations: [...profile.specializations],
    });
    setEditing(true);
    setSaveError("");
  };
  const closeEdit = () => {
    setEditing(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setTagInput("");
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || form.specializations.includes(trimmed)) return;
    setForm((f) => ({
      ...f,
      specializations: [...f.specializations, trimmed],
    }));
    setTagInput("");
  };

  const removeTag = (tag) =>
    setForm((f) => ({
      ...f,
      specializations: f.specializations.filter((t) => t !== tag),
    }));

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const fd = new FormData();
      if (photoFile) fd.append("ProfileImage", photoFile);
      fd.append("Location", form.location ?? "");
      fd.append("YearsOfExperience", String(Number(form.yearsOfExperience)));
      form.specializations.forEach((s) => fd.append("Specializations", s));

      const res = await fetch(`${BASE_URL}/api/Doctor/complete-profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Server error (${res.status})`);
      }

      // inside try, before the fetch call:
      for (let [key, val] of fd.entries()) console.log("FormData →", key, val);
      const result = await res.json();
      if (!result.status) throw new Error(result.message || "Update failed");

      setProfile((prev) => ({
        ...prev,
        location: form.location,
        yearsOfExperience: Number(form.yearsOfExperience),
        specializations: form.specializations,
        photoUrl: photoPreview ?? prev.photoUrl,
      }));

      const refreshRes = await fetch(`${BASE_URL}/api/Doctor/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshRes.ok) {
        const fresh = await refreshRes.json();
        console.log("fresh profile →", JSON.stringify(fresh));
        setProfile((prev) => ({
          ...prev,
          photoUrl: fresh.profileImageUr1 ?? prev.photoUrl,
          patientsCount: fresh.patientsCount ?? prev.patientsCount,
        }));
      }

      closeEdit();
    } catch (e) {
      setSaveError(e.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 flex items-center gap-3 text-gray-400 text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading profile…
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 shadow-md p-6 text-sm text-red-500">
        {fetchError}
      </div>
    );
  }

  const displayPhoto = profile.photoUrl || avatar(profile.name);
  const previewPhoto = photoPreview || profile.photoUrl || avatar(profile.name);

  return (
    <>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="flex items-center lg:items-end gap-3 lg:gap-4 min-w-0">
            <div className="relative shrink-0">
              <img
                src={displayPhoto}
                alt={profile.name}
                onClick={() => setLightbox(true)}
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 lg:border-4 border-white shadow-md cursor-pointer hover:opacity-90 transition-opacity"
              />
              <span className="absolute bottom-0.5 right-0.5 lg:bottom-1 lg:right-1 w-3 h-3 lg:w-3.5 lg:h-3.5 bg-green-400 rounded-full border-2 border-white" />
            </div>

            <div className="min-w-0 lg:pb-0.5">
              <div className="flex items-center gap-2 mb-0 lg:mb-1 flex-wrap">
                <h2 className="text-base lg:text-lg font-bold text-gray-900 truncate">
                  {profile.name}
                </h2>
                <span className="text-[10px] lg:text-xs bg-green-50 text-green-700 font-semibold px-2 lg:px-2.5 py-0.5 rounded-full border border-green-200 shrink-0">
                  {profile.status}
                </span>
                <button
                  onClick={openEdit}
                  className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#2d4a2d] transition-colors ml-1"
                >
                  <Pencil size={11} /> Edit
                </button>
              </div>

              <div className="hidden lg:flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                {profile.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail size={11} className="text-gray-400" />
                    {profile.email}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={11} className="text-gray-400" />
                    {profile.phone}
                  </span>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-gray-400" />
                    {profile.location}
                  </span>
                )}
              </div>

              {profile.specializations.length > 0 && (
                <div className="hidden lg:flex gap-1.5 mt-2.5 flex-wrap">
                  {profile.specializations.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef4ee] text-[#2d4a2d] font-medium border border-[#c8ddc8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex gap-3 shrink-0">
            <StatPill
              icon={BadgeCheck}
              value={`${profile.yearsOfExperience} yrs`}
              label="Experience"
              iconColor="text-green-700"
              iconBg="bg-green-50"
            />
            <StatPill
              icon={Users}
              value={profile.patientsCount}
              label="Patients"
              iconColor="text-blue-500"
              iconBg="bg-blue-50"
            />
            <StatPill
              icon={Star}
              value="4.9"
              label="Rating"
              iconColor="text-amber-500"
              iconBg="bg-amber-50"
            />
          </div>
        </div>
        
        <div className="lg:hidden">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-3">
            {profile.email && (
              <span className="flex items-center gap-1.5 truncate">
                <Mail size={11} className="text-gray-400 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </span>
            )}
            {profile.phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={11} className="text-gray-400 shrink-0" />
                {profile.phone}
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={11} className="text-gray-400 shrink-0" />
                {profile.location}
              </span>
            )}
          </div>

          {profile.specializations.length > 0 && (
            <div className="flex gap-1.5 mt-2.5 flex-wrap">
              {profile.specializations.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-[#eef4ee] text-[#2d4a2d] font-medium border border-[#c8ddc8]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mt-4">
            <StatPill
              icon={BadgeCheck}
              value={`${profile.yearsOfExperience} yrs`}
              label="Experience"
              iconColor="text-green-700"
              iconBg="bg-green-50"
            />
            <StatPill
              icon={Users}
              value={profile.patientsCount}
              label="Patients"
              iconColor="text-blue-500"
              iconBg="bg-blue-50"
            />
            <StatPill
              icon={Star}
              value="4.9"
              label="Rating"
              iconColor="text-amber-500"
              iconBg="bg-amber-50"
            />
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
          onClick={() => setLightbox(false)}
        >
          <div className="relative " onClick={(e) => e.stopPropagation()}>
            <img
              src={displayPhoto}
              alt={profile.name}
              className="w-80 h-80 rounded-full object-cover border-4 border-white shadow-2xl"
            />
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                Edit Profile
              </h3>
              <button
                onClick={closeEdit}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50"
              >
                <X size={15} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              {saveError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  {saveError}
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={previewPhoto}
                    alt="preview"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <button
                    onClick={() => fileRef.current.click()}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Camera size={16} className="text-white" />
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => fileRef.current.click()}
                    className="text-xs font-semibold text-[#2d4a2d] border border-[#c8ddc8] bg-[#eef4ee] px-3 py-1.5 rounded-lg hover:bg-[#ddeedd] transition-colors"
                  >
                    Change photo
                  </button>
                  <p className="text-[10px] text-gray-400 mt-1 ps-2">
                    JPG or PNG
                  </p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhoto}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                  Location
                </label>
                <div className="relative">
                  <MapPin
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    placeholder="City, Country"
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-[#2d4a2d]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                  Years of experience
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={form.yearsOfExperience}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      yearsOfExperience: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-[#2d4a2d]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                  Specializations
                </label>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Type and press Enter"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-[#2d4a2d]"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 rounded-xl bg-[#2d4a2d] text-white hover:bg-[#3a6b3a] transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {form.specializations.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-[#eef4ee] text-[#2d4a2d] font-medium border border-[#c8ddc8]"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400 transition-colors ml-0.5"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60">
              <button
                onClick={closeEdit}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-[#2d4a2d] text-white text-xs font-semibold hover:bg-[#3a6b3a] disabled:opacity-40 flex items-center gap-2 transition-colors"
              >
                {saving && <Loader2 size={12} className="animate-spin" />}
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
