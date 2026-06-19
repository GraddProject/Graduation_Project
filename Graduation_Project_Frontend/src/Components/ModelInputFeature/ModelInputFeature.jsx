import React from "react";

export default function ModelInputFeature({ label, value, setValue, id}) {
  return (
    <div className="flex flex-col gap-1 w-full ">
      <label
        htmlFor={id}
        className="text-[#4A6B4EFF] text-xs ml-1 font-semibold"
      >
        {label}
      </label>

      <div className="bg-[#F4FBF4FF] border border-[#c3c4c3] rounded-[12px] pl-2 py-2 w-full ">
        <input
          type="number"
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-full pr-2 outline-none bg-transparent text-[#1A2E1CFF]"
        />
      </div>
    </div>
  );
}