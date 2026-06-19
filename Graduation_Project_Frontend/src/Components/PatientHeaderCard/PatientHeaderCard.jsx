import React from "react";
import { Mail, Phone, Calendar } from "lucide-react";
import ProgressBar from "../ProgressBar/ProgressBar";
import { formatDate } from "../../helpers/formatDate";
import { getInitials } from "../../helpers/getInitials";

export default function PatientHeaderCard({
  patient,
  imageError,
  setImageError,
  progress,
}) {
  const badges = [
    { label: "BloodType", value: patient?.bloodType },
    { label: "Age", value: `${patient?.age} Year` },
    { label: "Height", value: `${patient?.height} cm` },
    { label: "Weight", value: `${patient?.weight} kg` },
    { label: "Num of Pregnancies", value: patient?.numberofPregnancies },
  ];

  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-xl shadow overflow-hidden">

      <div className="w-full sm:w-[4px] h-[4px] sm:h-auto bg-gradient-to-b from-[#4A5F4E] to-[#667E68]" />

      <div className="flex flex-col sm:flex-row px-3 py-4 justify-between items-start sm:items-center w-full gap-4">

        {/* LEFT SIDE */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">

          <div className="relative shrink-0">
            {patient.image && !imageError ? (
              <img
                src={patient.image}
                onError={() => setImageError(true)}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#4A6B4E] flex items-center justify-center text-white font-bold">
                {getInitials(patient.name)}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">

            {/* NAME + STATUS moved here next to image */}
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-[#191B18FF]">
                {patient.name}
              </h1>

              <span className="px-3 py-0.5 text-xs font-semibold rounded-2xl bg-[#ebffef] text-[#247b34] border w-fit">
                {patient.actived ? "Active" : "Inactive"}
              </span>
            </div>

            {/* CONTACT */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">

              <div className="flex items-center gap-1">
                <Mail size={12} className="text-[#566454]" />
                <span className="text-xs text-[#a3a79f]">
                  {patient.email}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Phone size={12} className="text-[#C9955FFF]" />
                <span className="text-xs text-[#a3a79f]">
                  {patient.phone}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar size={12} className="text-[#566454]" />
                <span className="text-xs text-[#a3a79f]">
                  Member Since {formatDate(patient.activeDate)}
                </span>
              </div>

            </div>

            {/* BADGES */}
            <div className="flex flex-wrap gap-2 mt-1">
              {badges.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#eef4ee] border border-[#c8ddc8] rounded-2xl py-1 px-3"
                >
                  <p className="text-[#2d4a2d] text-xs">
                    {item.label}: {item.value}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-3 px-3 py-2 w-full sm:w-4/12">

          <div className="flex justify-between">
            <p className="text-xs uppercase text-[#a3a79f] font-semibold">
              Pregnancy Progress
            </p>

            <p className="text-xs text-[#4A5F4EFF] font-semibold">
              Week {patient.week} / {patient.trimester}
            </p>
          </div>

          <ProgressBar value={progress.percentage} color="#667E68FF" />

          <span className="text-xs text-[#a3a79f]">
            Start Date: {formatDate(patient.startDate)}
          </span>

        </div>

      </div>
    </div>
  );
}