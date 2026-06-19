import React, { useState, useEffect, useContext } from "react";
import NextAppointment from "../../Components/NextAppointment/NextAppointment";
import LastVisitSummary from "../../Components/LastVisitSummary/LastVisitSummary";
import MyPrescriptions from "../../Components/MyPrescriptions/MyPrescriptions";
import QuickActions from "../../Components/QuickActions/QuickActions";
import ultrasound from "../../assets/visily-image.png";
import { UserContext } from "../../Components/context/User.context";

const API_BASE = "https://her-journey-1044023551709.us-central1.run.app/";

export default function PatientDashboard() {
  const { token } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/Patient/Profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const week = profile?.pregnancyWeek ?? 28;
  const trimester = profile?.trimester ?? "Third";
  const progressPercent = Math.round((week / 40) * 100);
  const daysLeft = profile?.daysToEstimatedDueDate ?? 112;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysLeft);
  const dueDateLabel = dueDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const trimesterMap = {
    First: "First Trimester",
    Second: "Second Trimester",
    Third: "Third Trimester",
  };
  const trimesterLabel = trimesterMap[trimester] ?? trimester;

  return (
    <div className="flex-1 flex flex-col bg-primary-50/20 min-h-screen overflow-auto">
      <div className="flex-1 flex flex-col px-4 sm:px-7 py-4 sm:py-6 gap-4">
        {/* ── HERO ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-5 sm:p-7 animate-pulse space-y-3">
              <div className="h-5 w-32 bg-gray-200 rounded-full" />
              <div className="h-7 w-64 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-2 w-full bg-gray-200 rounded-full mt-4" />
            </div>
          ) : (
            <>
              
              <div className="flex flex-col md:hidden">
               
                <div className="w-full bg-primary-100/45 flex items-center justify-center py-6">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <img
                      src={ultrasound}
                      alt="Baby ultrasound"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
               
                <div className="px-5 py-4 flex flex-col gap-2">
                 
                  <div className="flex items-center gap-2">
                    <span className="bg-[#6e8371] text-white rounded-full px-3 py-1 text-[10px] font-semibold">
                      Week {week}
                    </span>
                    <span className="text-[#7a8f7c]/85 text-xs italic font-semibold">
                      {trimesterLabel}
                    </span>
                  </div>
                  
                  <h1 className="text-base font-bold text-[#1a2a1b] leading-snug">
                    {profile?.pregnancyTipTitle ??
                      "Baby is the size of an Eggplant!"}
                  </h1>
               
                  <div className="flex justify-between text-[10px] text-[#7a8f7c] font-bold mb-1 pt-1">
                    <span>Progress: {progressPercent}%</span>
                    <span>Term: {dueDateLabel}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#e2e8e3] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4a7c59] rounded-full transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

             
              <div className="hidden md:flex min-h-[220px]">
               
                <div className="flex-1 px-7 py-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#6e8371] text-white rounded-full px-4 py-1 text-[11px] font-semibold">
                      Week {week}
                    </span>
                    <span className="text-[#7a8f7c]/85 text-[13px] italic font-semibold">
                      {trimesterLabel}
                    </span>
                  </div>
                  <h1 className="text-xl lg:text-[26px] font-bold text-[#1a2a1b] leading-snug mb-3">
                    {profile?.pregnancyTipTitle ??
                      "Baby is the size of an Eggplant!"}
                  </h1>
                  <p className="text-sm text-textColor/90 font-medium w-full lg:w-3/4 pe-4 leading-relaxed mb-3">
                    {profile?.pregnancyTip}
                  </p>
                  <div className="flex justify-between text-[11px] text-[#7a8f7c] font-bold mb-1.5 w-full lg:w-3/4 pt-4">
                    <span>Progress: {progressPercent}%</span>
                    <span>Term: {dueDateLabel}</span>
                  </div>
                  <div className="h-1.5 w-full lg:w-3/4 bg-[#e2e8e3] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4a7c59] rounded-full transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="hidden lg:flex justify-between text-[10px] text-[#7a8f7c] mt-1.5 w-3/4 font-bold uppercase tracking-wide">
                    {[
                      "Conception",
                      "Trimester 1",
                      "Trimester 2",
                      "Trimester 3",
                    ].map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                </div>
               
                <div className="w-1/3 lg:w-1/4 bg-primary-100/45 flex items-center justify-center flex-shrink-0">
                  <div className="w-40 h-40 lg:w-52 lg:h-52 rounded-full overflow-hidden border-8 border-white shadow-xl">
                    <img
                      src={ultrasound}
                      alt="Baby ultrasound"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <QuickActions doctor={profile?.doctor} />

        <div className="flex flex-col lg:flex-row gap-4 pb-4">
          <div className="flex flex-col gap-4 w-full lg:w-3/5">
            <NextAppointment />
            <LastVisitSummary token={token} />
          </div>
          <div className="w-full lg:w-2/5 lg:self-start">
            <MyPrescriptions token={token} />
          </div>
        </div>
      </div>
    </div>
  );
}
