import React from "react";

export default function ClinicalDataCard({ feature, value, unit }) {
  const getStatusColor = (feature, value) => {
    const v = Number(value);

    switch (feature) {
      case "Age":
        return v >= 35 ? "#C97272FF" : "#4A6B4EFF";

      case "BMI":
        if (v >= 30) return "#C97272FF";
        if (v >= 25) return "#DAA520FF";
        return "#4A6B4EFF";

      case "HDL":
        return v < 50 ? "#C97272FF" : "#4A6B4EFF";

      case "Systolic BP":
        return v >= 130 ? "#C97272FF" : "#4A6B4EFF";

      case "Diastolic BP":
        return v >= 80 ? "#C97272FF" : "#4A6B4EFF";

      case "OGTT":
        return v > 140 ? "#C97272FF" : "#4A6B4EFF";

      case "Hemoglobin":
        return v < 11 ? "#C97272FF" : "#4A6B4EFF";

      default:
        return "#667E68FF";
    }
  };

  return (
    <div
      className="
        bg-[#F6F8F7FF] w-full border border-[#DEE1E6FF]
        rounded-xl py-2 px-3
        sm:py-3 sm:px-4
      "
    >
      <div className="flex flex-row items-center justify-between gap-2">
        <h3
          className="
            text-[10px] sm:text-xs
            text-[#565D6DFF]
            font-semibold uppercase
            break-words
          "
        >
          {feature}
        </h3>

        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: getStatusColor(feature, value) }}
        />
      </div>

      <div className="flex flex-row items-baseline gap-1 mt-1 flex-wrap">
        <h3 className="text-[#171A1FFF] text-lg sm:text-xl leading-tight">
          {value}
        </h3>
        <span className="text-[10px] sm:text-xs text-[#565D6DFF]">
          {unit}
        </span>
      </div>
    </div>
  );
}