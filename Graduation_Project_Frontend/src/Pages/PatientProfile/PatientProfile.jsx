import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../Components/context/User.context";
import { Mail, Phone, Calendar, MapPin, Briefcase, Pencil , Loader2 , AlertCircle } from "lucide-react";

import ProgressBar from "../../Components/ProgressBar/ProgressBar";
import { riskStyles, normalizeRisk } from "../../helpers/riskStyle";
import MedicalProfileForm from "../../Components/MedicalProfileForm/MedicalProfileForm";
import { calculateAge } from "../../helpers/calculateAge";
import Loading from "../../Components/Loading/Loading";
import axios from "axios";


export default function PatientProfile() {
  const { user } = useContext(UserContext);

  const [imageError, setImageError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const getMyProfile = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Patient/Profile",
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      setProfile(data);
    } catch (err) {
      setError("Failed to load profile");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  console.log(profile)

  useEffect(() => {
    getMyProfile();
  }, []);

  if (loading) {
    return (
      <Loading text={"Preparing your profile"} />
    )
  }

  if (error) {
    return (
            <div className="flex items-center justify-center py-8 gap-2 text-red-400 text-xs">
              <AlertCircle size={14} /> {error}

              </div>
    );
  }

  if (!profile) return null;

  const progressPercentage = (profile.pregnancyWeek / 40) * 100;

  const BMI =
    profile.weightKg /
    ((profile.heightCm / 100) * (profile.heightCm / 100));

  const gdmRiskStyle =
    riskStyles[normalizeRisk(profile.gdmRisk)] || {
      color: "#6B7280",
      backgroundColor: "#F3F4F6",
      label: "Not Predicted",
    };

  const preeclampsiaRiskStyle =
    riskStyles[normalizeRisk(profile.preeclampsiaRisk)] || {
      color: "#6B7280",
      backgroundColor: "#F3F4F6",
      label: "Not Predicted",
    };


  const personalInfo = [
    {
      icon: Calendar,
      label: "DOB",
      value: profile.dateOfBirth,
    },
      {
    icon: Calendar,
    label: "Age",
    value: calculateAge(profile.dateOfBirth),
  },
    {
      icon: Phone,
      label: "Phone",
      value: profile.phoneNumber,
    },
    {
      icon: Mail,
      label: "Email",
      value: profile.email,
    },
  ];

  const doctorInfo = [
    {
      icon: Mail,
      label: "Email",
      value: profile.doctor.email,
    },
    {
      icon: Phone,
      label: "Phone",
      value: profile.doctor.phoneNumber,
    },
    {
      icon: MapPin,
      label: "Location",
      value: profile.doctor.location,
    },
    {
      icon: Briefcase,
      label: "Experience",
      value: `${profile.doctor.yearsOfExperience} Years`,
    },
  ];

  const StatCard = ({ label, value }) => (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-[#2C3E2F]">{value}</p>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen ">

      <div className="flex bg-white rounded-xl shadow overflow-hidden pr-4">
        <div className="w-[4px] bg-gradient-to-b from-[#4A5F4E] to-[#667E68]" />

        <div className="flex flex-row justify-between w-full items-center">

          <div className="flex flex-row items-center gap-3 py-4 px-2">
            <div className="relative">
              {profile.profileImageUrl && !imageError ? (
                <img
                  src={profile.profileImageUrl}
                  onError={() => setImageError(true)}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#4A6B4E] flex items-center justify-center text-white font-bold">
                  {profile.displayName?.[0]}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-2">
                <h1 className="font-bold text-lg text-[#191B18FF]">
                  {profile.displayName}
                </h1>
                <button onClick={() => setShowForm(true)}
                  className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#2d4a2d] transition-colors ml-1"
                >
                  <Pencil size={11} /> Edit
                </button>
              </div>
              <span className="text-xs text-[#637465]">
                {profile.email}
              </span>
            </div>
          </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
          <StatCard label="Blood" value={profile.bloodType} />
          <StatCard label="Height" value={`${profile.heightCm} cm`} />
          <StatCard label="Weight" value={`${profile.weightKg} kg`} />
          <StatCard label="Pregnancies" value={profile.numberOfPregnancies} />
        </div>

          <div>
            <div className="flex justify-between w-full gap-20 mb-2">
              <p className="text-sm text-[#637465]">
                Pregnancy Progress
              </p>

              <p className="text-sm text-[#4A5F4EFF]">
                Week {profile.pregnancyWeek} / {profile.trimester}
              </p>
            </div>

            <ProgressBar value={progressPercentage} color="#667E68" />
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-5 mt-6">

        <div className="flex bg-white rounded-xl shadow overflow-hidden w-4/12">
          {/* <div className="w-[4px] bg-gradient-to-b from-[#4A5F4E] to-[#667E68]" /> */}

          <div className="w-full px-5 py-5 space-y-4">

            <h3 className="font-semibold">Health Overview</h3>

            <div className="flex flex-col gap-2 border-b border-b-[#E0E8E0FF] pb-3">
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-[#2C3E2FFF] text-sm">BMI</h2>
                <p className="text-sm font-semibold px-2 py-1">
                  {BMI.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between border-b border-b-[#E0E8E0FF] pb-3">
              <h2 className="text-[#2C3E2FFF] text-sm">
                Pregnancy Week
              </h2>
              <p className="text-sm font-semibold px-2 py-1">
                {profile.pregnancyWeek}
              </p>
            </div>

            <div className="flex flex-col gap-3 border-b border-b-[#E0E8E0FF] pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[#2C3E2FFF] text-sm">
                  GDM Risk
                </h2>

                <span
                  style={{
                    color: gdmRiskStyle.color,
                    backgroundColor: gdmRiskStyle.backgroundColor,
                  }}
                  className="px-3 py-1 text-xs rounded-full font-medium"
                >
                  {gdmRiskStyle.label}
                </span>
              </div>

              {gdmRiskStyle.label !== "Not Predicted" && (
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar
                      value={profile.gdmConfidencePercentage}
                      color={gdmRiskStyle.color}
                    />
                  </div>

                  <span
                    className="text-xs font-semibold"
                    style={{ color: gdmRiskStyle.color }}
                  >
                    {profile.gdmConfidencePercentage}%
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3  border-b border-b-[#E0E8E0FF] pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[#2C3E2FFF] text-sm">
                  Preeclampsia Risk
                </h2>

                <span
                  style={{
                    color: preeclampsiaRiskStyle.color,
                    backgroundColor: preeclampsiaRiskStyle.backgroundColor,
                  }}
                  className="px-3 py-1 text-xs rounded-full font-medium"
                >
                  {preeclampsiaRiskStyle.label}
                </span>
              </div>

              {preeclampsiaRiskStyle.label !== "Not Predicted" && (
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar
                      value={profile.preeclampsiaConfidencePercentage}
                      color={preeclampsiaRiskStyle.color}
                    />
                  </div>

                  <span
                    className="text-xs font-semibold"
                    style={{ color: preeclampsiaRiskStyle.color }}
                  >
                    {profile.preeclampsiaConfidencePercentage}%
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="flex bg-white rounded-xl shadow overflow-hidden w-4/12">
          {/* <div className="w-[4px] bg-gradient-to-b from-[#4A5F4E] to-[#667E68]" /> */}

          <div className="w-full px-5 py-5 space-y-4">

            <h3 className="font-semibold">Personal Information</h3>

            <div className="flex flex-col gap-5">
              {personalInfo.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-b-[#E0E8E0FF] pb-5"
                >
                  <div className="flex items-center gap-2 text-sm text-[#2C3E2FFF]">
                    <Icon size={16} />
                    {label}
                  </div>

                  <span className="text-sm font-medium">
                    {value}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="flex bg-white rounded-xl shadow overflow-hidden w-4/12">
      
          <div className="w-full px-5 py-5 space-y-4">

            <h3 className="font-semibold">My Doctor</h3>

            <div className="flex items-center gap-3  pb-3">
              <img
                src={profile.doctor.profileImageUrl}
                className="w-14 h-14 rounded-full object-cover"
              />

              <div className="flex flex-col gap-2">
                <p className="font-medium text-[#2C3E2FFF]">
                  {profile.doctor.displayName}
                </p>

                <div className="flex flex-wrap gap-1">
                  {profile.doctor.specializations?.map((spec, i) => (
                    <div
                      key={i}
                      className="bg-[#eef4ee] border border-[#c8ddc8] rounded-2xl py-1 px-3"
                    >
                       <p className="text-[#2d4a2d] text-xs">
                      {spec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {doctorInfo.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center mt-2 justify-between border-b border-b-[#E0E8E0FF] pb-3"
                >
                  <div className="flex items-center gap-2 text-sm text-[#2C3E2FFF]">
                    <Icon size={16} />
                    {label}
                  </div>

                  <span className="text-sm font-medium">
                    {value}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
        {showForm && (
          <MedicalProfileForm
            mode="edit"
            profile={profile}
            user={user}
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              getMyProfile();
              setShowForm(false);
            }}
          />
        )}

      </div>
    </div>
  );
}