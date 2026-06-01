export default function ModelSelectFeature({ label, value, onChange }) {

  return (
    <div className="flex items-center justify-between w-full rounded-xl bg-[#FAFAFAFF] p-2">
      
      <h3 className='text-[#4A6B4EFF] text-sm font-medium'>{label}</h3>

      <div
        onClick={() => onChange(value === 1 ? 0 : 1)}
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300
        ${value === 1 ? 'bg-[#4A6B4EFF]' : 'bg-[#E0E4E0FF]'}`}
      >
        <div
          className={`w-4 h-4 rounded-full transition-all duration-300
          ${value === 1 ? 'bg-white translate-x-6' : 'bg-white translate-x-0'}`}
        ></div>
      </div>

    </div>
  )
}