import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#4A5F4EFF", "#F4FBF4FF"];

export default function MyChart({ percentage = 0 }) {
  const safeValue = Math.min(Math.max(percentage, 0), 100);

  const data = [
    { name: "Booked", value: safeValue },
    { name: "Remaining", value: 100 - safeValue },
  ];

  const renderCenterText = (props) => {
    const { cx, cy } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="#000"
        >
          {safeValue}%
        </text>

        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fontSize="12"
          fill="#666"
        >
          Booked
        </text>
      </g>
    );
  };

  return (
    <PieChart width={180} height={180}>
      <Pie
        data={data}
        dataKey="value"
        startAngle={90}
        endAngle={-270}
        innerRadius={50}
        outerRadius={64}
        stroke="none"
        paddingAngle={0}
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>

      {renderCenterText({ cx: 90, cy: 90 })}
    </PieChart>
  );
}