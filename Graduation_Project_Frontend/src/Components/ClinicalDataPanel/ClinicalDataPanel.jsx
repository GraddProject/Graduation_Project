import React from "react";
import ModelInputFeature from "../ModelInputFeature/ModelInputFeature";
import ModelSelectFeature from "../ModelSelecteFeature/ModelSelectFeature";


export default function ClinicalDataPanel({
   predType,
  inputsToRender,
  risksToRender,
  values,
  setters,
  riskFactors,
  setRiskFactors,
  onGenerate,
  loading,
}) {




  return (
    <div
      className="
        bg-white w-full lg:w-7/12
        rounded-xl shadow
        mt-3
        px-3 sm:px-5
        py-3 sm:py-4
        overflow-hidden
      "
    >
      <h1 className="text-[#1A2E1CFF] mb-4 font-semibold text-sm sm:text-base">
        Set & Review Clinical Data
      </h1>

      {/* Inputs Grid */}
      <div
        className="
          grid gap-3 sm:gap-4
          grid-cols-2 sm:grid-cols-2 lg:grid-cols-3
          mt-4 border-b pb-4
        "
      >
       {inputsToRender.map((field) => (
  <ModelInputFeature
    key={field.key}
    label={field.label}
    id={field.key}
    value={values[field.key]}
    setValue={setters[field.key]}
  />
))}
      </div>

      <h2 className="text-[#4A6B4EFF] my-3 font-semibold text-sm sm:text-base">
        Risk Factors
      </h2>

      {/* Risk Factors Grid */}
      <div
        className="
          grid gap-3 sm:gap-4
          grid-cols-1 sm:grid-cols-2
          mt-4
        "
      >
        {risksToRender.map((field) => (
          <ModelSelectFeature
            key={field.key}
            label={field.label}
            value={riskFactors[field.key]}
            onChange={(val) =>
              setRiskFactors((prev) => ({
                ...prev,
                [field.key]: val,
              }))
            }
          />
        ))}
      </div>

      <button
        className="
          w-full
          bg-[#4A6B4EFF] text-white
          rounded-xl mt-4
          py-2 sm:py-3
          text-sm sm:text-base
          hover:opacity-90 transition
          disabled:opacity-60
          active:scale-[0.99]
        "
        onClick={onGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Prediction"}
      </button>
    </div>
  );
}