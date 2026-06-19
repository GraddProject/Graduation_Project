export default function StatisticsCard({
  icon: Icon,
  title,
  value,
  iconColor,
  circleColor,
}) {
  return (
    <div
      className="
        bg-white
        w-full 
        py-3 sm:py-4
        px-3
        rounded-xl
        shadow-[0px_0px_2px_#171a1f1F,_0px_2px_5px_#171a1f17]
        flex items-center gap-3
      "
    >
      <div
        className="w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: circleColor }}
      >
        {Icon && <Icon size={20} className="sm:text-[22px]" style={{ color: iconColor }} />}
      </div>

      <div className="min-w-0">
        <h2 className="text-[#2C3E2FFF] font-bold text-base sm:text-[18px] truncate">
          {value}
        </h2>
        <p className="text-[#58634FFF] text-xs sm:text-[13px] truncate text-wrap">
          {title}
        </p>
      </div>
    </div>
  );
}