import React, { useState, useEffect, useContext } from "react";
import { X, Calendar, FlaskConical } from "lucide-react";
import { getInitials } from "../../helpers/getInitials";
import { formatDate } from "../../helpers/formatDate";
import ProgressBar from "../ProgressBar/ProgressBar";
import ClinicalDataCard from "../ClinicalDataCard/ClinicalDataCard";
import RiskFactorCard from "../RiskFactorCard/RiskFactorCard";
import axios from "axios";
import { UserContext } from "../context/User.context";
import Loading from "../Loading/Loading";

export default function PredictionDetails({ predictionId, onClose }) {
  const { token } = useContext(UserContext);
  const [prediction, setPrediction] = useState(null);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const getPredictionById = async (predictionId) => {
  try {
    setLoading(true);

    const res = await axios.get(
      `https://her-journey-1044023551709.us-central1.run.app/api/Doctor/predictions/${predictionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = res.data;

    const formattedPrediction = {
      id: data.predictionRecordId,
      patientName: data.patientName,
      image: data.profileImageUrl,
      type: data.type,
      date: data.date,
      result: data.result,
      confidence: data.confidence,
      clinicalData: data.inputJson ? JSON.parse(data.inputJson) : {},
      rawResponse: data.rawResponseJson
        ? JSON.parse(data.rawResponseJson)
        : {},
    };

    setPrediction(formattedPrediction);
  } catch (error) {
    console.error("Failed to fetch prediction:", error);
  } finally {
    setLoading(false);
  }
};

  const getConfidenceColor = (value) => {
    if (value >= 70) return "#C97272FF";
    if (value >= 50) return "#DAA520";
    return "#4A6B4E";
  };

  useEffect(() => {
    if (!predictionId) return;
    getPredictionById(predictionId);
  }, [predictionId]);

  const data = prediction?.clinicalData;
  const color = getConfidenceColor(prediction?.confidence);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-3 sm:p-4">



      <div
        className="
          bg-white rounded-2xl shadow-[0px_2px_4px_#00000012]
          w-full max-w-5xl
          px-3 sm:px-4
          mt-10 sm:mt-16
          h-[90vh] sm:h-auto
          overflow-y-auto
          pb-5 pt-4
        "
      >
              {loading ? ( <div className="h-[400px] flex items-center justify-center">
      <Loading text= {"Loading Prediction Details....."} />
    </div>
  ) : ( 
    <>

        {/* CLOSE */}
        <div className="flex justify-end" onClick={onClose}>
          <X size={20} className="text-[#8A9A8AFF] cursor-pointer" />
        </div>

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row gap-3 bg-white rounded-xl shadow overflow-hidden lg:mt-2 px-3 pb-3 lg:p-3 ">

          {/* LEFT */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">

            <div className="relative">
              {prediction?.image ? (
                <img
                  src={prediction?.image}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#4A6B4E] flex items-center justify-center text-white font-bold">
                  {getInitials(prediction?.patientName)}
                </div>
              )}

            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap gap-2 items-center">
                <h1 className="font-bold text-[#191B18FF] text-base sm:text-lg">
                  {prediction?.patientName}
                </h1>

                <div className="bg-[#EAF6EAFF] text-[#667E68FF] font-semibold px-2 py-1 text-xs rounded-3xl">
                  {prediction?.type} Assessment
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Calendar size={12} className="text-[#566454]" />
                <span className="text-[#a3a79f] text-xs">
                  Prediction Date: {formatDate(prediction?.date)}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-1 w-full lg:w-4/12">
            <p className="font-semibold text-xs" style={{ color }}>
              {prediction?.result} Detected
            </p>

            <div className="flex items-center gap-2">
              <ProgressBar value={prediction?.confidence} />
              <p className="text-xs font-bold">
                {prediction?.confidence}%
              </p>
            </div>
          </div>

        </div>

        {/* CLINICAL DATA */}
        <div className="flex flex-col px-3 py-4 bg-white rounded-xl shadow mt-4">

          {/* HEADER */}
          <div className="flex flex-wrap justify-between items-center border-b pb-3 gap-2">

            <div className="flex items-center gap-2">
              <FlaskConical size={19} className="text-[#667E68FF]" />
              <h2 className="font-bold text-sm">
                Clinical Data Used For Prediction
              </h2>
            </div>

            <div className="px-2 py-1 text-xs rounded-3xl bg-[#526654FF] text-white">
              12 Parameters
            </div>

          </div>

          {/* CLINICAL GRID */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4 border-b pb-6">

            {data && (
              <>
                <ClinicalDataCard feature="Age" value={data.Age} unit="years" />
                <ClinicalDataCard feature="No_of_Pregnancy" value={data.No_of_Pregnancy} unit="count" />
                <ClinicalDataCard feature="Prev. Gestation" value={data.Gestation_in_previous_Pregnancy} unit="count" />
                <ClinicalDataCard feature="BMI" value={data.BMI} unit="kg/m²" />
                <ClinicalDataCard feature="HDL" value={data.HDL} unit="mg/dL" />
                <ClinicalDataCard feature="Systolic BP" value={data.Sys} unit="mmHg" />
                <ClinicalDataCard feature="Diastolic BP" value={data.dia} unit="mmHg" />
                <ClinicalDataCard feature="Hemoglobin" value={data.Hemoglobin} unit="g/dL" />
                <ClinicalDataCard feature="OGTT" value={data.OGTT} unit="mg/dL" />
              </>
            )}

          </div>

          {/* RISK FACTORS */}
          <div className="mt-3">

            <h2 className="font-bold text-sm">
              Identified Risk Factors
            </h2>

            <div className="flex flex-wrap gap-3 mt-3">

              {data && (
                <>
                  <RiskFactorCard label="Family History" flag={data.Family_History} />
                  <RiskFactorCard label="PCOS History" flag={data.PCOS} />
                  <RiskFactorCard label="Unexplained Loss" flag={data.unexplained_prenetal_loss} />
                  <RiskFactorCard label="Previous GDM" flag={data.Prediabetes} />
                  <RiskFactorCard label="Sedentary Lifestyle" flag={data.Sedentary_Lifestyle} />
                  <RiskFactorCard label="Large Child/Birth Defect" flag={data.Large_Child_or_Birth_Default} />
                </>
              )}

            </div>

          </div>

        </div>
              </>
  )}

      </div>

    </div>
  );
}