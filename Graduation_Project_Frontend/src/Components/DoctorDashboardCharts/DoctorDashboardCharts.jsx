import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";

export default function DoctorDashboardCharts() {

  const COLORS = {
    primary: "#D6EDD7",
    primaryDark: "#667E68FF",
    text: "#151915FF",
    muted: "#546454FF",
    border: "#667E681A",
    red: "#CA001E",
    orange: "#bfcebd",
    blue: "#2196F3",
  };

  const diseaseData = [
    { name: "GDM", value: 60 },
    { name: "PE", value: 40 },
  ];

  const total = diseaseData.reduce((acc, cur) => acc + cur.value, 0);

  const gdmRiskData = [
    { name: "GDM", high: 15, medium: 25, low: 20 },
  ];

  const peRiskData = [
    { name: "PE", high: 10, medium: 18, low: 12 },
  ];

  const stageData = [
    { stage: "1st Trimester", cases: 20 },
    { stage: "2nd Trimester", cases: 35 },
    { stage: "3rd Trimester", cases: 25 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">

      <div className="bg-white p-4 rounded-2xl border" style={{ borderColor: COLORS.border }}>
        <h2 className="text-sm font-semibold text-[#151915FF] mb-2">
          Disease Distribution
        </h2>

        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={diseaseData}
              dataKey="value"
              outerRadius={70}
              label={({ name, value }) =>
                `${name} ${(value / total * 100).toFixed(0)}%`
              }
            >
              <Cell fill={COLORS.primaryDark} />
              <Cell fill={COLORS.primary} />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-2xl border" style={{ borderColor: COLORS.border }}>
        <h2 className="text-sm font-semibold text-[#151915FF] mb-2">
          GDM Risk Level
        </h2>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={gdmRiskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="high" fill={COLORS.red} />
            <Bar dataKey="medium" fill={COLORS.orange} />
            <Bar dataKey="low" fill={COLORS.primaryDark} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-2xl border" style={{ borderColor: COLORS.border }}>
        <h2 className="text-sm font-semibold text-[#151915FF] mb-2">
          Preeclampsia Risk Level
        </h2>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={peRiskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="high" fill={COLORS.red} />
            <Bar dataKey="medium" fill={COLORS.orange} />
            <Bar dataKey="low" fill={COLORS.primaryDark} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-2xl border " style={{ borderColor: COLORS.border }}>
        <h2 className="text-sm font-semibold text-[#151915FF] mb-2">
          Pregnancy Stages Distribution
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cases" fill={COLORS.primaryDark} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}