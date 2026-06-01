import React from "react";
import { PieChart, Pie, Cell } from "recharts";

export default function PredictionLevelCharts({ values = [] , totalPatients = 0 }) {

  const COLORS = ["#C97272FF" , "#DAA520FF", "#4A6B4EFF" ];

  const data = values.map((val, index) => ({
    name: `item-${index}`,
    value: val,
  }));


  return (
      <PieChart width={130} height={130}>
      <Pie
        data={data}
        dataKey="value"
        startAngle={90}
        endAngle={-270}
        innerRadius={45}
        outerRadius={64}
        stroke="white"
        strokeWidth={4}
        paddingAngle={0}
        isAnimationActive={false}
      >
        {data.map((_, index) => (
          <Cell
            key={index}
            fill={COLORS[index] || "#ccc"}
          />
        ))}
      </Pie>

      {/* Center Text */}
      <g>
        <text
          x={65}
          y={65}
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
        >
          {totalPatients}
        </text>

        <text
          x={65}
          y={85}
          textAnchor="middle"
          fontSize="12"
          fill="#666"
        >
          Patients
        </text>
      </g>
    </PieChart>

  );
}