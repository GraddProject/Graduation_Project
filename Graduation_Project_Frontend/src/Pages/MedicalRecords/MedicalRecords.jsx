import React, { useEffect, useState, useContext } from "react";
import { ArrowUpDown } from "lucide-react";
import axios from "axios";
import { UserContext } from "../../Components/context/User.context";
import MedicalHistoryCard from "../../Components/MedicalHistoryCard/MedicalHistoryCard";

export default function MedicalRecords() {
  const { token } = useContext(UserContext);

  const [medicalHistories, setMedicalHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasPrediction, setHasPrediction] = useState(null);
  const [sort, setSort] = useState("Newest");

  const getMyMedicalHistory = async (
    predictionFilter = hasPrediction,
    sortOrder = sort
  ) => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Patient/GetMyMedicalHistories",
        {
          params: {
            ...(predictionFilter !== null && {
              HasPrediction: predictionFilter,
            }),
            Sort: sortOrder,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const list = Array.isArray(data)
        ? data
        : data.data || data.history || [];

      const formattedMedicalHistory = list.map((monthGroup) => ({
        month: monthGroup.month,
        items: monthGroup.items.map((item) => ({
          medicalId: item.medicalHistoryId,
          diagnosis: item.diagnosis,
          vitalSigns: item.vitalSigns,
          notes: item.notes,
          addDate: item.createdAt,
          date: item.date,
          time: item.time,
          hasPrediction: item.hasPrediction,
          prediction: item.prediction
            ? {
                predictionRecordId: item.prediction.predictionRecordId,
                type: item.prediction.type,
                result: item.prediction.result,
                riskLevel: item.prediction.riskLevel,
                confidencePercentage:
                  item.prediction.confidencePercentage,
                createdAt: item.prediction.createdAt,
              }
            : null,
          prescriptions:
            item.prescriptions?.map((p) => ({
              id: p.prescriptionId,
              medicationName: p.medicationName,
              dosage: p.dosage,
              duration: p.duration,
              instructions: p.instructions,
              createdAt: p.createdAt,
            })) || [],
        })),
      }));

      setMedicalHistories(formattedMedicalHistory);
      console.log("Medical:", formattedMedicalHistory);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyMedicalHistory();
  }, []);

  return (
    <div className="px-3 lg:px-8 py-6 flex flex-col gap-10 w-full">

      {/* FILTER BAR */}
      <div className="bg-white p-4 flex flex-row items-center gap-5 rounded-xl shadow-[0px_4px_7px_#171a1f21,0px_0px_2px_#171a1f14] w-full">

        <button
          onClick={() => {
            setHasPrediction(null);
            getMyMedicalHistory(null, sort);
          }}
          className={`px-5 py-1 rounded-xl text-sm transition-all ${
            hasPrediction === null
              ? "bg-[#4A5F4EFF] text-white"
              : "border border-[#E8EBE8FF] text-[#58634FFF] bg-white"
          }`}
        >
          All
        </button>

        <button
          onClick={() => {
            setHasPrediction(true);
            getMyMedicalHistory(true, sort);
          }}
          className={`px-5 py-1 rounded-xl text-sm transition-all ${
            hasPrediction === true
              ? "bg-[#4A5F4EFF] text-white"
              : "border border-[#E8EBE8FF] text-[#58634FFF] bg-white"
          }`}
        >
          Has Prediction
        </button>

        <div className="border-l border-[#E8EBE8FF] h-7" />

        <button
          onClick={() => {
            const newSort = sort === "Newest" ? "Oldest" : "Newest";
            setSort(newSort);
            getMyMedicalHistory(hasPrediction, newSort);
          }}
          className="border border-[#E8EBE8FF] text-[#58634FFF] flex flex-row items-center text-sm gap-2 rounded-xl py-1 px-5"
        >
          <ArrowUpDown size={16} className="sm:w-[14px] sm:h-[14px]" />
          {sort}
        </button>
      </div>

      {/* TIMELINE LIST */}
      <div className="w-full">
        <div className="relative">

          {medicalHistories.map((monthGroup, monthIndex) => (
            <div key={monthIndex} className="relative mb-10 md:pl-12">

              {/* LINE (desktop only) */}
              <div className="hidden md:block absolute left-3 top-0 bottom-[-40px] w-[2px] bg-[#D7E4D8]" />

              {/* DOT (desktop only) */}
              <div className="hidden md:block absolute left-[2px] top-1 w-5 h-5 rounded-full border-[3px] border-[#667E68FF] bg-white z-10" />

              {/* MONTH TITLE */}
              <h2 className="text-[#667E68FF] font-semibold mb-5 md:text-left text-center">
                {monthGroup.month}
              </h2>

              {/* ITEMS */}
              <div className="flex flex-col gap-4">
                {monthGroup.items.map((item) => (
                  <MedicalHistoryCard
                    key={item.medicalId}
                    mode="patientView"
                    MedicalHistory={{
                      addDate: item.addDate,
                      diagnosis: item.diagnosis,
                      vitalSigns: item.vitalSigns,
                      notes: item.notes,
                      prediction: item.prediction,
                      preScriptions: item.prescriptions,
                    }}
                    MedicalId={item.medicalId}
                  />
                ))}
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}