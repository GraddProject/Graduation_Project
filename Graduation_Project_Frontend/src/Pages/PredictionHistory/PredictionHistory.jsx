import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../Components/context/User.context";
import { List, ChartColumn } from "lucide-react";
import axios from "axios";

import { getInitials } from "../../helpers/getInitials";
import Loading from "../../Components/Loading/Loading"; 
import PredictionLevelCharts from "../../Components/PredictionLevelCharts/PredictionLevelCharts";
import PredictionPatientCard from "../../Components/PredictionPatientCard/PredictionPatientCard";
import PredictionDetails from "../../Components/PredictionDetails/PredictionDetails";
import DetailedMedicalRecord from "../../Components/DetailedMedicalRecord/DetailedMedicalRecord";
import PredictionRiskCard from "../../Components/PredictionRiskCard/PredictionRiskCard";

export default function PredictionHistory() {
  const { token } = useContext(UserContext);

  const [predictions, setPredictions] = useState([]);
  const [riskDashboard, setRiskDashboard] = useState([]);
  const [view, setView] = useState("list");

  const [loadingPredictions, setLoadingPredictions] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const [selectedPredictionId, setSelectedPredictionId] = useState(null);
  const [selectedMedicalHistoryId, setSelectedMedicalHistoryId] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patient, setPatient] = useState(null);

  const [showAll, setShowAll] = useState(false);

  const pageLoading = loadingPredictions || loadingDashboard;

  const getAllPredictions = async () => {
    try {
      setLoadingPredictions(true);

      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/PredictionsList",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const list = Array.isArray(data) ? data : [];

      setPredictions(
        list.map((p) => ({
          id: p.predictionRecordId,
          patientId: p.patientId,
          medicalHistoryId: p.medicalHistoryId,
          patientName: p.patientName,
          patientImage: p.profileImageUrl,
          predicationType: p.type,
          predicationDate: p.date,
          predicationResult: p.result,
          predicationConfidence: p.confidence,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPredictions(false);
    }
  };

  const getRiskDashboard = async () => {
    try {
      setLoadingDashboard(true);

      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/risk-dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRiskDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    if (token) {
      getAllPredictions();
      getRiskDashboard();
    }
  }, [token]);

  const visiblePredictions = showAll
    ? predictions
    : predictions.slice(0, 7);

  if (pageLoading) {
    return <Loading text="Loading prediction history..." />;
  }

  return (
    <div className="px-3 lg:px-8 py-4">

      <div className="bg-white w-full rounded-xl shadow px-5 py-2 flex justify-between items-center">
        <h1 className="text-[#1A2E1CFF] font-semibold">
          {view === "list"
            ? "Prediction History"
            : "Prediction Risk Overview"}
        </h1>

        <div className="flex gap-2">
          <div
            onClick={() => setView("list")}
            className={`p-2 rounded cursor-pointer ${
              view === "list" ? "bg-white" : "text-gray-400"
            }`}
          >
            <List />
          </div>

          <div
            onClick={() => setView("chart")}
            className={`p-2 rounded cursor-pointer ${
              view === "chart" ? "bg-white" : "text-gray-400"
            }`}
          >
            <ChartColumn />
          </div>
        </div>
      </div>

      <div className="mt-4">

        {view === "chart" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {riskDashboard.map((item) => (
              <PredictionRiskCard key={item.type} riskData={item} />
            ))}
          </div>
        ) : (
          <>
            <div className="hidden md:block pt-6 pb-3 pl-5">
              <div className="grid grid-cols-[1.4fr_1.2fr_1fr_1.2fr_1.5fr_2fr] uppercase text-[13px] text-[#2C3E2FFF] font-bold">
                <div>Patient</div>
                <div>Type</div>
                <div>Date</div>
                <div>Result</div>
                <div>Confidence</div>
                <div>Action</div>
              </div>
            </div>

            {predictions.length === 0 ? (
              <div className="flex flex-wrap lg:flex-col  gap-3 w-full px-2 md:px-2 py-20 text-gray-400">
                <List size={40} />
                <p className="mt-2">No prediction history available</p>
              </div>
            ) : (
              visiblePredictions.map((prediction) => (
                
                <PredictionPatientCard
                  key={prediction.id}
                  {...prediction}
                  onViewDetails={() =>
                    setSelectedPredictionId(prediction.id)
                  }
                  showMedical={(medicalHistoryId, patientId) => {
                    setSelectedMedicalHistoryId(medicalHistoryId);
                    setSelectedPatientId(patientId);
                  }}
                />
              ))
            )}
          </>
        )}
      </div>

      {predictions.length > 7 && view === "list" && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-1 bg-[#4A6B4EFF] text-white rounded-3xl"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>
      )}

      {selectedPredictionId && (
        <PredictionDetails
          predictionId={selectedPredictionId}
          onClose={() => setSelectedPredictionId(null)}
        />
      )}

      {selectedMedicalHistoryId && (
        <DetailedMedicalRecord
          medicalHistoryId={selectedMedicalHistoryId}
          patientId={selectedPatientId}
          onClose={() => setSelectedMedicalHistoryId(null)}
          patientInfo={{
            name: patient?.name,
            week: patient?.week,
            imageUrl: patient?.imageUrl,
            initials: getInitials(patient?.name),
          }}
        />
      )}
    </div>
  );
}