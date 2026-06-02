import { useState } from "react";
import { BadgeCheck, Globe, Building2, ChevronDown, ChevronUp } from "lucide-react";

export default function AboutSection() {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        role="button" tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen((o) => !o)}
        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer select-none"
      >
        <div>
          <span className="text-sm font-bold text-gray-800">About & Clinic Info</span>
          <p className="text-xs text-gray-400 mt-0.5">Bio, languages, location and fees</p>
        </div>
        <div className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 px-6 py-5 flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">About</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Dr. Ahmed Hassan is a board-certified OB/GYN with over 12 years of experience
              specializing in high-risk pregnancies, prenatal care, and minimally invasive
              gynecological procedures. He is committed to providing compassionate,
              evidence-based care tailored to each patient's needs.
            </p>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Languages</p>
              <div className="flex flex-col gap-1.5">
                {["Arabic","English","French"].map((lang) => (
                  <span key={lang} className="text-xs px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Clinic</p>
              <div className="flex flex-col gap-1 text-xs text-gray-600">
                <p className="font-medium">Nile Medical Center</p>
                <p className="text-gray-400">14 Tahrir St., Dokki</p>
                <p className="text-gray-400">Cairo, Egypt</p>
                <p className="text-gray-400">Floor 3, Room 305</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Fees</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100">
                  <span className="text-xs text-gray-500 flex items-center gap-1"><Globe size={10} /> Online</span>
                  <span className="text-xs font-semibold text-gray-800">EGP 300</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100">
                  <span className="text-xs text-gray-500 flex items-center gap-1"><Building2 size={10} /> In-clinic</span>
                  <span className="text-xs font-semibold text-gray-800">EGP 450</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">Cancellation policy</p>
            <p className="text-xs text-gray-500 leading-relaxed bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
              Cancellations made more than 24 hours in advance are fully refunded.
              Cancellations within 24 hours are non-refundable.
            </p>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Certifications</p>
            <div className="flex flex-wrap gap-2">
              {["Egyptian Medical Syndicate","ACOG Board Certified","FIGO Member","Cairo University MD"].map((cert) => (
                <span key={cert} className="flex items-center gap-1.5 text-xs bg-[#eef4ee] text-[#2d4a2d] border border-[#c8ddc8] px-2.5 py-1 rounded-lg font-medium">
                  <BadgeCheck size={11} /> {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}