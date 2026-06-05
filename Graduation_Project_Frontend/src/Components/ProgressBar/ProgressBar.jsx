export default function ProgressBar({ width ="100%", value = 0, color, bgColor , risk }) {


  const riskColors = {
    low: "#4A6B4E",
    medium: "#DAA520",
    high: "#D7263D",
  };

  const ranges = [
    { max: 45, color: riskColors.low },
    { max: 65, color: riskColors.medium },
    { max: 100, color: riskColors.high },
  ];

  const getColor = () => {
    if (color) return color;
    if (risk && riskColors[risk]) return riskColors[risk];
    return ranges.find((r) => value <= r.max)?.color || "#9CA3AF";
  };

  return (
    <div
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        backgroundColor: bgColor || "#F3F4F6FF"
      }}
      className="h-[9px] rounded-full overflow-hidden"
    >
      <div
        className="h-full transition-all duration-500"
        style={{
          width: `${value}%`,
          backgroundColor: getColor()
        }}
      />
    </div>
  );
}