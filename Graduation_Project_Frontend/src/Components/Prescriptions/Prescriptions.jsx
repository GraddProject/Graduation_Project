import React from "react";
import { Plus } from "lucide-react";

export default function Prescriptions({ value, onChange, isEditPrescription }) {

  const addMedicine = () => {
    onChange([
      ...value,
      { name: "", dosage: "", duration: "", instruction: "" }
    ]);
  };

  const handleChange = (index, field, newValue) => {
    const updated = [...value];
    updated[index][field] = newValue;
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2 mt-5">


      <div className="flex flex-row items-center justify-between">
        <h2 className="text-[#565D6DFF] text-[13px]">
          Prescriptions
        </h2>

        {!isEditPrescription && (
          <button
            onClick={addMedicine}
            className="flex flex-row items-center gap-1 text-xs text-[#565D6DFF] font-semibold"
          >
            <Plus size={16} />
            ADD MEDICINE
          </button>
        )}
      </div>

      {/* MEDICINES */}
      {value.map((med, index) => (
        <div
          key={index}
          className="border border-[#DEE1E6FF] rounded-lg px-2 py-3 flex flex-col gap-2"
        >

          {/* ROW 1 */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="text"
              value={med.name}
              onChange={(e) =>
                handleChange(index, "name", e.target.value)
              }
              className="w-full sm:flex-1 bg-[#F5F6F480] border border-[#DEE1E6FF] rounded-lg px-2 py-1 focus:outline-none placeholder:text-xs"
              placeholder="Medicine Name"
            />

            <input
              type="text"
              value={med.dosage}
              onChange={(e) =>
                handleChange(index, "dosage", e.target.value)
              }
              className="w-full sm:flex-1 bg-[#F5F6F480] border border-[#DEE1E6FF] rounded-lg px-2 py-1 focus:outline-none placeholder:text-xs"
              placeholder="e.g. 1 tablet twice daily"
            />
          </div>

          {/* ROW 2 */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="text"
              value={med.duration}
              onChange={(e) =>
                handleChange(index, "duration", e.target.value)
              }
              className="w-full sm:flex-1 bg-[#F5F6F480] border border-[#DEE1E6FF] rounded-lg px-2 py-1 focus:outline-none placeholder:text-xs"
              placeholder="Duration (e.g. 30 days)"
            />

            <input
              type="text"
              value={med.instruction}
              onChange={(e) =>
                handleChange(index, "instruction", e.target.value)
              }
              className="w-full sm:flex-1 bg-[#F5F6F480] border border-[#DEE1E6FF] rounded-lg px-2 py-1 focus:outline-none placeholder:text-xs"
              placeholder="Instruction (e.g. After meals)"
            />
          </div>

        </div>
      ))}
    </div>
  );
}