export default function StatisticsCard({ icon: Icon, title, value, iconColor, circleColor }) {
  return (
    <div className='bg-white w-3/12 py-4 px-3 rounded-xl shadow-[0px_0px_2px_#171a1f1F,_0px_2px_5px_#171a1f17] flex items-center gap-3'>
      
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: circleColor }}
      >
        {Icon && (
          <Icon size={22} style={{ color: iconColor }} />
        )}
      </div>

      <div className='mr-10'>
        <h2 className='text-[#2C3E2FFF] font-bold text-[18px]'>{value}</h2>
        <p className='text-[#58634FFF] text-[13px]'>{title}</p>
      </div>
      

    </div>
  );
}