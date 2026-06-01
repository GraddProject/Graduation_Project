export default function ProgressBar({ width ="100%", value = 0, color, bgColor }) {

  const ranges = [
    { max: 45, color: "#4A6B4EFF" },
    { max: 65, color: "#DAA520FF" },
    { max: 100, color: "#C97272FF" },
  ];

  const getColor = () => {
    if (color) return color;
    return ranges.find(r => value <= r.max)?.color || "#9CA3AF";
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